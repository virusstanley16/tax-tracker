"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  type Notification = { id: string | number; message: string };
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data));
  }, []);

  return (
    <div className="flex py-4 h-screen w-fit mx-auto flex-col items-center text-bold">
      <h2>Notifications</h2>
      {notifications.map((notif) => (
        <p key={notif.id}>{notif.message}</p>
      ))}
    </div>
  );
}
