import { useSelector } from 'react-redux';

const useAuth = () => {
  const { user, isAuthenticated, loading } = useSelector(
    (state) => state.auth
  );

  return {
    user,
    isAuthenticated,
    loading,
    isCustomer: user?.role === 'customer',
    isVendor: user?.role === 'vendor',
    isAdmin: user?.role === 'admin',
  };
};

export default useAuth;