import React, { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export const useSearchContext = () => {
  return useContext(SearchContext);
};

export const SearchProvider = ({ children }) => {
  const [searchInput, setSearchInput] = useState("");
  
  const clearSearch = () => {
    setSearchInput("");
  };

  console.log(searchInput);

  return (
    <SearchContext.Provider value={{ searchInput, setSearchInput, clearSearch }}>
      {children}
    </SearchContext.Provider>
  );
};
