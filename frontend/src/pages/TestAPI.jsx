import { useEffect, useState } from "react";

const TestAPI = () => {
	const [categories, setCategories] = useState(null);
	const [featured, setFeatured] = useState(null);
	const [loading, setLoading] = useState(true);
	const [errors, setErrors] = useState({});

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				// Test categories endpoint
				try {
					const catRes = await fetch("http://127.0.0.1:8000/api/categories/");
					const catData = await catRes.json();
					setCategories(catData);
					console.log("Categories:", catData);
				} catch (err) {
					setErrors((prev) => ({ ...prev, categories: err.message }));
					console.error("Categories error:", err);
				}

				// Test featured products endpoint
				try {
					const prodRes = await fetch(
						"http://127.0.0.1:8000/api/products/featured/",
					);
					const prodData = await prodRes.json();
					setFeatured(prodData);
					console.log("Featured:", prodData);
				} catch (err) {
					setErrors((prev) => ({ ...prev, featured: err.message }));
					console.error("Featured error:", err);
				}
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) return <div className="p-4">Loading...</div>;

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">API Test</h1>

			<div className="grid grid-cols-2 gap-6">
				<div className="bg-white p-6 rounded-lg shadow">
					<h2 className="text-xl font-bold mb-4">Categories</h2>
					{errors.categories ? (
						<p className="text-red-500">{errors.categories}</p>
					) : (
						<pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
							{JSON.stringify(categories, null, 2)}
						</pre>
					)}
				</div>

				<div className="bg-white p-6 rounded-lg shadow">
					<h2 className="text-xl font-bold mb-4">Featured Products</h2>
					{errors.featured ? (
						<p className="text-red-500">{errors.featured}</p>
					) : (
						<pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
							{JSON.stringify(featured, null, 2)}
						</pre>
					)}
				</div>
			</div>
		</div>
	);
};

export default TestAPI;
