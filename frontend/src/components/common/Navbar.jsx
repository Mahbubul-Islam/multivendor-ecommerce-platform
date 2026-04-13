import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
// import useAuth from "../../features/auth/useAuth";
import { FiShoppingCart, FiUser, FiLogOut, FiSearch } from "react-icons/fi";
// import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

	return (
		<nav className="bg-white shadow-md sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<Link to="/" className="text-2xl font-bold text-orange-500">
						ShopBD
					</Link>

					{/* Search Bar */}
					<div className="hidden md:flex flex-1 max-w-lg mx-8">
						<div className="relative w-full">
							<input
								type="text"
								placeholder="Search products..."
								className="w-full pl-10 pr-4 py-2 border rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-orange-500"
							/>
							<FiSearch className="absolute left-3 top-3 text-gray-400" />
						</div>
					</div>

					{/* Right side */}
					<div className="flex items-center gap-4">
						<Link to="/cart" className="relative p-2 hover:text-orange-500">
							<FiShoppingCart size={22} />
							<span
								className="absolute -top-1 -right-1 bg-orange-500
                             text-white text-xs w-5 h-5 rounded-full
                             flex items-center justify-center">
								0
							</span>
						</Link>

						{isAuthenticated ? (
							<div className="flex items-center gap-3">
								<Link
									to={
										user?.role === "vendor" ? "/vendor/dashboard" : "/profile"
									}
									className="flex items-center gap-2 hover:text-orange-500">
									<FiUser size={20} />
									<span className="hidden sm:inline text-sm">
										{user?.first_name}
									</span>
								</Link>
								<button
									onClick={handleLogout}
									className="p-2 hover:text-red-500"
									title="Logout">
									<FiLogOut size={20} />
								</button>
							</div>
						) : (
							<div className="flex items-center gap-2">
								<Link
									to="/login"
									className="px-4 py-2 text-sm text-orange-500
                           border border-orange-500 rounded-lg
                           hover:bg-orange-50">
									Login
								</Link>
								<Link
									to="/register"
									className="px-4 py-2 text-sm text-white
                           bg-orange-500 rounded-lg
                           hover:bg-orange-600">
									Register
								</Link>
							</div>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
