import AdminEditWrapper from "@/app/components/admin/AdminEditWrapper";
import Navbar from "@/app/components/layout/NaviBar";
import Footer from "@/app/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <AdminEditWrapper>{children}</AdminEditWrapper>
      <Footer />
    </>
  );
}
