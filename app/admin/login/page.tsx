import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./_components/LoginForm";

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  return <LoginForm />;
}
