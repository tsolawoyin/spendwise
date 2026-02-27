"use server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as SupaClient } from "@supabase/supabase-js";
import webpush from "web-push";

import { NotificationPayload, CreateNotificationParams } from "@/providers/push-notification-context";

webpush.setVapidDetails(
  "mailto:contact@amora.ng",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

interface PS {
  endpoint: string;
  expirationTime: number;
  keys: {
    p256dh: string;
    auth: string;
  };
}

let subscription: PS | null = null;

export async function subscribeUser(sub: PS, userId: string) {
  subscription = sub;
  const supabase = await createClient();

  if (subscription) {
    const subscriptionObject = {
      user_id: userId,
      endpoint: subscription.endpoint,
      expiration_time: subscription.expirationTime,
      keys: subscription.keys,
    };

    const { data, error } = await supabase
      .from("push_subscriptions")
      .upsert(subscriptionObject)
      .select()
      .single();

    if (error) return { success: false };

    return { success: true };
  } else {
    return { success: false };
  }
}

export async function unsubscribeUser(userId: string) {
  subscription = null;
  const supabase = await createClient();

  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("user_id", userId);

  if (error) return { success: false };

  return { success: true };
}

export async function sendNotification(
  userId: string,
  payload: NotificationPayload
) {
  const supabase = SupaClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!, // ← Service role key
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  // 1. Get all subscriptions for this user
  const { data: subscriptions, error } = await supabase
    .from("push_subscriptions")
    .select("*")
    .eq("user_id", userId);

  if (error || !subscriptions?.length) {
    console.log("No subscriptions found for user:", userId);
    return { success: false, error: "No subscriptions" };
  }

  // 2. Prepare the notification payload
  const notificationData = JSON.stringify({
    title: payload.title,
    body: payload.body,
    icon: payload.icon || "/android-launchericon-192-192.png",
    badge: payload.badge || "/android-launchericon-72-72.png",
    data: payload.data || {},
    actions: payload.actions || [],
  });

  // 3. Send to all user's subscriptions
  const results = await Promise.allSettled(
    subscriptions.map(async (subscription) => {
      // console.log(subscription);
      try {
        const pushSubscription = {
          endpoint: subscription.endpoint,
          expiryTime: subscription.expiration_time,
          keys: subscription.keys,
        };
        // Add timeout and TTL options
        const options = {
          TTL: 60 * 60 * 24,
          timeout: 10000, // 10 seconds
        };
        // This is where the magic happens!
        await webpush.sendNotification(pushSubscription, notificationData, options);

        return {
          success: true,
          endpoint: subscription.endpoint,
        };
      } catch (error: any) {
        console.error("Push send error:", error);

        // Handle expired/invalid subscriptions
        if (error.statusCode === 410 || error.statusCode === 404) {
          // Subscription is no longer valid, delete it
          await supabase
            .from("push_subscriptions")
            .delete()
            .eq("id", subscription.id);

          // console.log("Deleted invalid subscription:", subscription.id);
        }

        return {
          success: false,
          error: error.message,
          endpoint: subscription.endpoint,
        };
      }
    })
  );

  // 4. Return summary of results
  const successful = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return {
    success: true,
    sent: successful,
    failed: failed,
    results,
  };
}

export async function notifyAdmins(title: string, body: string, actionUrl?: string) {
  const supabase = createAdminClient();

  const { data: admins, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "admin");

  if (error || !admins?.length) {
    return { success: false, sent: 0 };
  }

  const results = await Promise.allSettled(
    admins.map((admin) =>
      sendNotification(admin.id, {
        title,
        body,
        data: { url: actionUrl },
      })
    )
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  return { success: true, sent };
}

export async function createNotification(params: CreateNotificationParams) {
  try {
    await sendNotification(params.userId, {
      title: params.title,
      body: params.body,
      icon: params.icon || "/icon-192x192.png",
      data: {
        // notificationId: notification.id, // ← Link to DB record
        type: params.type,
        url: params.actionUrl,
        ...params.data,
      },
    });
  } catch (pushError: any) {
    // console.log
  }

  return { success: true };
}
