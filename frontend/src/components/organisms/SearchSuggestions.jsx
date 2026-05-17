import React from 'react';

/**
 * SearchSuggestions Component
 * Displays smart search suggestions dropdown with product matches
 * 
 * @param {Array} suggestions - Array of product suggestions
 * @param {Boolean} isOpen - Whether dropdown is visible
 * @param {String} searchQuery - Current search query
 * @param {Function} onSelectSuggestion - Callback when suggestion is clicked
 * @param {Boolean} isLoading - Whether loading suggestions
 */
export default function SearchSuggestions({
  suggestions,
  isOpen,
  searchQuery,
  onSelectSuggestion,
  isLoading,
}) {
  if (!isOpen || !searchQuery.trim()) {
    return null;
  }

  const { products = [], categories = [], brands = [] } = suggestions || {};
  const hasResults = products.length > 0 || categories.length > 0 || brands.length > 0;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-40 max-h-96 overflow-y-auto">
      {isLoading ? (
        <div className="p-4 text-center text-gray-500">
          <div className="inline-block animate-spin">⌛</div>
          <p className="text-sm">Searching products...</p>
        </div>
      ) : hasResults ? (
        <div className="divide-y divide-gray-200">
          {products.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-2 text-xs text-gray-500 font-semibold uppercase">
                Product Suggestions
              </div>
              {products.map((product) => (
                <div
                  key={product._id}
                  onClick={() => onSelectSuggestion(product)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition flex items-center gap-3"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.style.display = 'none')}
                      />
                    ) : (
                      <span className="text-xs text-gray-500">No image</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {product.category} • {product.brand}
                    </div>
                    <div className="text-sm font-semibold text-orange-500">
                      ₹{product.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {categories.length > 0 && (
            <div className="py-2 px-4">
              <div className="text-xs text-gray-500 font-semibold uppercase mb-2">
                Search Categories
              </div>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((item) => (
                  <button
                    key={`category-${item.value}`}
                    type="button"
                    onClick={() => onSelectSuggestion(item)}
                    className="text-left rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    {item.value}
                  </button>
                ))}
              </div>
            </div>
          )}

          {brands.length > 0 && (
            <div className="py-2 px-4">
              <div className="text-xs text-gray-500 font-semibold uppercase mb-2">
                Search Brands
              </div>
              <div className="grid grid-cols-2 gap-2">
                {brands.map((item) => (
                  <button
                    key={`brand-${item.value}`}
                    type="button"
                    onClick={() => onSelectSuggestion(item)}
                    className="text-left rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    {item.value}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500">
          <p className="text-sm">No suggestions found</p>
        </div>
      )}
    </div>
  );
}
