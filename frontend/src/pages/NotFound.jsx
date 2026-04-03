import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
      <p className="text-xl text-gray-500 mb-6">Page not found</p>
      <Link
        to="/"
        className="bg-orange-500 text-white px-6 py-3 rounded-lg
                 hover:bg-orange-600"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;