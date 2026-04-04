import { useContext, useEffect } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AuthGuard({ children, roles = [] }) {
  const { authenticated, loading, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!authenticated) {
        navigate("/login", { replace: true });
      } else if (roles.length > 0 && !roles.includes(user?.role)) {
        console.log("User role:", user?.role);
        console.log("Role mismatch:", user?.role, roles); // DEBUG
        navigate("/404", { replace: true });
      }
    }
  }, [authenticated, loading, user, roles, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!authenticated) return null;

  return children;
}
