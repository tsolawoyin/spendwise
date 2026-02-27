"use client";

import {
  subscribeUser,
  unsubscribeUser,
  createNotification,
} from "@/utils/notification-actions";

import {
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";

import { useApp } from "./app-provider";

interface PushNotificationCTX {
  isSupported: boolean;
  subscription: PushSubscription | null;
  subscribeToPush: () => void;
  unsubscribeFromPush: () => void;
  sendClientNotification: (payload: CreateNotificationParams) => void;
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
  }>;
  type?: string;
  actionUrl?: string;
  groupKey?: string;
}

export interface CreateNotificationParams {
  userId: string;
  title: string;
  body: string;
  type?: string;
  icon?: string;
  badge?: string;
  data?: any;
  actionUrl?: string;
  groupKey?: string;
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

const PushNotificationContext = createContext<PushNotificationCTX | null>(null);

export default function PushNotification({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useApp();
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, [user]);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    // this is subscription
    const sub = await registration.pushManager.getSubscription();

    if (!sub && user) {
      // only subscribe for signed in users
      // attempt to request for sub
      await subscribeToPush();
      return;
    }

    setSubscription(sub);
  }

  async function subscribeToPush() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        ),
      });
      setSubscription(sub);
      const serializedSub = JSON.parse(JSON.stringify(sub));
      if (user) {
        let status = await subscribeUser(serializedSub, user.id);
        if (status.success) {
          sendClientNotification({
            userId: user.id,
            title: "Notification enabled",
            body: "Thank you for enabling notification for JustWash",
          });
        }
      }
    } catch (error) {
      // debug.log(error);
    }
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    if (user) {
      // debug.log("unsubscribing user....");
      await unsubscribeUser(user.id);
    }
  }

  async function sendClientNotification(payload: CreateNotificationParams) {
    let res = await createNotification(payload);
    // debug.log(res);
  }

  return (
    <PushNotificationContext.Provider
      value={{
        isSupported,
        // message,
        subscription,
        sendClientNotification,
        // setMessage,
        subscribeToPush,
        unsubscribeFromPush,
      }}
    >
      {children}
    </PushNotificationContext.Provider>
  );
}

export function usePushNotification() {
  const context = useContext(PushNotificationContext);

  if (!context) {
    throw new Error("usePushNotification must be used within Push Provider");
  }

  return context;
}
