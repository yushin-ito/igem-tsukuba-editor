import { useState, useCallback, useEffect } from "react";

import { urlBase64ToUint8Array } from "@/lib/notification";
import env from "@/env";

const useNotification = () => {
  const [supported, setSupported] = useState(true);
  const [permission, setPermission] = useState<
    NotificationPermission | "unknown"
  >("unknown");
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );

  const register = useCallback(async () => {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }, []);

  useEffect(() => {
    if (
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window
    ) {
      setPermission(Notification.permission);
    }

    if ("serviceWorker" in navigator && "PushManager" in window) {
      register();
    }

    if (!("serviceWorker" in navigator && "PushManager" in window)) {
      setSupported(false);
    }
  }, [register]);

  const request = async () => {
    if (!("Notification" in window)) {
      return;
    }

    const permission = await Notification.requestPermission();
    setPermission(permission);
  };

  const subscribe = useCallback(async () => {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      ),
    });

    setSubscription(sub);

    const response = await fetch("/api/subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sub),
    });

    return response;
  }, []);

  const unsubscribe = useCallback(async () => {
    await subscription?.unsubscribe();
    setSubscription(null);

    const response = await fetch(
      `/api/subscription/${subscription?.endpoint}`,
      {
        method: "DELETE",
      }
    );

    return response;
  }, [subscription]);

  return {
    permission,
    supported,
    subscribe,
    unsubscribe,
    request,
  };
};

export default useNotification;
