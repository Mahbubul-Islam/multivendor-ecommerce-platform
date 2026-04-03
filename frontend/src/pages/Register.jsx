import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  registerCustomer,
  registerVendor,
  clearError,
} from '../features/auth/authSlice';
import {
  FiMail, FiLock, FiUser, FiPhone,
  FiEye, FiEyeOff, FiShoppingBag,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const Register = () => {
  const [accountType, setAccountType] = useState('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
    password2: '',
    shop_name: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      // Handle field-specific errors
      if (typeof error === 'object') {
        Object.keys(error).forEach((key) => {
          const messages = Array.isArray(error[key])
            ? error[key].join(', ')
            : error[key];
          toast.error(`${key}: ${messages}`);
        });
      } else {
        toast.error('Registration failed.');
      }
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.password2) {
      toast.error("Passwords don't match!");
      return;
    }

    const action =
      accountType === 'customer'
        ? registerCustomer(formData)
        : registerVendor(formData);

    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success('Registration successful!');
      })
      .catch(() => {});
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500 mt-2">Join ShopBD today</p>
        </div>

        {/* Account Type Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            type="button"
            onClick={() => setAccountType('customer')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition
              ${accountType === 'customer'
                ? 'bg-white shadow text-orange-500'
                : 'text-gray-500'
              }`}
          >
            🛒 Customer
          </button>
          <button
            type="button"
            onClick={() => setAccountType('vendor')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition
              ${accountType === 'vendor'
                ? 'bg-white shadow text-orange-500'
                : 'text-gray-500'
              }`}
          >
            🏪 Vendor
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 border rounded-lg
                         focus:outline-none focus:ring-2
                         focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 border rounded-lg
                         focus:outline-none focus:ring-2
                         focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg
                         focus:outline-none focus:ring-2
                         focus:ring-orange-500"
              />
            </div>
          </div>

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
                required
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg
                         focus:outline-none focus:ring-2
                         focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-3 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg
                         focus:outline-none focus:ring-2
                         focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Shop Name (Vendor only) */}
          {accountType === 'vendor' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop Name
              </label>
              <div className="relative">
                <FiShoppingBag className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="shop_name"
                  value={formData.shop_name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg
                           focus:outline-none focus:ring-2
                           focus:ring-orange-500"
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-12 py-2.5 border rounded-lg
                         focus:outline-none focus:ring-2
                         focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg
                         focus:outline-none focus:ring-2
                         focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-2.5 rounded-lg
                     font-semibold hover:bg-orange-600 transition
                     disabled:opacity-50"
          >
            {loading
              ? 'Creating account...'
              : `Register as ${accountType === 'customer'
                  ? 'Customer'
                  : 'Vendor'
                }`
            }
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-500 font-semibold
                                     hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;