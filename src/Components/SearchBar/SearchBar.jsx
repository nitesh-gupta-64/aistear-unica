import React from "react";
import './SearchBar.css'

const SearchBar = ({ query, setQuery }) => {
  return (
    <div className="searchBar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
    </div>
  );
};

export default SearchBar;
