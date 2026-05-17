// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// /**
//  * Footer Component
//  * Professional modern e-commerce footer with business details,
//  * links, and trust badges
//  */
// export default function Footer() {
//   const navigate = useNavigate();

//   const handleCategoryClick = (category) => {
//     navigate(`/?category=${category}`);
//     window.scrollTo(0, 0);
//   };

//   return (
//     <footer className="bg-gray-900 text-gray-200 mt-12">
//       {/* Main Footer Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
//           {/* About GymKart */}
//           <div>
//             <h3 className="text-white font-bold text-lg mb-4">About GymKart</h3>
//             <p className="text-sm leading-relaxed mb-4">
//               GymKart is your premium destination for gym equipment, protein supplements, and fitness accessories. We're committed to helping fitness enthusiasts achieve their goals with quality products and excellent customer service.
//             </p>
//             <div className="flex gap-3">
//               <a href="#" className="hover:text-orange-500 transition text-lg">f</a>
//               <a href="#" className="hover:text-orange-500 transition text-lg">𝕏</a>
//               <a href="#" className="hover:text-orange-500 transition text-lg">📷</a>
//               <a href="#" className="hover:text-orange-500 transition text-lg">▶</a>
//             </div>
//           </div>

//           {/* Customer Service */}
//           <div>
//             <h3 className="text-white font-bold text-lg mb-4">Customer Service</h3>
//             <ul className="space-y-2 text-sm">
//               <li>
//                 <button
//                   onClick={() => navigate('/help/contact')}
//                   className="hover:text-orange-500 transition"
//                 >
//                   Contact Us
//                 </button>
//               </li>
//               <li>
//                 <button
//                   onClick={() => navigate('/help/shipping')}
//                   className="hover:text-orange-500 transition"
//                 >
//                   Shipping Info
//                 </button>
//               </li>
//               <li>
//                 <button
//                   onClick={() => navigate('/help/returns')}
//                   className="hover:text-orange-500 transition"
//                 >
//                   Returns & Refunds
//                 </button>
//               </li>
//               <li>
//                 <button
//                   onClick={() => navigate('/help/faq')}
//                   className="hover:text-orange-500 transition"
//                 >
//                   FAQ
//                 </button>
//               </li>
//               <li>
//                 <button
//                   onClick={() => navigate('/help/size-guide')}
//                   className="hover:text-orange-500 transition"
//                 >
//                   Size Guide
//                 </button>
//               </li>
//             </ul>
//           </div>

//           {/* Shop By Category */}
//           <div>
//             <h3 className="text-white font-bold text-lg mb-4">Shop By Category</h3>
//             <ul className="space-y-2 text-sm">
//               <li>
//                 <button
//                   onClick={() => handleCategoryClick('proteinSupplement')}
//                   className="hover:text-orange-500 transition"
//                 >
//                   Protein Supplements
//                 </button>
//               </li>
//               <li>
//                 <button
//                   onClick={() => handleCategoryClick('Equipment')}
//                   className="hover:text-orange-500 transition"
//                 >
//                   Gym Equipment
//                 </button>
//               </li>
//               <li>
//                 <button
//                   onClick={() => handleCategoryClick('Accessories')}
//                   className="hover:text-orange-500 transition"
//                 >
//                   Accessories
//                 </button>
//               </li>
//               <li>
//                 <button
//                   onClick={() => handleCategoryClick('PreWorkout')}
//                   className="hover:text-orange-500 transition"
//                 >
//                   Pre-Workout
//                 </button>
//               </li>
//               <li>
//                 <button
//                   onClick={() => handleCategoryClick('Creatine')}
//                   className="hover:text-orange-500 transition"
//                 >
//                   Creatine
//                 </button>
//               </li>
//             </ul>
//           </div>

//           {/* Policies */}
//           <div>
//             <h3 className="text-white font-bold text-lg mb-4">Policies</h3>
//             <ul className="space-y-2 text-sm">
//               <li>
//                 <button
//                   onClick={() => navigate('/legal/privacy')}
//                   className="hover:text-orange-500 transition"
//                 >
//                   Privacy Policy
//                 </button>
//               </li>
//               <li>
//                 <button
//                   onClick={() => navigate('/legal/terms')}
//                   className="hover:text-orange-500 transition"
//                 >
//                   Terms & Conditions
//                 </button>
//               </li>
//               <li>
//                 <button
//                   onClick={() => navigate('/legal/warranty')}
//                   className="hover:text-orange-500 transition"
//                 >
//                   Warranty Info
//                 </button>
//               </li>
//               <li>
//                 <button
//                   onClick={() => navigate('/legal/disclaimer')}
//                   className="hover:text-orange-500 transition"
//                 >
//                   Disclaimer
//                 </button>
//               </li>
//             </ul>
//           </div>

