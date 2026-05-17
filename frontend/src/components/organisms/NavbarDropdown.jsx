import React, { useState, useRef } from 'react';
import { useClickOutside } from '../../utils/useClickOutside';

/**
 * NavbarDropdown Component
 * Responsive dropdown menu for navbar navigation items
 * Supports both hover (desktop) and click (mobile)
 * 
 * @param {String} label - Dropdown label/title
 * @param {Array} items - Array of menu items {label, onClick, icon?}
 * @param {Boolean} isMobile - Whether in mobile mode
 */
export default function NavbarDropdown({ label, items, isMobile = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const ref = useClickOutside(() => setIsOpen(false));

  const handleItemClick = (item) => {
    if (item.onClick) {
      item.onClick();
    }
    setIsOpen(false);
  };

  const shouldShowDropdown = isMobile ? isOpen : isHovering || isOpen;

  return (
    <div
      ref={ref}
      className="relative group"
      onMouseEnter={() => !isMobile && setIsHovering(true)}
      onMouseLeave={() => !isMobile && setIsHovering(false)}
    >
      {/* Dropdown Trigger */}
      <button
        onClick={() => isMobile && setIsOpen(!isOpen)}
        className="cursor-pointer hover:text-orange-500 transition flex items-center gap-1 py-2"
      >
        {label}
        <svg
          className={`w-4 h-4 transition-transform ${shouldShowDropdown ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {shouldShowDropdown && (
        <div
          className={`absolute top-full left-0 mt-0 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 ${
            isMobile ? 'animate-fadeIn' : 'group-hover:block hidden'
          }`}
        >
          {items.length > 0 ? (
            <div className="py-2">
              {items.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleItemClick(item)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 hover:text-orange-500 transition flex items-center gap-2 text-sm"
                >
                  {item.icon && <span className="text-lg">{item.icon}</span>}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-2 text-gray-500 text-sm text-center">
              No items available
            </div>
          )}
        </div>
      )}
    </div>
  );
}
