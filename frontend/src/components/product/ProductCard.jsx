import { Link } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";

const ProductCard = ({ product }) => {
	if (!product) return null;

	const handleAddToCart = () => {
		console.log("Add to cart:", product.id);
		// will do later
	};

	const handleAddToWishlist = () => {
		console.log("Add to wishlist:", product.id);
		// will do later
	};

	// Defensive checks for required fields
	const slug = product.slug || "";
	const thumbnail = product.thumbnail || "";
	const name = product.name || "Product";
	const categoryName = product.category_name || "Uncategorized";
	const vendorName = product.vendor_name || "Unknown Vendor";
	const currentPrice = product.current_price || product.base_price || 0;
	const basePrice = product.base_price || 0;
	const discountPrice = product.discount_price || null;
	const discountPercentage = product.discount_percentage || 0;
	const averageRating = product.average_rating || 0;
	const totalReviews = product.total_reviews || 0;
	const isFeatured = product.is_featured || false;
	const inStock = product.in_stock !== undefined ? product.in_stock : true;

	return (
		<div
			className="bg-white rounded-xl shadow-sm hover:shadow-lg
                    transition-all duration-300 overflow-hidden group">
			{/* Image */}
			<Link to={`/products/${slug}`} className="block relative">
				<img
					src={thumbnail}
					alt={name}
					className="w-full h-56 object-cover group-hover:scale-105
                   transition-transform duration-300"
				/>

				{/* Badges */}
				<div className="absolute top-2 left-2 flex flex-col gap-1">
					{isFeatured && (
						<span
							className="bg-orange-500 text-white text-xs px-2 py-1
                           rounded font-semibold">
							Featured
						</span>
					)}
					{discountPercentage > 0 && (
						<span
							className="bg-red-500 text-white text-xs px-2 py-1
                           rounded font-semibold">
							-{discountPercentage}%
						</span>
					)}
				</div>

				{/* Wishlist Button */}
				<button
					onClick={(e) => {
						e.preventDefault();
						handleAddToWishlist();
					}}
					className="absolute top-2 right-2 bg-white p-2 rounded-full
                   shadow hover:text-red-500 transition opacity-0
                   group-hover:opacity-100">
					<FiHeart size={18} />
				</button>
			</Link>

			{/* Content */}
			<div className="p-4">
				{/* Category & Vendor */}
				<div
					className="flex items-center justify-between text-xs
                      text-gray-500 mb-2">
					<span>{categoryName}</span>
					<span>{vendorName}</span>
				</div>

				{/* Product Name */}
				<Link
					to={`/products/${slug}`}
					className="block font-semibold text-gray-800 hover:text-orange-500
                   line-clamp-2 min-h-[48px]">
					{name}
				</Link>

				{/* Rating */}
				<div className="flex items-center gap-1 mt-2">
					<div className="flex text-yellow-400">
						{[...Array(5)].map((_, i) => (
							<FiStar
								key={i}
								size={14}
								fill={i < Math.floor(averageRating) ? "currentColor" : "none"}
							/>
						))}
					</div>
					<span className="text-xs text-gray-500">({totalReviews})</span>
				</div>

				{/* Price */}
				<div className="mt-3 flex items-center gap-2">
					<span className="text-xl font-bold text-orange-500">
						৳{currentPrice}
					</span>
					{discountPrice && (
						<span className="text-sm text-gray-400 line-through">
							৳{basePrice}
						</span>
					)}
				</div>

				{/* Stock Status */}
				{!inStock && <p className="text-red-500 text-sm mt-2">Out of Stock</p>}

				{/* Add to Cart */}
				<button
					onClick={handleAddToCart}
					disabled={!inStock}
					className="w-full mt-3 bg-orange-500 text-white py-2 rounded-lg
                   font-semibold hover:bg-orange-600 transition
                   disabled:bg-gray-300 disabled:cursor-not-allowed
                   flex items-center justify-center gap-2">
					<FiShoppingCart size={18} />
					Add to Cart
				</button>
			</div>
		</div>
	);
};

export default ProductCard;
