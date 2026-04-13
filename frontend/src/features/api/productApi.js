import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = "http://127.0.0.1:8000/api";

export const productApi = createApi({
	reducerPath: "productApi",
	baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
	tagTypes: ["Product", "Category"],

	endpoints: (builder) => ({
		// Get all products with filters
		getProducts: builder.query({
			query: (params) => {
				const searchParams = new URLSearchParams(params).toString();
				return `/products/?${searchParams}`;
			},
			providesTags: ["Product"],
		}),

		// Get single product by slug
		getProduct: builder.query({
			query: (slug) => `/products/${slug}/`,
			providesTags: (result, error, slug) => [{ type: "Product", id: slug }],
		}),

		// get featured products
		getFeaturedProducts: builder.query({
			query: () => "/products/featured/",
			providesTags: ["Product"],
		}),

		// get trending products
		getTrendingProducts: builder.query({
			query: () => "/products/trending/",
			providesTags: ["Product"],
		}),

		// get product reviews
		getProductReviews: builder.query({
			query: (slug) => `/products/${slug}/reviews/`,
		}),

		// get categories
		getCategories: builder.query({
			query: () => "/categories/",
			providesTags: ["Category"],
		}),

		// add review
		addReview: builder.mutation({
			query: ({ slug, data }) => ({
				url: `/products/${slug}/add_review/`,
				method: "POST",
				body: data,
				headers: {
					Authorization: `Bearer ${JSON.parse(localStorage.getItem("tokens"))?.access}`,
				},
			}),
			invalidatesTags: (result, error, { slug }) => [
				{ type: "Product", id: slug },
			],
		}),
	}),
});

export const {
	useGetProductsQuery,
	useGetProductQuery,
	useGetFeaturedProductsQuery,
	useGetTrendingProductsQuery,
	useGetProductReviewsQuery,
	useGetCategoriesQuery,
	useAddReviewMutation,
} = productApi;
