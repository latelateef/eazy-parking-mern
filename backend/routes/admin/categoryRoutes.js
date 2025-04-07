// Category Model
// model Category {
//     id           String     @id @default(uuid()) @db.Char(36)
//     vehicleCat   String     @map("VehicleCat") @db.VarChar(120)
//     creationDate DateTime?  @default(now()) @map("CreationDate") @db.Timestamp(0)
  
//     @@map("tblcategory")
//   }

import express from "express";
import primsa from "../../prisma/prismaClient.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

// Add Category
router.post("/add", auth, async (req, res) => {
    // Check if the user is an admin
    try {
      if (!req.isAdmin) {
          return res.status(403).json({ message: "Access denied" });
          }
    const { vehicleCat } = req.body;
    const newCategory = await primsa.category.create({
      data: {
        vehicleCat,
      },
    });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get All Categories
router.get("/get-all", auth, async (req, res) => {
    // Check if the user is an admin
    try {
    if (!req.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
        }
    const categories = await primsa.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;