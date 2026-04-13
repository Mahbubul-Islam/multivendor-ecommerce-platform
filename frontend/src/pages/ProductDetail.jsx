// frontend/src/pages/ProductDetail.jsx

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	useGetProductQuery,
	useGetProductReviewsQuery,
} from "../features/api/productApi";
import {
	FiStar,
	FiHeart,
	FiShoppingCart,
	FiTruck,
	FiShield,
} from "react-icons/fi";
import Loader from "../components/common/Loader";
import toast from "react-hot-toast";

const ProductDetail = () => {
	const { slug } = useParams();
	const navigate = useNavigate();
	const { data: product, isLoading } = useGetProductQuery(slug);
	const { data: reviews } = useGetProductReviewsQuery(slug);

	const [selectedImage, setSelectedImage] = useState(0);
	const [selectedVariant, setSelectedVariant] = useState(null);
	const [quantity, setQuantity] = useState(1);

	if (isLoading) return <Loader />;
	if (!product) return <div>Product not found</div>;

	const images = [
		{ image: product.thumbnail, alt: product.name },
		...product.images,
	];

	const handleAddToCart = () => {
		if (!selectedVariant) {
			toast.error("Please select a variant");
			return;
		}
		// We'll implement cart on Day 11
		console.log("Add to cart:", { product, selectedVariant, quantity });
		toast.success("Added to cart!");
	};

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			{/* Breadcrumb */}
			<div className="text-sm text-gray-500 mb-6">
				<span
					className="hover:text-orange-500 cursor-pointer"
					onClick={() => navigate("/")}>
					Home
				</span>
				<span className="mx-2">/</span>
				<span
					className="hover:text-orange-500 cursor-pointer"
					onClick={() => navigate("/products")}>
					Products
				</span>
				<span className="mx-2">/</span>
				<span>{product.category.name}</span>
				<span className="mx-2">/</span>
				<span className="text-gray-800">{product.name}</span>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Left: Images */}
				<div>
					{/* Main Image */}
					<div className="bg-white rounded-xl shadow-sm p-4 mb-4">
						<img
							src={images[selectedImage].image}
							alt={images[selectedImage].alt_text || product.name}
							className="w-full h-96 object-contain"
						/>
					</div>

					{/* Thumbnails */}
					<div className="flex gap-2 overflow-x-auto">
						{images.map((img, idx) => (
							<img
								key={idx}
								src={img.image}
								alt={img.alt_text}
								onClick={() => setSelectedImage(idx)}
								className={`w-20 h-20 object-cover rounded-lg cursor-pointer
                          border-2 ${
														selectedImage === idx
															? "border-orange-500"
															: "border-gray-200"
													}`}
							/>
						))}
					</div>
				</div>

				{/* Right: Details */}
				<div>
					<div className="bg-white rounded-xl shadow-sm p-6">
						{/* Vendor */}
						<div className="flex items-center gap-2 mb-2">
							<span className="text-sm text-gray-500">Sold by:</span>
							<span className="text-sm font-semibold text-orange-500">
								{product.vendor.shop_name}
							</span>
							{product.vendor.is_verified && (
								<span className="text-green-500">✓</span>
							)}
						</div>

						{/* Product Name */}
						<h1 className="text-2xl font-bold mb-4">{product.name}</h1>

						{/* Rating */}
						<div className="flex items-center gap-2 mb-4">
							<div className="flex text-yellow-400">
								{[...Array(5)].map((_, i) => (
									<FiStar
										key={i}
										size={18}
										fill={
											i < Math.floor(product.average_rating)
												? "currentColor"
												: "none"
										}
									/>
								))}
							</div>
							<span className="text-gray-600">
								{product.average_rating} ({product.total_reviews} reviews)
							</span>
						</div>

						{/* Price */}
						<div className="mb-6">
							<div className="flex items-center gap-3">
								<span className="text-3xl font-bold text-orange-500">
									৳{product.current_price}
								</span>
								{product.discount_price && (
									<>
										<span className="text-xl text-gray-400 line-through">
											৳{product.base_price}
										</span>
										<span
											className="bg-red-100 text-red-600 px-2 py-1
                                   rounded text-sm font-semibold">
											-{product.discount_percentage}%
										</span>
									</>
								)}
							</div>
						</div>

						{/* Variants */}
						{product.variants && product.variants.length > 0 && (
							<div className="mb-6">
								<h3 className="font-semibold mb-3">Select Variant:</h3>
								<div className="grid grid-cols-2 gap-2">
									{product.variants.map((variant) => (
										<button
											key={variant.id}
											onClick={() => setSelectedVariant(variant)}
											disabled={variant.stock === 0}
											className={`border-2 rounded-lg p-3 text-left
                                transition disabled:opacity-50
                                disabled:cursor-not-allowed ${
																	selectedVariant?.id === variant.id
																		? "border-orange-500 bg-orange-50"
																		: "border-gray-200 hover:border-gray-300"
																}`}>
											<div className="font-medium">
												{variant.size && `Size: ${variant.size}`}
												{variant.color && ` • ${variant.color}`}
											</div>
											<div className="text-sm text-gray-600">
												৳{variant.price} • Stock: {variant.stock}
											</div>
										</button>
									))}
								</div>
							</div>
						)}

						{/* Quantity */}
						<div className="mb-6">
							<h3 className="font-semibold mb-3">Quantity:</h3>
							<div className="flex items-center gap-3">
								<button
									onClick={() => setQuantity(Math.max(1, quantity - 1))}
									className="w-10 h-10 border rounded-lg hover:bg-gray-50">
									-
								</button>
								<span className="w-12 text-center font-semibold">
									{quantity}
								</span>
								<button
									onClick={() => setQuantity(quantity + 1)}
									className="w-10 h-10 border rounded-lg hover:bg-gray-50">
									+
								</button>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex gap-3 mb-6">
							<button
								onClick={handleAddToCart}
								disabled={!product.in_stock}
								className="flex-1 bg-orange-500 text-white py-3 rounded-lg
                         font-semibold hover:bg-orange-600 transition
                         flex items-center justify-center gap-2
                         disabled:bg-gray-300 disabled:cursor-not-allowed">
								<FiShoppingCart size={20} />
								Add to Cart
							</button>
							<button
								className="p-3 border border-orange-500 text-orange-500
                         rounded-lg hover:bg-orange-50">
								<FiHeart size={24} />
							</button>
						</div>

						{/* Features */}
						<div className="border-t pt-4 space-y-3">
							<div className="flex items-center gap-3 text-gray-600">
								<FiTruck size={20} />
								<span className="text-sm">Free Delivery in Dhaka</span>
							</div>
							<div className="flex items-center gap-3 text-gray-600">
								<FiShield size={20} />
								<span className="text-sm">7 Days Return Policy</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Description & Reviews Tabs */}
			<div className="mt-12">
				<div className="bg-white rounded-xl shadow-sm p-6">
					<h2 className="text-xl font-bold mb-4">Product Description</h2>
					<p className="text-gray-700 whitespace-pre-line">
						{product.description}
					</p>
				</div>

				{/* Reviews Section */}
				{reviews && reviews.length > 0 && (
					<div className="bg-white rounded-xl shadow-sm p-6 mt-6">
						<h2 className="text-xl font-bold mb-4">
							Customer Reviews ({reviews.length})
						</h2>
						<div className="space-y-4">
							{reviews.map((review) => (
								<div key={review.id} className="border-b pb-4 last:border-0">
									<div className="flex items-center justify-between mb-2">
										<div className="font-semibold">{review.user_name}</div>
										<div className="flex text-yellow-400">
											{[...Array(5)].map((_, i) => (
												<FiStar
													key={i}
													size={14}
													fill={i < review.rating ? "currentColor" : "none"}
												/>
											))}
										</div>
									</div>
									<p className="text-gray-600">{review.comment}</p>
									<p className="text-sm text-gray-400 mt-1">
										{new Date(review.created_at).toLocaleDateString()}
									</p>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProductDetail;
