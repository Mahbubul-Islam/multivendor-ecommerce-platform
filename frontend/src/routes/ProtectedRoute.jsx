import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../features/auth/useAuth";

/**
 * @param {{ children: import('react').ReactNode, allowedRoles?: string[] }} props
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
	const { isAuthenticated, user } = useAuth();
	const location = useLocation();

	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	if (allowedRoles && !allowedRoles.includes(user?.role)) {
		return <Navigate to="/" replace />;
	}

	return children;
};

export default ProtectedRoute;
