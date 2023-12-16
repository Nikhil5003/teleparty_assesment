import React, { useState, useCallback } from "react";
import "./Search.css"; // Import your CSS file

const SearchComponent = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const debounce = (fn, wait) => {
    let timer;
    return function (...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn(...args);
      }, wait);
    };
  };
  const fetchData = async (query) => {
    try {
      let response = await fetch(
        `https://api.github.com/search/users?q=${query}&sort=followers`
      );
      response = await response.json();
      const githubUsers = response.items.map((user) => ({
        login: user.login,
        url: user.html_url,
      }));

      setResults(githubUsers);
    } catch (error) {
      console.error("Error fetching GitHub users:", error.message);
      setResults([]);
    }
  };
  const debouncedFunction = useCallback(debounce(fetchData, 1000), []);
  const handleSearch = (event) => {
    const inputValue = event.target.value;
    setQuery(inputValue);
    debouncedFunction(inputValue);
  };

  const handleResultClick = (result) => {
    window.open(result, "_blank");
    // You can perform further actions here, such as navigating to a user's GitHub profile page
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search GitHub users..."
        className="search-input"
      />

      <table className="results-table">
        <thead>
          <tr>
            <th>GitHub User</th>
            <th>S.No</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index} onClick={() => handleResultClick(result.url)}>
              <td>{index + 1}</td>
              <td style={{ cursor: "pointer" }}>{result.login}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SearchComponent;
