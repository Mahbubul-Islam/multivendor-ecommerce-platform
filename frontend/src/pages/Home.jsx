import { Link } from "react-router-dom";
import {
	useGetFeaturedProductsQuery,
	useGetCategoriesQuery,
} from "../features/api/productApi";
import ProductCard from "../components/product/ProductCard";
import Loader from "../components/common/Loader";

const Home = () => {
	const {
		data: featuredProductsData,
		isLoading: loadingProducts,
		error: productsError,
	} = useGetFeaturedProductsQuery();
	const {
		data: categoriesData,
		isLoading: loadingCategories,
		error: categoriesError,
	} = useGetCategoriesQuery();

	// Extract arrays from paginated or direct responses
	const featuredProducts = Array.isArray(featuredProductsData)
		? featuredProductsData
		: featuredProductsData?.results || [];

	const categories = Array.isArray(categoriesData)
		? categoriesData
		: categoriesData?.results || [];

	// Debug logs
	console.log("Featured Products Data:", featuredProductsData);
	console.log("Featured Products Array:", featuredProducts);
	console.log("Categories Data:", categoriesData);
	console.log("Categories Array:", categories);
	console.log("Products Error:", productsError);
	console.log("Categories Error:", categoriesError);

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			{/* Hero Banner */}
			<div
				className="bg-gradient-to-r from-orange-500 to-orange-600
                      rounded-2xl p-8 md:p-16 text-white mb-8">
				<h1 className="text-3xl md:text-5xl font-bold mb-4">
					Welcome to ShopBD
				</h1>
				<p className="text-lg md:text-xl mb-6 opacity-90">
					Best multi-vendor marketplace in Bangladesh 🇧🇩
				</p>
				<Link
					to="/products"
					className="inline-block bg-white text-orange-500 px-6 py-3
                   rounded-lg font-semibold hover:bg-gray-100">
					Shop Now
				</Link>
			</div>

			{/* Categories Section */}
			<section className="mb-12">
				<h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
				{loadingCategories ? (
					<Loader />
				) : categoriesError ? (
					<div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
						Error loading categories: {JSON.stringify(categoriesError)}
					</div>
				) : categories && categories.length > 0 ? (
					<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
						{categories.map((cat) =>
							cat && cat.id ? (
								<Link
									key={cat.id}
									to={`/products?category=${cat.id}`}
									className="bg-white rounded-xl p-6 text-center shadow-sm
                         hover:shadow-md cursor-pointer transition">
									{cat.image ? (
										<img
											src={cat.image}
											alt={cat.name || "Category"}
											className="w-16 h-16 mx-auto mb-2 object-cover rounded-full"
										/>
									) : (
										<div className="text-3xl mb-2">🛍️</div>
									)}
									<p className="font-medium text-sm">{cat.name || "Unnamed"}</p>
								</Link>
							) : null,
						)}
					</div>
				) : (
					<div className="text-center py-12">
						<p className="text-gray-500 text-lg">No categories available</p>
					</div>
				)}
			</section>

			{/* Featured Products Placeholder */}
			<section>
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl font-bold">Featured Products</h2>
					<Link
						to="/products?is_featured=true"
						className="text-orange-500 hover:underline">
						View All
					</Link>
				</div>
				{loadingProducts ? (
					<Loader />
				) : productsError ? (
					<div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
						Error loading products: {JSON.stringify(productsError)}
					</div>
				) : featuredProducts && featuredProducts.length > 0 ? (
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{featuredProducts
							.slice(0, 8)
							.map((product) =>
								product && product.id ? (
									<ProductCard key={product.id} product={product} />
								) : null,
							)}
					</div>
				) : (
					<div className="text-center py-12">
						<p className="text-gray-500 text-lg">
							No featured products available
						</p>
					</div>
				)}
			</section>
		</div>
	);
};

export default Home;
