import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

function RequireAuth({ allowedRoles }) {
  const { isLoggedIn, role } = useSelector((state) => state.auth);

  // 🟢 FIX — role को lowercase कर दिया
  const normalizedRole = role?.toLowerCase();

  return isLoggedIn && allowedRoles.find((myRole) => myRole === normalizedRole) ? (
    <Outlet />
  ) : isLoggedIn ? (
    <Navigate to="/denied" />
  ) : (
    <Navigate to="/login" />
  );
}

export default RequireAuth;
