import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function usePushNotifications() {
  const { user } = useAuth();
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported("Notification" in window && "serviceWorker" in navigator);
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      toast.error("Push notifications are not supported on this browser");
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === "granted") {
      toast.success("Push notifications enabled! 🔔");
      // Send a welcome notification
      new Notification("RankSprout 🌱", {
        body: "You'll now get SEO alerts and weekly reports!",
        icon: "/pwa-192x192.png",
        badge: "/pwa-192x192.png",
      });
      return true;
    } else {
      toast.error("Notification permission denied");
      return false;
    }
  }, [isSupported]);

  const sendLocalNotification = useCallback(
    (title: string, body: string) => {
      if (permission !== "granted") return;
      new Notification(title, {
        body,
        icon: "/pwa-192x192.png",
        badge: "/pwa-192x192.png",
      });
    },
    [permission]
  );

  return {
    isSupported,
    permission,
    requestPermission,
    sendLocalNotification,
  };
}
