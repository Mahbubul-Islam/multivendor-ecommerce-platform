import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
	useGetProductsQuery,
	useGetCategoriesQuery,
} from "../features/api/productApi";
import ProductGrid from "../components/product/ProductGrid";
import ProductFilters from "../components/product/ProductFilters";
import { FiGrid, FiList } from "react-icons/fi";

const Products = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [filters, setFilters] = useState({});
	const [page, setPage] = useState(1);
	const [sortBy, setSortBy] = useState("-created_at");

	// Build query params - filter out undefined/false values
	const queryParams = {};
	if (filters.category) queryParams.category = filters.category;
	if (filters.min_price) queryParams.min_price = filters.min_price;
	if (filters.max_price) queryParams.max_price = filters.max_price;
	if (filters.in_stock === true) queryParams.in_stock = "true";
	if (filters.on_sale === true) queryParams.on_sale = "true";
	queryParams.page = page;
	queryParams.ordering = sortBy;

	console.log("Query params being sent:", queryParams);

	const { data: productsData, isLoading } = useGetProductsQuery(queryParams);
	const { data: categoriesData } = useGetCategoriesQuery();

	// Extract categories array
	const categories = Array.isArray(categoriesData)
		? categoriesData
		: categoriesData?.results || [];

	// Sync filters with URL params
	useEffect(() => {
		const params = Object.fromEntries(searchParams);
		// Convert category back to integer if present
		if (params.category) {
			params.category = parseInt(params.category, 10);
		}
		// Convert price params to integers
		if (params.min_price) {
			params.min_price = parseInt(params.min_price, 10);
		}
		if (params.max_price) {
			params.max_price = parseInt(params.max_price, 10);
		}
		// Convert boolean params
		if (params.in_stock) {
			params.in_stock = params.in_stock === "true";
		}
		if (params.on_sale) {
			params.on_sale = params.on_sale === "true";
		}
		console.log("Synced filters from URL:", params);
		setFilters(params);
		setPage(1);
	}, [searchParams]);

	const handleFilterChange = (newFilters) => {
		// newFilters comes from ProductFilters with proper types
		console.log("Filter change received:", newFilters);

		// Convert to URL params (everything becomes string in URL)
		const urlParams = {};
		Object.entries(newFilters).forEach(([key, value]) => {
			if (value === "" || value === undefined || value === false) {
				// Skip empty values
			} else if (key === "category" && value) {
				urlParams[key] = value.toString();
			} else {
				urlParams[key] = value.toString();
			}
		});

		console.log("URL params to set:", urlParams);

		setFilters(newFilters); // Set state with proper types
		setSearchParams(urlParams); // Set URL with strings
		setPage(1);
	};

	// Calculate pagination info
	const pageSize = 12; // Matches backend PAGE_SIZE setting
	const totalCount = productsData?.count || 0;
	const totalPages = Math.ceil(totalCount / pageSize) || 1;

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			{/* Header */}
			<div className="mb-6">
				<h1 className="text-3xl font-bold mb-2">All Products</h1>
				<p className="text-gray-500">
					{productsData?.count || 0} products found
				</p>
			</div>

			{/* Sort & View Toggle */}
			<div
				className="flex items-center justify-between mb-6 bg-white
                    rounded-lg shadow-sm p-4">
				<select
					value={sortBy}
					onChange={(e) => setSortBy(e.target.value)}
					className="border rounded-lg px-4 py-2 focus:outline-none
                   focus:ring-2 focus:ring-orange-500">
					<option value="-created_at">Newest First</option>
					<option value="created_at">Oldest First</option>
					<option value="base_price">Price: Low to High</option>
					<option value="-base_price">Price: High to Low</option>
					<option value="name">Name: A to Z</option>
					<option value="-name">Name: Z to A</option>
				</select>

				<div className="flex gap-2">
					<button className="p-2 border rounded hover:bg-gray-50">
						<FiGrid size={20} />
					</button>
					<button className="p-2 border rounded hover:bg-gray-50">
						<FiList size={20} />
					</button>
				</div>
			</div>

			{/* Main Content */}
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				{/* Filters Sidebar */}
				<div className="lg:col-span-1">
					<ProductFilters
						filters={filters}
						setFilters={handleFilterChange}
						categories={categories}
					/>
				</div>

				{/* Products Grid */}
				<div className="lg:col-span-3">
					<ProductGrid products={productsData?.results} loading={isLoading} />

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex items-center justify-center gap-2 mt-8">
							<button
								onClick={() => setPage(page - 1)}
								disabled={page === 1}
								className="px-4 py-2 border rounded-lg disabled:opacity-50
                         disabled:cursor-not-allowed hover:bg-gray-50">
								Previous
							</button>

							<span className="px-4 py-2">
								Page {page} of {totalPages}
							</span>

							<button
								onClick={() => setPage(page + 1)}
								disabled={page === totalPages}
								className="px-4 py-2 border rounded-lg disabled:opacity-50
                         disabled:cursor-not-allowed hover:bg-gray-50">
								Next
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Products;
