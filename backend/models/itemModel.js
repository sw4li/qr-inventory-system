import { pool } from "../config/db.js";

export class ItemModel {

  static async findAll(filters = {}) {
    try {
      let query = 'SELECT * FROM items WHERE status = $1';
      const params = [filters.status || 'active'];
      
      // Add category filter if provided
      if (filters.category) {
        query += ' AND category = $' + (params.length + 1);
        params.push(filters.category);
      }
      
      query += ' ORDER BY created_at DESC';
      
      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error in findAll:', error.message);
      throw error;
    }
  }

  static async findById(id) {
    const result = await pool.query("SELECT * FROM items WHERE id = $1", [id]);
    return result.rows[0];
  }

  // Get item by QR code
  static async findByQRCode(qrCode) {
    const result = await pool.query("SELECT * FROM items WHERE qr_code = $1", [qrCode]);
    return result.rows[0];
  }

  // Create new item
  static async create(itemData) {
    const {
      name,
      description,
      quantity,
      qrCode,
      category,
      location,
      minQuantity,
    } = itemData;

    const result = await pool.query(
      `INSERT INTO items(name, description, quantity, qr_code, category, location, min_quantity)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
      [
        name,
        description || null,
        quantity,
        qrCode,
        category || null,
        location || null,
        minQuantity || 0,
      ]
    );

    return result.rows[0];
  }

  // Update item
  static async update(id, itemData) {
    const {
      name,
      description,
      quantity,
      category,
      location,
      minQuantity,
      status,
    } = itemData;
    const result = await pool.query(
      `UPDATE items
         SET name = COALESCE($1, name),
             description = COALESCE($2, description),
             quantity = COALESCE($3, quantity),
             category = COALESCE($4, category),
             location = COALESCE($5, location),
             min_quantity = COALESCE($6, min_quantity),
             status = COALESCE($7, status),
             updated_at = CURRENT_TIMESTAMP
        WHERE id = $8
        RETURNING *`,
      [name, description, quantity, category, location, minQuantity, status, id]
    );

    return result.rows[0];
  }

  // Update quantity (for check-in/check-out)
  static async updateQuantity(id, quantityChange) {
    const result = await pool.query(
      `UPDATE items
        SET quantity = quantity + $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
       RETURNING *`,
      [quantityChange, id]
    );
    return result.rows[0];
  }

  // Delete item
  static async delete(id) {
    const result = await pool.query(
      "DELETE FROM items WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }

  // Get low stock items
  static async getLowStock() {
    const result = await pool.query(
      `SELECT * FROM items 
       WHERE quantity <= min_quantity 
       AND status = 'active'
       ORDER BY quantity ASC`
    );
    return result.rows;
  }

  // Search items
  static async search(searchTerm) {
    const result = await pool.query(
      `SELECT * FROM items 
       WHERE (name ILIKE $1 OR description ILIKE $1) 
       AND status = 'active'
       ORDER BY name`,
      [`%${searchTerm}%`]
    );
    return result.rows;
  }
}
