import React from "react";

const SearchBar = ({ query, setQuery }) => {
  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        style={{ padding: "10px", width: "300px", marginBottom: "20px" }}
      />
    </div>
  );
};

export default SearchBar;
