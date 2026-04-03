// src/components/common/Footer.jsx

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1
                      md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-4">ShopBD</h3>
          <p className="text-sm">
            Your one-stop multi-vendor e-commerce platform in Bangladesh.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-orange-400">Home</a></li>
            <li><a href="/products" className="hover:text-orange-400">Products</a></li>
            <li><a href="/about" className="hover:text-orange-400">About</a></li>
            <li><a href="/contact" className="hover:text-orange-400">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Customer Service</h4>
          <ul className="space-y-2 text-sm">
            <li>FAQ</li>
            <li>Return Policy</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>📞 +880 1712-345678</li>
            <li>📧 support@shopbd.com</li>
            <li>📍 Dhaka, Bangladesh</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 text-center py-4 text-sm">
        © 2025 ShopBD. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;