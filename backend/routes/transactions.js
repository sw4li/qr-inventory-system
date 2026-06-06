import express from "express";
import { TransactionModel } from "../models/transactionModel.js";
import { ItemModel } from "../models/itemModel.js";

const router = express.Router();

// POST /api/transactions - Create transaction
router.post("/", async (req, res, next) => {
  try {
    const { itemId, userId, transactionType, quantity, notes } = req.body;
    if (!itemId || !transactionType || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "itemId, transactionType, and quantity are required",
      });
    }

    if (!["in", "out"].includes(transactionType)) {
      return res.status(400).json({
        success: false,
        message: 'transactionType must be "in" or "out"',
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }
    const item = await ItemModel.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (transactionType === "out" && item.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available ${item.quantity}, Requested: ${quantity}`,
      });
    }

    const transaction = await TransactionModel.create({
      itemId,
      userId,
      transactionType,
      quantity: parseInt(quantity),
      notes,
    });

    const quantityChange = transactionType === "in" ? quantity : -quantity;
    await ItemModel.updateQuantity(itemId, quantityChange);

    res.status(201).json({
      success: true,
      message: `Transaction ${transactionType === "in" ? "check-in" : "check-out"} completed`,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/transactions - Get all transactions
router.get("/", async (req, res, next) => {
  try {
    const { itemId, transactionType } = req.query;
    const transactions = await TransactionModel.findAll({
      itemId: itemId ? parseInt(itemId) : undefined,
      transactionType,
    });
    res.json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/transactions/recent - Get recent transactions
router.get("/recent", async (req, res, next) => {
  try {
    const { hours = 24 } = req.query;
    const transactions = await TransactionModel.findRecent(parseInt(hours));
    res.json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch {
    next(error);
  }
});

// GET /api/transactions/item/:itemId - Get transactions for specific item
router.get("/item/:itemId", async (req, res, next) => {
  try {
    const itemId = parseInt(req.params.itemId);
    // Verify item exists
    const item = await ItemModel.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }
    const transactions = await TransactionModel.findByItemId(itemId);
    const summary = await TransactionModel.getSummary(itemId);

    res.json({
      success: true,
      item: {
        id: item.id,
        name: item.name,
        currentQuantity: item.quantity,
      },
      summary: summary,
      transactions: transactions,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/transactions/:id/summary - Get summary for item

router.get("/:id/summary", async (req, res, next) => {
  try {
    const itemId = parseInt(req.params.id);
    const summary = await TransactionModel.getSummary(itemId);
    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
});

export default router;