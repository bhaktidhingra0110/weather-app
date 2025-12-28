const express = require("express");
const cors = require("cors");
const axios = require("axios"); // Import axios (this was missing before)

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ✅ Your CORRECTED 32-character API Key
const API_KEY = "ba26fba758d8530ac05d173346da27e6";

app.get("/weather", async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${encodeURIComponent(city)}&appid=${API_KEY}`;

    // ✅ Using axios instead of fetch to prevent server crashes
    const response = await axios.get(url);
    res.json(response.data);

  } catch (error) {
    // If OpenWeather returns an error (like 404 City Not Found), send it to frontend
    if (error.response) {
       return res.status(error.response.status).json({
        error: error.response.data.message || "Weather fetch failed",
      });
    }
    console.error("Backend error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});