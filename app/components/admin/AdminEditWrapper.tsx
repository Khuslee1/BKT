"use client";

import { useEffect, useState } from "react";
import AdminEditProvider from "./AdminEditProvider";

export default function AdminEditWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(localStorage.getItem("bkt_is_admin") === "1");
  }, []);

  return isAdmin ? (
    <AdminEditProvider>{children}</AdminEditProvider>
  ) : (
    <>{children}</>
  );
}
