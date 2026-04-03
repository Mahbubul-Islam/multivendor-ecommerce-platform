import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser, clearError } from "../features/auth/authSlice";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";

const Login = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const { loading, error, isAuthenticated } = useSelector(
		(state) => state.auth,
	);

	// Redirect if already logged in
	useEffect(() => {
		if (isAuthenticated) {
			const from = location.state?.from?.pathname || "/";
			navigate(from, { replace: true });
		}
	}, [isAuthenticated, navigate, location]);

	// Show error toast
	useEffect(() => {
		if (error) {
			const errorMsg = error.detail || "Login failed. Please try again.";
			toast.error(errorMsg);
			dispatch(clearError());
		}
	}, [error, dispatch]);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(loginUser(formData)).unwrap().then(() => {
				toast.success("Login successful!");
			})
			.catch(() => {});
	};

	return (
		<div className="min-h-[80vh] flex items-center justify-center px-4">
			<div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
					<p className="text-gray-500 mt-2">Login to your account</p>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-5">
					{/* Email */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Email
						</label>
						<div className="relative">
							<FiMail className="absolute left-3 top-3 text-gray-400" />
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								placeholder="Enter your email"
								required
								className="w-full pl-10 pr-4 py-2.5 border rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-orange-500
                         focus:border-transparent"
							/>
						</div>
					</div>

					{/* Password */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Password
						</label>
						<div className="relative">
							<FiLock className="absolute left-3 top-3 text-gray-400" />
							<input
								type={showPassword ? "text" : "password"}
								name="password"
								value={formData.password}
								onChange={handleChange}
								placeholder="Enter your password"
								required
								className="w-full pl-10 pr-12 py-2.5 border rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-orange-500
                         focus:border-transparent"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-3 text-gray-400
                         hover:text-gray-600">
								{showPassword ? <FiEyeOff /> : <FiEye />}
							</button>
						</div>
					</div>

					{/* Submit */}
					<button
						type="submit"
						disabled={loading}
						className="w-full bg-orange-500 text-white py-2.5 rounded-lg
                     font-semibold hover:bg-orange-600 transition
                     disabled:opacity-50 disabled:cursor-not-allowed">
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>

				{/* Register Link */}
				<p className="text-center mt-6 text-gray-500">
					Don&apos;t have an account?{" "}
					<Link
						to="/register"
						className="text-orange-500 font-semibold
                                        hover:underline">
						Register
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
