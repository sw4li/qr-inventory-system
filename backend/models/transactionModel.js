import { pool } from "../config/db.js";

export class TransactionModel {
  // Create new transaction (check-in or check-out)
  static async create(transactionData) {
    try {
      const { itemId, userId, transactionType, quantity, notes } =
        transactionData;
      // Validate
      if (!itemId || !transactionType || !quantity) {
        throw new Error("itemId, transactionType, and quantity are required");
      }
      if (!["in", "out"].includes(transactionType)) {
        throw new Error('transactionType must be "in" or "out"');
      }
      // Create transaction
      const result = await pool.query(
        `INSERT INTO transactions (item_id, user_id, transaction_type, quantity, notes)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [itemId, userId || null, transactionType, quantity, notes || null]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error in TransactionModel.create:", error.message);
      throw error;
    }
  }

  // Get all transactions
  static async findAll(filters = {}) {
    try {
      let query = "SELECT * FROM transactions WHERE 1=1";
      const params = [];
      if (filters.itemId) {
        query += ` AND item_id = $${params.length + 1}`;
        params.push(filters.itemId);
      }
      if (filters.transactionType) {
        query += ` AND transaction_type = $${params.length + 1}`;
        params.push(filters.transactionType);
      }
      query += " ORDER BY created_at DESC";
      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error("Error in TransactionModel.findAll:", error.message);
      throw error;
    }
  }

  // Get transactions for a specific item
  static async findByItemId(itemId) {
    try {
      const result = await pool.query(
        `SELECT * FROM transactions WHERE item_id = $1 ORDER BY created_at DESC`,
        [itemId]
      );
      return result.rows;
    } catch (error) {
      console.error("Error in TransactionModel.findByItemId:", error.message);
      throw error;
    }
  }

  // Get recent transactions (last 24 hours, last 7 days, etc.)
  static async findRecent(hoursBack = 24) {
    try {
      const result = await pool.query(
        `SELECT * FROM transactions WHERE create_at >= now() - INTERVAL '${hoursBack} hours' ORDER BY created_at DESC`,
        []
      );
      return result.rows;
    } catch (error) {
      console.error("Error in TransactionModel.findRecent:", error.message);
      throw error;
    }
  }

  // Get transaction summary (total in/out for item)
  static async getSummary(itemId) {
    try {
       const result = await pool.query(
        `SELECT item_id,transaction_type,SUM(quantity) as total_quantity,COUNT(*) as transaction_count FROM transactions WHERE item_id = $1 GROUP BY item_id, transaction_type`,[itemId]
       );
       return result.rows;
    } catch (error) {
      console.error("Error in TransactionModel.getSummary:", error.message);
      throw error;
    }
  }
}
