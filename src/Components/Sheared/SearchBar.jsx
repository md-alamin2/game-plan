import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({setSearchTerm, searchTerm, placeholder}) => {
  const handleSearch = (e) => {
    e.preventDefault();
  };
  return (
    <div >
      {/* Search Bar */}
      <form onSubmit={handleSearch} >
        <div className="flex gap-2">
          <div className="relative max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={placeholder}
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="btn btn-secondary text-white"
            >
              Clear
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
