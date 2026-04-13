// src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import store from "./store";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import TestAPI from "./pages/TestAPI";
import ErrorBoundary from "./components/common/ErrorBoundary";

const ProtectedRoute = ({ children }) => {
	return children;
};

function App() {
	return (
		<Provider store={store}>
			<ErrorBoundary>
				<BrowserRouter>
					<Toaster position="top-right" />
					<Routes>
						<Route path="/" element={<MainLayout />}>
							<Route index element={<Home />} />
							<Route path="products" element={<Products />} />
							<Route path="products/:slug" element={<ProductDetail />} />
							<Route path="cart" element={<Cart />} />
							<Route path="test-api" element={<TestAPI />} />

							<Route path="login" element={<Login />} />
							<Route path="register" element={<Register />} />

							<Route
								path="profile"
								element={
									<ProtectedRoute>
										<Profile />
									</ProtectedRoute>
								}
							/>

							<Route path="*" element={<NotFound />} />
						</Route>
					</Routes>
				</BrowserRouter>
			</ErrorBoundary>
		</Provider>
	);
}

export default App;
