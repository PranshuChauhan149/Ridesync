import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import PartnerDashboard from "@/components/PartnerDashboard";
import PublicHome from "@/components/PublicHome";

export default async function Home() {
    const session = await auth();
    const userRole = session?.user?.role;
  console.log(userRole);
  
  return (
    <div className="w-full min-h-screen bg-white">
       

      {userRole === "partner" ? (
       <>
<Nav/>
<PartnerDashboard />
       </> 
      ) : userRole === "admin" ? (
        <AdminDashboard />
      ) : (
        <>
        <Nav/>
        <PublicHome />
        </>
      )}
      
       <Footer/>
    </div>
  );
}
