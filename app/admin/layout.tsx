import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import AdminNav from "@/app/admin/_components/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isLoginPage = pathname === "/admin/login";

  if (!session && !isLoginPage) {
    redirect("/admin/login");
  }

  // Login page — no sidebar
  if (!session) {
    return (
      <div className="min-h-screen" style={{ background: "var(--black)" }}>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--black)" }}>
      <AdminNav email={session.email} />
      <main className="flex-1 ml-64 p-8 pt-10">{children}</main>
    </div>
  );
}
