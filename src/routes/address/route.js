import express from "express";
import fs from "fs";
import path from "path";
import db from "../../lib/db.js";

const router = express.Router();

// Add addresses from JSON file
router.post("/", async (req, res) => {
  try {
    // Read and parse the JSON file
    const filePath = path.join(process.cwd(), "public", "json", "address.json");
    const fileContent = fs.readFileSync(filePath, "utf8");
    const addresses = JSON.parse(fileContent);

    // Loop through each address and insert it into the database
    for (const address of addresses) {
      const { district, amphoe, province, zipcode } = address;

      // Assuming `address_name` and `user_id` are provided in the request body or default values
      const address_name = req.body.address_name || "Default Address Name";
      const user_id = req.body.user_id || 1; // Example customer ID

      // Insert the address data into the database
      await db.query(
        "INSERT INTO address (address_name, user_id, district, amphoe, province, zipcode) VALUES (?, ?, ?, ?, ?, ?)",
        [address_name, user_id, district, amphoe, province, zipcode]
      );
    }

    res.status(201).json({ message: "Addresses added successfully." });
  } catch (error) {
    console.error("Error reading or inserting data:", error);
    res.status(500).json({ message: "Failed to add addresses." });
  }
});

// Retrieve addresses for a specific user
router.get("/", async (req, res) => {
  try {
    // Check if user_id is provided as query parameter
    const { user_id } = req.query;

    // Check if user_id exists and is a valid number
    if (!user_id || isNaN(user_id)) {
      return res
        .status(400)
        .json({ message: "Invalid or missing user_id parameter." });
    }

    // Query the database for addresses for the specific user_id
    const query = "SELECT * FROM address WHERE user_id = ?";
    const queryParams = [user_id];

    // Retrieve addresses from the database
    const [rows] = await db.query(query, queryParams);

    // Log the retrieved rows for debugging
    console.log("Retrieved addresses:", rows);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: `No addresses found for user_id: ${user_id}` });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error retrieving addresses:", error);
    res.status(500).json({ message: "Failed to retrieve addresses." });
  }
});

export default router;
