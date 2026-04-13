import { useState } from "react";
import { FiFilter, FiX } from "react-icons/fi";

const ProductFilters = ({ filters, setFilters, categories }) => {
	const [showMobile, setShowMobile] = useState(false);

	// Extract categories array from paginated or direct response
	const categoriesArray = Array.isArray(categories)
		? categories
		: categories?.results || [];

	const priceRanges = [
		{ label: "Under ৳500", min: 0, max: 500 },
		{ label: "৳500 - ৳1000", min: 500, max: 1000 },
		{ label: "৳1000 - ৳5000", min: 1000, max: 5000 },
		{ label: "৳5000 - ৳10000", min: 5000, max: 10000 },
		{ label: "Over ৳10000", min: 10000, max: 999999 },
	];

	const handleCategoryChange = (categoryId) => {
		// Convert to integer for API
		const newFilters = { ...filters };
		if (categoryId === "" || categoryId === 0) {
			delete newFilters.category;
		} else {
			newFilters.category = parseInt(categoryId, 10);
		}
		setFilters(newFilters);
	};

	const handlePriceChange = (min, max) => {
		// Convert to integers for API
		setFilters({ ...filters, min_price: min, max_price: max });
	};

	const clearFilters = () => {
		setFilters({});
	};

	const FilterContent = () => (
		<div className="space-y-6">
			{/* Category Filter */}
			<div>
				<h3 className="font-semibold mb-3">Category</h3>
				<div className="space-y-2">
					<label className="flex items-center gap-2 cursor-pointer">
						<input
							type="radio"
							name="category"
							checked={!filters.category}
							onChange={() => handleCategoryChange("")}
							className="text-orange-500"
						/>
						<span className="text-sm">All Categories</span>
					</label>
					{categoriesArray.map((cat) => (
						<label
							key={cat.id}
							className="flex items-center gap-2 cursor-pointer">
							<input
								type="radio"
								name="category"
								checked={parseInt(filters.category, 10) === cat.id}
								onChange={() => handleCategoryChange(cat.id)}
								className="text-orange-500"
							/>
							<span className="text-sm">{cat.name}</span>
						</label>
					))}
				</div>
			</div>

			{/* Price Filter */}
			<div>
				<h3 className="font-semibold mb-3">Price Range</h3>
				<div className="space-y-2">
					<label className="flex items-center gap-2 cursor-pointer">
						<input
							type="radio"
							name="price"
							checked={!filters.min_price && !filters.max_price}
							onChange={() => {
								const newFilters = { ...filters };
								delete newFilters.min_price;
								delete newFilters.max_price;
								setFilters(newFilters);
							}}
							className="text-orange-500"
						/>
						<span className="text-sm">All Prices</span>
					</label>
					{priceRanges.map((range, idx) => (
						<label key={idx} className="flex items-center gap-2 cursor-pointer">
							<input
								type="radio"
								name="price"
								checked={
									parseInt(filters.min_price, 10) === range.min &&
									parseInt(filters.max_price, 10) === range.max
								}
								onChange={() => handlePriceChange(range.min, range.max)}
								className="text-orange-500"
							/>
							<span className="text-sm">{range.label}</span>
						</label>
					))}
				</div>
			</div>

			{/* Availability */}
			<div>
				<h3 className="font-semibold mb-3">Availability</h3>
				<label className="flex items-center gap-2 cursor-pointer">
					<input
						type="checkbox"
						checked={filters.in_stock === true}
						onChange={(e) => {
							const newFilters = { ...filters };
							if (e.target.checked) {
								newFilters.in_stock = true;
							} else {
								delete newFilters.in_stock;
							}
							setFilters(newFilters);
						}}
						className="text-orange-500"
					/>
					<span className="text-sm">In Stock Only</span>
				</label>
			</div>

			{/* On Sale */}
			<div>
				<label className="flex items-center gap-2 cursor-pointer">
					<input
						type="checkbox"
						checked={filters.on_sale === true}
						onChange={(e) => {
							const newFilters = { ...filters };
							if (e.target.checked) {
								newFilters.on_sale = true;
							} else {
								delete newFilters.on_sale;
							}
							setFilters(newFilters);
						}}
						className="text-orange-500"
					/>
					<span className="text-sm">On Sale</span>
				</label>
			</div>

			{/* Clear Filters */}
			{Object.keys(filters).length > 0 && (
				<button
					onClick={clearFilters}
					className="w-full py-2 border border-gray-300 rounded-lg
                   hover:bg-gray-50 text-sm font-medium">
					Clear All Filters
				</button>
			)}
		</div>
	);

	return (
		<>
			{/* Mobile Filter Button */}
			<button
				onClick={() => setShowMobile(true)}
				className="lg:hidden fixed bottom-4 right-4 bg-orange-500
                 text-white p-4 rounded-full shadow-lg z-40
                 flex items-center gap-2">
				<FiFilter size={20} />
				Filters
			</button>

			{/* Desktop Sidebar */}
			<div className="hidden lg:block bg-white rounded-xl shadow-sm p-6">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-bold">Filters</h2>
				</div>
				<FilterContent />
			</div>

			{/* Mobile Drawer */}
			{showMobile && (
				<div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
					<div
						className="absolute right-0 top-0 h-full w-80 bg-white
                        shadow-xl p-6 overflow-y-auto">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-lg font-bold">Filters</h2>
							<button onClick={() => setShowMobile(false)}>
								<FiX size={24} />
							</button>
						</div>
						<FilterContent />
					</div>
				</div>
			)}
		</>
	);
};

export default ProductFilters;
