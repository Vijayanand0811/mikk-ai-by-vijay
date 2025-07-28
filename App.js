// src/App.js
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");
  const [results, setResults] = useState([]);
  const [compare1, setCompare1] = useState("");
  const [compare2, setCompare2] = useState("");
  const [comparison, setComparison] = useState(null);
  const [error, setError] = useState("");
  const [productNames, setProductNames] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/product-names")
      .then(res => res.json())
      .then(data => setProductNames(data))
      .catch(err => console.error("⚠️ Failed to load names"));
  }, []);

  const getSuggestions = async () => {
    try {
      const res = await fetch(`http://localhost:3001/suggest?query=${query}&type=${type}&budget=${budget}`);
      const data = await res.json();
      setResults(data);
      setError(data.length === 0 ? "❌ No matching products found." : "");
    } catch {
      setError("⚠️ Failed to fetch suggestions.");
    }
  };

  const handleCompare = async () => {
    try {
      const res = await fetch(`http://localhost:3001/compare?device1=${compare1}&device2=${compare2}`);
      const data = await res.json();
      if (data.message) {
        setError(data.message);
        setComparison(null);
      } else {
        setComparison(data);
        setError("");
      }
    } catch {
      setError("⚠️ Failed to compare products.");
    }
  };

  return (
    <div className="App">
      <h1>🛍️ Mikk-AI Smart Product Finder <span>by Vijay</span></h1>
      <p>Search like a pro. Powered by AI. Get best deals instantly like Amazon/Flipkart!</p>

      <div className="input-group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type any product, brand or model"
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All Categories</option>
          <option value="headphone">Headphone</option>
          <option value="tv">TV</option>
          <option value="speaker">Speaker</option>
          <option value="laptop">Laptop</option>
          <option value="mobile">Mobile</option>
          <option value="projector">Projector</option>
          <option value="console">Gaming Console</option>
        </select>

        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="Max Budget ₹"
        />

        <button onClick={getSuggestions}>🔍 Search</button>
      </div>

      {error && <p className="error">{error}</p>}

      <h2>🔎 Smart Suggestions</h2>
      <div className="results">
        {results.length === 0 ? <p>Nothing to show</p> : results.map((item, i) => (
          <div key={i} className="card">
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p><b>Features:</b> {item.features.join(", ")}</p>
            <p><b>Best Store:</b> {item.bestStore} – ₹{item.price}</p>
            <p><i>{item.reason}</i></p>
            <a href={item.link} target="_blank" rel="noreferrer">🔗 Buy Now</a>
          </div>
        ))}
      </div>

      <h2>📊 Compare Products</h2>
      <div className="compare-group">
        <select value={compare1} onChange={(e) => setCompare1(e.target.value)}>
          <option value="">Select Product 1</option>
          {productNames.map((name, i) => <option key={i} value={name}>{name}</option>)}
        </select>
        <select value={compare2} onChange={(e) => setCompare2(e.target.value)}>
          <option value="">Select Product 2</option>
          {productNames.map((name, i) => <option key={i} value={name}>{name}</option>)}
        </select>
        <button onClick={handleCompare}>Compare</button>
      </div>

      {comparison && (
        <div className="comparison">
          <div className="card">
            <img src={comparison.product1.image} alt={comparison.product1.name} />
            <h4>{comparison.product1.name}</h4>
            <p>{comparison.product1.features.join(", ")}</p>
            <p><b>{comparison.product1.bestStore}</b> – ₹{comparison.product1.price}</p>
            <a href={comparison.product1.link} target="_blank" rel="noreferrer">View</a>
          </div>
          <div className="card">
            <img src={comparison.product2.image} alt={comparison.product2.name} />
            <h4>{comparison.product2.name}</h4>
            <p>{comparison.product2.features.join(", ")}</p>
            <p><b>{comparison.product2.bestStore}</b> – ₹{comparison.product2.price}</p>
            <a href={comparison.product2.link} target="_blank" rel="noreferrer">View</a>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

