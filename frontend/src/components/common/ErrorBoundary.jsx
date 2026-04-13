import React from "react";

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		console.error("Error caught by boundary:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="max-w-7xl mx-auto px-4 py-8">
					<div className="bg-red-50 border border-red-200 rounded-lg p-6">
						<h2 className="text-2xl font-bold text-red-800 mb-2">
							Something went wrong
						</h2>
						<p className="text-red-700 mb-4">
							{this.state.error?.message || "An unexpected error occurred"}
						</p>
						<button
							onClick={() => window.location.reload()}
							className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
							Reload Page
						</button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
