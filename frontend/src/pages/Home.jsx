const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600
                      rounded-2xl p-8 md:p-16 text-white mb-8">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Welcome to ShopBD
        </h1>
        <p className="text-lg md:text-xl mb-6 opacity-90">
          Best multi-vendor marketplace in Bangladesh 🇧🇩
        </p>
        <button className="bg-white text-orange-500 px-6 py-3
                         rounded-lg font-semibold hover:bg-gray-100">
          Shop Now
        </button>
      </div>

      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty'].map(
            (cat) => (
              <div
                key={cat}
                className="bg-white rounded-xl p-6 text-center shadow-sm
                         hover:shadow-md cursor-pointer transition"
              >
                <div className="text-3xl mb-2">🛍️</div>
                <p className="font-medium text-sm">{cat}</p>
              </div>
            )
          )}
        </div>
      </section>

      {/* Featured Products Placeholder */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md
                       transition"
            >
              <div className="bg-gray-200 h-48 rounded-lg mb-4
                            animate-pulse">
              </div>
              <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;