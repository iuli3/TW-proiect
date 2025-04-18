import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import "./searchBar.css";

const cities = ["Bucharest", "Cluj-Napoca", "Timișoara", "Iași", "Constanța"];
const categories = ["Music", "Theatre", "Sports", "Stand-up", "Business", "Festival"];

const SearchBar = ({ setResults, setIsFiltered }) => {
  const [input, setInput] = useState("");
  const [selectedCity, setSelectedCity] = useState("City");
  const [selectedCategory, setSelectedCategory] = useState("Category");
  const [showFilters, setShowFilters] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const cityDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target)) {
        setShowCityDropdown(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resetFilters = useCallback(async () => {
    setSelectedCity("City");
    setSelectedCategory("Category");
    setInput("");
    setIsFiltered(false);
    try {
      const res = await axios.get("http://localhost:5000/api/events");
      setResults(res.data);
    } catch {
      setResults([]);
    }
  }, [setResults, setIsFiltered]);

  const searchByInput = useCallback(async () => {
    const normalizeText = (str) =>
      str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[\s-]/g, "")
        .toLowerCase();

    const normalized = normalizeText(input.trim());
    if (!normalized) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/events/search/${encodeURIComponent(normalized)}`
      );
      setResults(response.data);
      setIsFiltered(true);
    } catch {
      setResults([]);
      setIsFiltered(true);
    }
  }, [input, setResults, setIsFiltered]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (input.trim()) {
        searchByInput();
      } else {
        resetFilters();
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [input, searchByInput, resetFilters]);

  const fetchFilteredEvents = async (city, category) => {
    try {
      let url = `http://localhost:5000/api/events`;
      if (city !== "City") url += `/city/${encodeURIComponent(city)}`;
      if (category !== "Category") {
        url += city !== "City"
          ? `/category/${encodeURIComponent(category)}`
          : `/categoryOnly/${encodeURIComponent(category)}`;
      }
      const response = await axios.get(url);
      setResults(response.data);
      setIsFiltered(true);
    } catch {
      setResults([]);
      setIsFiltered(true);
    }
  };

  return (
    <div className="searchbar-wrapper">
      <div className="header-divider-gradient"></div>
      <div className="filter-search-toggle">
        <button
          className="filter-toggle-button"
          onClick={() => setShowFilters(!showFilters)}
        >
          <i className="fa-solid fa-filter"></i>
        </button>

        <div className="input-wrapper">
          <FaSearch id="search-icon" onClick={searchByInput} style={{ cursor: "pointer" }} />
          <input
            placeholder="Search for events..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") searchByInput();
            }}
          />
        </div>
      </div>

      {showFilters && (
        <div className="filter-options">
          <div className="city-filter" ref={cityDropdownRef}>
            <button
              className="city-filter-button"
              onClick={() => {
                setShowCityDropdown(!showCityDropdown);
                setShowCategoryDropdown(false);
              }}
            >
              {selectedCity}
            </button>
            {showCityDropdown && (
              <div className="city-dropdown">
                {cities.map((city) => (
                  <div
                    key={city}
                    className="city-dropdown-item"
                    onClick={() => {
                      setSelectedCity(city);
                      setShowCityDropdown(false);
                      fetchFilteredEvents(city, selectedCategory);
                    }}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="city-filter" ref={categoryDropdownRef}>
            <button
              className="city-filter-button"
              onClick={() => {
                setShowCategoryDropdown(!showCategoryDropdown);
                setShowCityDropdown(false);
              }}
            >
              {selectedCategory}
            </button>
            {showCategoryDropdown && (
              <div className="city-dropdown">
                {categories.map((cat) => (
                  <div
                    key={cat}
                    className="city-dropdown-item"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowCategoryDropdown(false);
                      fetchFilteredEvents(selectedCity, cat);
                    }}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="reset-button" onClick={resetFilters}>
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
