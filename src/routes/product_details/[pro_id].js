// import type { NextApiRequest, NextApiResponse } from "next";
// import { query } from "../../lib/db"; // Ensure this path is correct

// // API route for fetching product details by ID
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { pro_id } = req.query;

//   // Only handle GET requests
//   if (req.method === "GET") {
//     // Check if pro_id is valid
//     if (typeof pro_id !== "string") {
//       return res.status(400).json({ message: "Invalid product ID" });
//     }

//     try {
//       // Fetch product details using pro_id
//       const result = await query(
//         "SELECT * FROM product_details WHERE pro_id = ?",
//         [pro_id]
//       );

//       // Check if product details were found
//       if (result.length > 0) {
//         // Return the first result as product details
//         res.status(200).json(result[0]);
//       } else {
//         // No product found
//         res.status(404).json({ message: "Product not found" });
//       }
//     } catch (error) {
//       console.error("Failed to fetch product:", error);
//       // Return a generic error message
//       res.status(500).json({ message: "Failed to fetch product" });
//     }
//   } else {
//     // Handle unsupported methods
//     res.setHeader("Allow", ["GET"]);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }
