import { pool } from "../config/db.js";
import { hashPassword, comparePassword } from "../utils/password.js";

export class UserModel {
  // create new user
  static async create(userData) {
    try {
      const { username, email, password, role = "user" } = userData;
      const passwordHash = await hashPassword(password);
      const result = await pool.query(
        `INSERT INTO users (username,email,password_hash,role)
    VALUES ($1,$2,$3,$4)
    RETURNING id,username,email,role,created_at`,
        [username, email, passwordHash, role]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error in UserModel.create:", error.message);
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
        email,
      ]);
      return result.rows[0];
    } catch (error) {
      console.error("Error in UserModel.findByEmail:", error.message);
      throw error;
    }
  }

   // Find user by username
  static async findByUsername(username) {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in UserModel.findByUsername:', error.message);
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const result = await pool.query(
        'SELECT id, username, email, role, created_at FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in UserModel.findById:', error.message);
      throw error;
    }
  }
  
    // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await comparePassword(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error in UserModel.verifyPassword:', error.message);
      throw error;
    }
  }

    // Get all users (for admin)
  static async findAll() {
    try {
      const result = await pool.query(
        'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC'
      );
      return result.rows;
    } catch (error) {
      console.error('Error in UserModel.findAll:', error.message);
      throw error;
    }
  }
  // Update user role
  static async updateRole(id, role) {
    try {
      const result = await pool.query(
        'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, email, role',
        [role, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in UserModel.updateRole:', error.message);
      throw error;
    }
  }

    // Delete user
  static async delete(id) {
    try {
      const result = await pool.query(
        'DELETE FROM users WHERE id = $1 RETURNING id, username',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in UserModel.delete:', error.message);
      throw error;
    }
  }

}
