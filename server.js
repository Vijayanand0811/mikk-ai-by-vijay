// server.js
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Simulated dynamic product data (as if scraped/fetched)
const simulatedProducts = [
  {
    name: "Sony WH-1000XM5",
    brand: "Sony",
    type: "headphone",
    features: ["Noise Cancellation", "Wireless", "40hr Battery"],
    image: "https://m.media-amazon.com/images/I/61b1N3DFjBL._SX679_.jpg",
    stores: [
      { name: "Amazon", price: 24990, link: "https://www.amazon.in/dp/B0B4FJGN7F" },
      { name: "Flipkart", price: 25990, link: "https://www.flipkart.com" }
    ]
  },
  {
    name: "boAt Rockerz 450",
    brand: "boAt",
    type: "headphone",
    features: ["Wireless", "15hr Battery", "Lightweight"],
    image: "https://m.media-amazon.com/images/I/61u1VALn6FL._SX679_.jpg",
    stores: [
      { name: "Amazon", price: 1499, link: "https://www.amazon.in/dp/B086W6NT4K" },
      { name: "boAt", price: 1399, link: "https://www.boat-lifestyle.com" }
    ]
  },
  {
    name: "Samsung QLED 55",
    brand: "Samsung",
    type: "tv",
    features: ["QLED", "55 inch", "4K UHD", "Smart TV"],
    image: "https://m.media-amazon.com/images/I/91Q4U9OpgwL._SX679_.jpg",
    stores: [
      { name: "Reliance Digital", price: 54990, link: "https://www.reliancedigital.in" },
      { name: "Amazon", price: 55990, link: "https://www.amazon.in" }
    ]
  },
  {
    name: "LG OLED evo 4K TV",
    brand: "LG",
    type: "tv",
    features: ["OLED", "65 inch", "4K UHD", "WebOS"],
    image: "https://m.media-amazon.com/images/I/81NwQx6eZDL._SX679_.jpg",
    stores: [
      { name: "Croma", price: 89990, link: "https://www.croma.com" },
      { name: "Amazon", price: 91990, link: "https://www.amazon.in" }
    ]
  }
];

// Utility: fuzzy text matching
function fuzzyMatch(str1, str2) {
  return str1.toLowerCase().includes(str2.toLowerCase()) ||
         str2.toLowerCase().includes(str1.toLowerCase());
}

// /suggest - Smart product recommendations
app.get("/suggest", (req, res) => {
  const { query, type, budget } = req.query;
  const budgetLimit = parseInt(budget) || Infinity;

  let results = simulatedProducts.filter((product) => {
    const matchText = query ? fuzzyMatch(product.name, query) || fuzzyMatch(product.brand, query) : true;
    const matchType = type ? product.type === type.toLowerCase() : true;
    const matchBudget = product.stores.some(store => store.price <= budgetLimit);
    return matchText && matchType && matchBudget;
  });

  results = results.map((p) => {
    const bestStore = [...p.stores].sort((a, b) => a.price - b.price)[0];
    return {
      name: p.name,
      brand: p.brand,
      type: p.type,
      features: p.features,
      image: p.image,
      price: bestStore.price,
      bestStore: bestStore.name,
      link: bestStore.link,
      reason: `Best deal for ${p.name} is at ₹${bestStore.price} on ${bestStore.name}. Features: ${p.features.slice(0, 2).join(", ")}`
    };
  });

  res.json(results);
});

// /compare - Smart product comparison
app.get("/compare", (req, res) => {
  const { device1, device2 } = req.query;

  const findBestMatch = (input) => {
    return simulatedProducts.find(p => fuzzyMatch(p.name, input) || fuzzyMatch(p.brand, input));
  };

  const d1 = findBestMatch(device1);
  const d2 = findBestMatch(device2);

  if (!d1 || !d2) return res.status(404).json({ message: "❌ One or both products not found." });

  const best1 = [...d1.stores].sort((a, b) => a.price - b.price)[0];
  const best2 = [...d2.stores].sort((a, b) => a.price - b.price)[0];

  res.json({
    product1: {
      name: d1.name,
      features: d1.features,
      bestStore: best1.name,
      price: best1.price,
      link: best1.link,
      image: d1.image
    },
    product2: {
      name: d2.name,
      features: d2.features,
      bestStore: best2.name,
      price: best2.price,
      link: best2.link,
      image: d2.image
    }
  });
});

// /product-names - For dropdown in frontend
app.get("/product-names", (req, res) => {
  const names = simulatedProducts.map(p => p.name);
  res.json(names);
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("✅ Mikk-AI Backend Running - Powered by Vijay");
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
