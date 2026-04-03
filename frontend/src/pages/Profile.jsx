import { useSelector } from 'react-redux';
import { FiUser, FiMail, FiPhone, FiShield } from 'react-icons/fi';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b">
          <div className="w-16 h-16 bg-orange-100 rounded-full
                        flex items-center justify-center">
            <FiUser size={28} className="text-orange-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {user?.first_name} {user?.last_name}
            </h2>
            <span className="inline-block px-3 py-1 text-xs rounded-full
                           bg-orange-100 text-orange-600 font-medium mt-1">
              {user?.role?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FiMail className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FiUser className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Username</p>
              <p className="font-medium">{user?.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FiPhone className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{user?.phone || 'Not set'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FiShield className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Email Verified</p>
              <p className="font-medium">
                {user?.is_email_verified ? '✅ Verified' : '❌ Not verified'}
              </p>
            </div>
          </div>
        </div>

        {/* Vendor Info */}
        {user?.role === 'vendor' && user?.vendor_profile && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-3">Shop Information</h3>
            <div className="space-y-2">
              <p>
                <span className="text-gray-500">Shop Name: </span>
                {user.vendor_profile.shop_name}
              </p>
              <p>
                <span className="text-gray-500">Verified: </span>
                {user.vendor_profile.is_verified
                  ? '✅ Verified'
                  : '⏳ Pending'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;