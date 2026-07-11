import express from "express";
import { ItemModel } from "../models/itemModel.js";

const router = express.Router();

// GET /api/items - Get all items
router.get("/", async (req, res, next) => {
  try {
    const { category, status } = req.query;
    const items = await ItemModel.findAll({ category, status });

    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/items/low-stock - Get low stock items
router.get("/low-stock", async (req, res, next) => {
  try {
    const items = await ItemModel.getLowStock();

    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/items/search?q=laptop - Search items
router.get("/search", async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }
    const items = await ItemModel.search(q.trim());
    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/items/qr/:code - Get item by QR code
router.get("/qr/:code", async (req, res, next) => {
  try {
    const item = await ItemModel.findByQRCode(req.params.code);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }
    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/items/:id - Get single item
router.get("/:id", async (req, res, next) => {
  try {
    const item = await ItemModel.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/items - Create new item
router.post("/", async (req, res, next) => {
  try {
    const {
      name,
      description,
      quantity,
      qrCode,
      category,
      location,
      minQuantity,
    } = req.body;
    console.log(minQuantity);
    
    if (!name || !qrCode) {
      return res.status(400).json({
        success: false,
        message: "Name and QR code are required",
      });
    }

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid quantity is required",
      });
    }
    // Check if QR code already exists
    const existing = await ItemModel.findByQRCode(qrCode);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "QR code already exists",
      });
    }

    const newItem = await ItemModel.create({
      name,
      description,
      quantity: parseInt(quantity),
      qrCode,
      category,
      location,
      minQuantity: minQuantity ? parseInt(minQuantity) : 0,
    });
    res.status(201).json({
      success: true,
      message: "Item created successfully",
      data: newItem,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/items/:id - Update item
router.put("/:id", async (req, res, next) => {
  try {
    const {
      name,
      description,
      quantity,
      category,
      location,
      minQuantity,
      status,
    } = req.body;
    const updatedItem = await ItemModel.update(req.params.id, {
      name,
      description,
      quantity: quantity !== undefined ? parseInt(quantity) : undefined,
      category,
      location,
      minQuantity:
        minQuantity !== undefined ? parseInt(minQuantity) : undefined,
      status,
    });
    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }
    res.json({
      success: true,
      message: "Item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/items/:id/quantity - Update quantity (check-in/out)
router.patch("/:id/quantity", async (req, res, next) => {
  try {
    const { change } = req.body;

    if (!change || isNaN(change)) {
      return res.status(400).json({
        success: false,
        message: "Valid quantity change is required",
      });
    }
    const updatedItem = await ItemModel.updateQuantity(
      req.params.id,
      parseInt(change)
    );

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }
    res.json({
      success: true,
      message: `Quantity ${change > 0 ? "increased" : "decreased"} successfully`,
      data: updatedItem,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/items/:id - Delete item
router.delete("/:id", async (req, res, next) => {
  try {
    const deletedItem = await ItemModel.delete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }
    res.json({
      success: true,
      message: "Item deleted successfully",
      data: deletedItem,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
