import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Login from "../../pages/Login";
import { useCart } from "../../context/CartContext";
import { useDebounce } from "../../utils/useDebounce";
import { useClickOutside } from "../../utils/useClickOutside";
import SearchSuggestions from "./SearchSuggestions";
import NavbarDropdown from "./NavbarDropdown";
import API from "../../services/api";

function parseStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { cartCount } = useCart();

  const storedData = parseStoredUser();
  const user = storedData?.user || storedData;

  // 🔥 Search states
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [suggestions, setSuggestions] = useState({ products: [], categories: [], brands: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const debouncedSearch = useDebounce(search, 300);
  const searchRef = useClickOutside(() => setShowSuggestions(false));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync URL params on location change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get("keyword") || "");
    setCategory(params.get("category") || "");
    setBrand(params.get("brand") || "");
    setMinPrice(params.get("minPrice") || "");
    setMaxPrice(params.get("maxPrice") || "");
  }, [location.search]);

  // Fetch search suggestions when debounced search changes
  useEffect(() => {
    if (debouncedSearch.trim().length >= 2) {
      fetchSuggestions();
    } else {
      setSuggestions({ products: [], categories: [], brands: [] });
      setShowSuggestions(false);
    }
  }, [debouncedSearch]);

  // Fetch product suggestions from backend
  const fetchSuggestions = async () => {
    setIsLoadingSuggestions(true);
    try {
      const response = await API.get(`/products/search/suggestions?keyword=${encodeURIComponent(debouncedSearch)}`);
      setSuggestions(response.data?.data || { products: [], categories: [], brands: [] });
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions({ products: [], categories: [], brands: [] });
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion) => {
    setShowSuggestions(false);

    if (suggestion.type === 'product') {
      setSearch(suggestion.name);
      navigate(`/product/${suggestion._id}`);
      return;
    }

    if (suggestion.type === 'category') {
      setCategory(suggestion.value);
      setBrand("");
      setSearch(suggestion.value);
      performSearch({ keyword: "", category: suggestion.value, brand: "", minPrice, maxPrice });
      return;
    }

    if (suggestion.type === 'brand') {
      setBrand(suggestion.value);
      setSearch(suggestion.value);
      performSearch({ keyword: "", category, brand: suggestion.value, minPrice, maxPrice });
      return;
    }
  };

  // Perform the search navigation
  const performSearch = ({
    keyword = search,
    category: cat = category,
    brand: br = brand,
    minPrice: minP = minPrice,
    maxPrice: maxP = maxPrice,
  } = {}) => {
    const params = new URLSearchParams();

    if (keyword?.trim()) {
      params.set("keyword", keyword.trim());
    }
    if (cat) {
      params.set("category", cat);
    }
    if (br) {
      params.set("brand", br);
    }
    if (minP) {
      params.set("minPrice", minP);
    }
    if (maxP) {
      params.set("maxPrice", maxP);
    }

    const queryString = params.toString();
    navigate(queryString ? `/search?${queryString}` : "/search");
  };

  const handleSearch = () => {
    performSearch();
  };

  // Navbar dropdown configurations
  const categoryDropdownItems = [
    { label: "Protein Supplements", onClick: () => navigate("/search?category=proteinSupplement") },
    { label: "Gym Equipment", onClick: () => navigate("/search?category=Equipment") },
    { label: "Accessories", onClick: () => navigate("/search?category=Accessories") },
    { label: "Pre-Workout", onClick: () => navigate("/search?category=PreWorkout") },
    { label: "Creatine", onClick: () => navigate("/search?category=Creatine") },
  ];

  const bestSellersItems = [
    { label: "Best Sellers", onClick: () => navigate("/search?sortBy=bestseller") },
    { label: "Top Rated", onClick: () => navigate("/search?sortBy=toprated") },
    { label: "Most Reviewed", onClick: () => navigate("/search?sortBy=reviews") },
  ];

  const brandsItems = [
    { label: "MuscleBlaze", onClick: () => navigate("/search?brand=MuscleBlaze") },
    { label: "Optimum Nutrition", onClick: () => navigate("/search?brand=OptimumNutrition") },
    { label: "Generic", onClick: () => navigate("/search?brand=Generic") },
     { label: "Endura", onClick: () => navigate("/search?brand=Endura") },
      { label: "Powermax", onClick: () => navigate("/search?brand=Powermax") },
       { label: "Cult", onClick: () => navigate("/search?brand=Cult") },
  ];

  const offerZoneItems = [
    { label: "Up to 30% Off", onClick: () => navigate("/?discount=30") },
    { label: "Up to 50% Off", onClick: () => navigate("/?discount=50") },
    { label: "Summer Sale", onClick: () => navigate("/?season=summer") },
    { label: "New Arrivals", onClick: () => navigate("/?sort=new") },
  ];

  return (
    <div className="bg-white shadow-md sticky top-0 z-50">
      {/* TOP NAV */}
      <div className="flex items-center justify-between px-4 md:px-14 py-3 w-full gap-2 md:gap-4">
        {/* HAMBURGER MENU (Mobile) */}
        <button
          className="md:hidden text-gray-700 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* LOGO */}
        <div
          className="flex items-center gap-1 cursor-pointer flex-shrink-0"
          onClick={() => navigate("/")}
        >
          <img
            src="/logo.jpg"
            alt="logo"
            className="h-12 md:h-16 w-12 md:w-16 object-contain"
          />
          <h1 className="text-xl md:text-3xl font-extrabold tracking-wide">
            Gym<span className="text-orange-500">Kart</span>
          </h1>
        </div>

        {/* 🔍 SEARCH + FILTER - AMAZON STYLE */}
        <div ref={searchRef} className="hidden md:flex flex-1 gap-2 mx-4 relative">
          <div className="flex-1 relative">
            {/* Search Input with Suggestions */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => search.trim().length >= 2 && setShowSuggestions(true)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full bg-gray-100 px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
              />
              {/* Search Icon */}
              <button
                onClick={handleSearch}
                className="absolute right-0 top-0 bg-orange-500 text-white px-4 py-2 rounded-r-lg hover:bg-orange-600 transition"
              >
              search
              </button>
            </div>

            {/* Smart Search Suggestions Dropdown */}
            <SearchSuggestions
              suggestions={suggestions}
              isOpen={showSuggestions}
              searchQuery={search}
              onSelectSuggestion={handleSelectSuggestion}
              isLoading={isLoadingSuggestions}
            />
          </div>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-gray-100 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Categories</option>
            <option value="proteinSupplement">Protein Supplements</option>
            <option value="Equipment">Equipment</option>
            <option value="Accessories">Accessories</option>
          </select>

          {/* Min Price */}
          <input
            type="number"
            placeholder="Min ₹"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-20 bg-gray-100 px-2 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          {/* Max Price */}
          <input
            type="number"
            placeholder="Max ₹"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-20 bg-gray-100 px-2 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 md:gap-6 text-gray-700">
          {/* Cart */}
          <div
            className="relative cursor-pointer hover:text-orange-500 transition"
            onClick={() => navigate("/cart")}
          >
            <span className="text-2xl">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold">
                {cartCount}
              </span>
            )}
          </div>

          {/* Profile / Login */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 bg-gray-100 px-3 md:px-3 py-2 md:py-2 rounded-full hover:bg-gray-200 transition"
              >
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold text-sm">
                  {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="text-left hidden md:block">
                  <div className="font-medium text-xs md:text-sm">{user.name || user.email}</div>
                  <div className="text-xs text-gray-500">{user.role || "Customer"}</div>
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 z-50 mt-2 w-64 md:w-72 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 text-sm text-gray-700 animate-fadeIn">
                  <div className="font-semibold text-gray-900">{user.name || "Profile"}</div>
                  <p className="text-xs text-gray-500">Tap below to see full details.</p>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Email:</span>
                      <span className="text-xs">{user.email || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Role:</span>
                      <span className="text-xs">{user.role || "Customer"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Name:</span>
                      <span className="text-xs">{user.name || "-"}</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/profile");
                      }}
                      className="w-full text-left text-indigo-600 hover:text-indigo-700 text-xs"
                    >
                      View full profile
                    </button>
                    <button
                      onClick={() => {
                        localStorage.removeItem("user");
                        setProfileOpen(false);
                        navigate("/");
                      }}
                      className="w-full text-left text-red-500 hover:text-red-700 text-xs"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="bg-orange-500 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg hover:bg-orange-600 transition text-sm"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* SECOND NAV - DESKTOP */}
      <div className="border-t hidden md:block bg-gray-50">
        <div className="flex gap-8 px-6 md:px-14 py-3 text-sm text-gray-600">
          <NavbarDropdown
            label="Shop By Category"
            items={categoryDropdownItems}
            isMobile={false}
          />
          <NavbarDropdown
            label="Best Sellers"
            items={bestSellersItems}
            isMobile={false}
          />
          <NavbarDropdown
            label="Brands"
            items={brandsItems}
            isMobile={false}
          />
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-gray-50 px-4 py-3 space-y-2">
          {/* Mobile Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full bg-white px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleSearch}
              className="w-full mt-2 bg-orange-500 text-white px-3 py-2 rounded text-sm hover:bg-orange-600 transition"
            >
              Search
            </button>
          </div>

          {/* Mobile Dropdowns */}
          <NavbarDropdown
            label="Shop By Category"
            items={categoryDropdownItems}
            isMobile={true}
          />
          <NavbarDropdown
            label="Best Sellers"
            items={bestSellersItems}
            isMobile={true}
          />
          <NavbarDropdown
            label="Brands"
            items={brandsItems}
            isMobile={true}
          />
          <NavbarDropdown
            label="Offer Zone"
            items={offerZoneItems}
            isMobile={true}
          />
        </div>
      )}

      {showModal && <Login setShowModal={setShowModal} />}
    </div>
  );
}
