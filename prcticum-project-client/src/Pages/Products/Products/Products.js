import React, { useEffect, useState } from "react";
import { useSearchContext } from "../../../Contexts/SearchContext";
import ProductCard from "../ProductCard/ProductCard";
import Product from "../Product/Product";
import Loading from "../../../Shared/Loading/Loading";
import { useQuery } from "@tanstack/react-query";
import { safeFetch } from "../../../utils/api";

const Products = () => {
  const { searchInput, clearSearch } = useSearchContext();
  const [search, setSearch] = useState("");
  const [displayLimit, setDisplayLimit] = useState(6);
  const [products, setProducts] = useState([]);
  const [loading, setIsLoading] = useState(true);

  // Set search from searchInput context when it changes
  useEffect(() => {
    if (searchInput) {
      setSearch(searchInput);
    }
  }, [searchInput]);

  const {
    data: categories = [],
    isLoading,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return await safeFetch(`${process.env.REACT_APP_API_URL}/categories`);
    },
  });

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        let url;
        if (search && search.trim()) {
          // Use search endpoint when there's a search term
          url = `${process.env.REACT_APP_API_URL}/search-products?search=${encodeURIComponent(search.toLowerCase())}`;
        } else {
          // Use regular products endpoint when no search term
          url = `${process.env.REACT_APP_API_URL}/products-page?limit=${displayLimit}`;
        }
        
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        console.log(data);
        setProducts(data);
      } catch (err) {
        console.error('Error loading products', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [search, displayLimit]);

  const handleCategoryProduct = (categoryName) => {
    setSearch(categoryName);
    setDisplayLimit(6); // Reset display limit when changing category
  };

  const [getProduct, setProduct] = useState(null);
  const handleProductInfo = (product) => {
    setProduct(product);
    // console.log("Click", product);
  };
  const handleSeeMore = () => {
    // Only increase display limit if not searching (search returns all results)
    if (!search || !search.trim()) {
      setDisplayLimit(displayLimit + 6);
    }
  };

  return (
    <div className="flex">
      <div className="w-1/6 bg-slate-300">
        <div className="drawer lg:drawer-open mt-16">
          <input id="sidebar" type="checkbox" className="drawer-toggle" />

          <div className="drawer-side mt-28 md:mt-0">
            <label
              htmlFor="sidebar"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu  p-2 md:p-4 w-60 min-h-full bg-base-200 md:bg-slate-300 text-base-content font-serif">
              {/* Sidebar content here */}
              {isLoading ? ( // Show a loader component while data is loading
                <Loading></Loading>
              ) : (
                <></>
              )}
              {categories ? (
                categories?.map((category) => (
                  <li key={category._id}>
                    <span
                      onClick={() => handleCategoryProduct(category.name)}
                      className="text-xl"
                    >
                      {category.name}
                    </span>
                  </li>
                ))
              ) : (
                <></>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="w-5/6 mt-10">
        <div className="text-center mb-4">
          {search && search.trim() ? (
            <div className="flex justify-center items-center gap-4 mb-4">
              <h1 className="font-semibold">
                Search results for "{search}":
              </h1>
              <button 
                onClick={() => {
                  setSearch("");
                  clearSearch();
                }} 
                className="btn btn-sm btn-outline"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <h1 className="font-semibold">All Products</h1>
          )}
        </div>
        {loading ? ( // Show a loader component while data is loading
          <Loading></Loading>
        ) : products?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-7 max-w-[1440px] my-7 mx-5 md:mx-28 justify-items-center">
            {products?.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                handleProductInfo={handleProductInfo}
              />
            ))}
          </div>
        ) : (
          <h1 className="text-center font-semibold text-xl">
            No product Found
          </h1>
        )}
        {getProduct && <Product product={getProduct} />}

        {/* Only show "See More" button if not searching */}
        {(!search || !search.trim()) && products?.length >= displayLimit && (
          <div className="flex justify-center mb-5">
            <button onClick={() => handleSeeMore()} className="btn btn-primary">See More</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