//           {/* Contact Info */}
//           <div>
//             <h3 className="text-white font-bold text-lg mb-4">Get In Touch</h3>
//             <ul className="space-y-3 text-sm">
//               <li className="flex items-start gap-2">
//                 <span className="mt-0.5">📧</span>
//                 <div>
//                   <p className="text-gray-400">Email</p>
//                   <a href="mailto:support@gymkart.com" className="hover:text-orange-500 transition">
//                     support@gymkart.com
//                   </a>
//                 </div>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span className="mt-0.5">📱</span>
//                 <div>
//                   <p className="text-gray-400">Phone</p>
//                   <a href="tel:+919876543210" className="hover:text-orange-500 transition">
//                     +91 9876543210
//                   </a>
//                 </div>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span className="mt-0.5">📍</span>
//                 <div>
//                   <p className="text-gray-400">Address</p>
//                   <p>123 Fitness Street, Gym City, GC 100001, India</p>
//                 </div>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span className="mt-0.5">⏰</span>
//                 <div>
//                   <p className="text-gray-400">Support</p>
//                   <p>Mon - Fri: 9 AM - 6 PM IST</p>
//                 </div>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Trust Badges & Features */}
//         <div className="border-t border-gray-700 mt-8 pt-8">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//             {/* Fast Delivery */}
//             <div className="flex items-center gap-3 text-center md:text-left">
//               <div className="text-3xl flex-shrink-0">🚚</div>
//               <div>
//                 <h4 className="text-white font-semibold text-sm">Fast Delivery</h4>
//                 <p className="text-gray-400 text-xs">Quick shipping across India</p>
//               </div>
//             </div>

//             {/* Genuine Products */}
//             <div className="flex items-center gap-3 text-center md:text-left">
//               <div className="text-3xl flex-shrink-0">✅</div>
//               <div>
//                 <h4 className="text-white font-semibold text-sm">100% Genuine</h4>
//                 <p className="text-gray-400 text-xs">Authentic products guaranteed</p>
//               </div>
//             </div>

//             {/* Secure Payments */}
//             <div className="flex items-center gap-3 text-center md:text-left">
//               <div className="text-3xl flex-shrink-0">🔒</div>
//               <div>
//                 <h4 className="text-white font-semibold text-sm">Secure Payments</h4>
//                 <p className="text-gray-400 text-xs">SSL encrypted transactions</p>
//               </div>
//             </div>

//             {/* Easy Returns */}
//             <div className="flex items-center gap-3 text-center md:text-left">
//               <div className="text-3xl flex-shrink-0">↩️</div>
//               <div>
//                 <h4 className="text-white font-semibold text-sm">Easy Returns</h4>
//                 <p className="text-gray-400 text-xs">30-day return policy</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Footer */}
//       <div className="border-t border-gray-700 bg-gray-950 px-4 sm:px-6 lg:px-8 py-6">
//         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
//           <div className="text-sm text-gray-400">
//             <p>© 2024 GymKart. All rights reserved. Made with ❤️ for fitness enthusiasts</p>
//           </div>
//           <div className="flex gap-6 text-sm text-gray-400">
//             <a href="#" className="hover:text-orange-500 transition">Sitemap</a>
//             <a href="#" className="hover:text-orange-500 transition">Cookie Settings</a>
//             <a href="#" className="hover:text-orange-500 transition">Accessibility</a>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }

import React from 'react';
import { useNavigate } from 'react-router-dom';

 export default function Footer() {
  const navigate = useNavigate();
  return(
<>
    {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Company Info */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                <img
                  src="/logo.jpg"
                  alt="GymKart"
                  className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/40x40?text=GK';
                    e.target.onerror = null;
                  }}
                />
                <h3 className="text-xl sm:text-2xl font-bold">GymKart</h3>
              </div>
              <p className="text-gray-400 mb-4 text-sm sm:text-base">
                Your ultimate destination for premium gym equipment and supplements.
                Build your dream body with our quality products.
              </p>
              <div className="flex justify-center lg:justify-start space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition duration-300 text-xl">
                  📘
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300 text-xl">
                  📷
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300 text-xl">
                  🐦
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300 text-xl">
                  💼
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center lg:text-left">
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-400 hover:text-white transition duration-300 text-sm sm:text-base">Home</a></li>
                <li><a href="/?category=proteinSupplement" className="text-gray-400 hover:text-white transition duration-300 text-sm sm:text-base">Protein</a></li>
                <li><a href="/?category=Equipment" className="text-gray-400 hover:text-white transition duration-300 text-sm sm:text-base">Equipment</a></li>
                <li><a href="/?category=Accessories" className="text-gray-400 hover:text-white transition duration-300 text-sm sm:text-base">Accessories</a></li>
                <li><a href="/cart" className="text-gray-400 hover:text-white transition duration-300 text-sm sm:text-base">Cart</a></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="text-center lg:text-left">
              <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300 text-sm sm:text-base">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300 text-sm sm:text-base">Shipping Info</a></li>
                <li><a href="# " className="text-gray-400 hover:text-white transition duration-300 text-sm sm:text-base">Returns</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300 text-sm sm:text-base">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300 text-sm sm:text-base">Size Guide</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="text-center lg:text-left">
              <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
              <p className="text-gray-400 mb-4 text-sm sm:text-base">
                Subscribe to get special offers and fitness tips.
              </p>
              <div className="flex max-w-xs mx-auto lg:mx-0">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-orange-500 text-sm"
                />
                <button className="bg-orange-500 text-white px-3 sm:px-4 py-2 rounded-r-lg hover:bg-orange-600 transition duration-300 text-sm sm:text-base font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-6 sm:pt-8 text-center">
            <p className="text-gray-400 text-sm sm:text-base">
              © 2026 GymKart. All rights reserved. | Made with ❤️ for fitness enthusiasts
            </p>
          </div>
        </div>
      </footer>
      </>
  );
}