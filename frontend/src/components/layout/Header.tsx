// import { Link } from "react-router-dom";
// import { useSessionStore } from "@/store/sessionStore";
// import { Button } from "@/components/ui/button";
// import { LogOut } from "lucide-react";

// const Header = () => {
//   const session = useSessionStore((state) => state.session);
//   const clearSession = useSessionStore((state) => state.clearSession);

//   return (
//     <header className="bg-header text-header-foreground">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           <Link to={session ? (session.role === "hr" ? "/hr" : "/team-lead") : "/"} className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-primary flex items-center justify-center">
//               <span className="text-xs font-bold text-primary-foreground leading-tight">
//                 orange
//               </span>
//             </div>
//             <span className="text-lg font-semibold hidden sm:block">
//               Talent Portal
//             </span>
//           </Link>

//           {session && (
//             <div className="flex items-center gap-3">
//               <span className="text-sm text-header-foreground/70 hidden sm:block">
//                 {session.name}
//               </span>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="text-header-foreground/70 hover:text-header-foreground"
//                 onClick={() => {
//                   clearSession();
//                   window.location.href = "/";
//                 }}
//               >
//                 <LogOut className="w-4 h-4 mr-1" />
//                 Sign Out
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };


// export default Header;
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

// Import your logout action
import { logout } from "@/redux/authActions"; 
const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { userInfo } = useSelector((state) => state?.authReducer || { userInfo: null });
  
  const handleSignOut = () => {
    // Dispatch logout action
    dispatch(logout());
    
    // Clear localStorage
    localStorage.removeItem('userInfo');
    
    // Redirect to home
    navigate('/', { replace: true });
  };

  // Don't render anything if no user is logged in
  if (!userInfo) {
    return null;
  }

  return (
    <header className="bg-header text-header-foreground">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            to={userInfo?.role === "hr" ? "/hr" : "/team-lead"} 
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-primary flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground leading-tight">
                orange
              </span>
            </div>
            <span className="text-lg font-semibold hidden sm:block">
              Talent Portal
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-sm text-header-foreground/70 hidden sm:block">
              {userInfo?.name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-header-foreground/70 hover:text-header-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-1" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;