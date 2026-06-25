import { pool } from "../config/db.js";
import { ItemModel } from "../models/itemModel.js";
import { TransactionModel } from "../models/transactionModel.js";
import { hashPassword } from "../utils/password.js";

async function seedDatabase() {
  const client = await pool.connect();

  try {
    console.log("Adding sample users...\n");
    const users = [
      {
        username: "admin",
        email: "admin@example.com",
        password_hash: await hashPassword("admin123"),
        role: "admin",
      },
      {
        username: "user1",
        email: "user1@example.com",
        password_hash: await hashPassword("user123"),
        role: "user",
      },
      {
        username: "user2",
        email: "user2@example.com",
        password_hash: await hashPassword("user123"),
        role: "user",
      },
    ];

    for(const user of users){
      const result = await client.query(
        `INSERT INTO users (username,email,password_hash,role)
        VALUES ($1,$2,$3,$4)
        RETURNING id,username,email,role`,
        [user.username,user.email,user.password_hash,user.role]
      );
      console.log(`Created user: ${result.rows[0].username} (${result.rows[0].role})`);
    }

    console.log("Seeding database with sample data...");
    // sample
    const items = [
      {
        name: "Laptop - Dell XPS 15",
        description: "High-performance laptop for development work",
        quantity: 5,
        qr_code: "QR001",
        category: "Electronics",
        location: "Storage Room A - Shelf 1",
        min_quantity: 2,
      },
      {
        name: "Wireless Mouse - Logitech MX Master 3",
        description: "Ergonomic wireless mouse",
        quantity: 20,
        qr_code: "QR002",
        category: "Accessories",
        location: "Storage Room B - Drawer 2",
        min_quantity: 10,
      },
      {
        name: "USB-C Cable - 2m",
        description: "Braided USB-C charging cable",
        quantity: 50,
        qr_code: "QR003",
        category: "Accessories",
        location: "Storage Room B - Bin 3",
        min_quantity: 20,
      },
      {
        name: 'Monitor - 27" 4K',
        description: "Dell UltraSharp U2720Q",
        quantity: 8,
        qr_code: "QR004",
        category: "Electronics",
        location: "Storage Room A - Shelf 2",
        min_quantity: 3,
      },
      {
        name: "Mechanical Keyboard - Keychron K2",
        description: "Wireless mechanical keyboard",
        quantity: 1,
        qr_code: "QR005",
        category: "Accessories",
        location: "Storage Room A - Shelf 1",
        min_quantity: 5,
      },
      {
        name: "Webcam - Logitech C920",
        description: "HD webcam for video calls",
        quantity: 12,
        qr_code: "QR006",
        category: "Electronics",
        location: "Storage Room B - Shelf 1",
        min_quantity: 5,
      },
      {
        name: "Headphones - Sony WH-1000XM4",
        description: "Noise-canceling wireless headphones",
        quantity: 0,
        qr_code: "QR007",
        category: "Electronics",
        location: "Storage Room A - Shelf 3",
        min_quantity: 3,
      },
    ];

    for (const item of items) {
      const result = await client.query(
        `INSERT INTO items (name,description, quantity, qr_code, category, location, min_quantity)
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            RETURNING id,name`,
        [
          item.name,
          item.description,
          item.quantity,
          item.qr_code,
          item.category,
          item.location,
          item.min_quantity,
        ]
      );
      console.log(`Created: ${result.rows[0].name} (ID: ${result.rows[0].id})`);
    }

    console.log("\n📊 Adding sample transactions...\n");
    // Sample transactions (check-in/check-out history)
    const transactions = [
      {
        item_id: 1,
        user_id: null,
        transaction_type: "in",
        quantity: 3,
        notes: "Received from vendor",
      },
      {
        item_id: 1,
        user_id: null,
        transaction_type: "out",
        quantity: 1,
        notes: "Checked out to developer",
      },
      {
        item_id: 2,
        user_id: null,
        transaction_type: "in",
        quantity: 10,
        notes: "Bulk purchase",
      },
      {
        item_id: 2,
        user_id: null,
        transaction_type: "out",
        quantity: 2,
        notes: "Distributed to team",
      },
      {
        item_id: 3,
        user_id: null,
        transaction_type: "in",
        quantity: 50,
        notes: "Initial stock",
      },
      {
        item_id: 4,
        user_id: null,
        transaction_type: "in",
        quantity: 5,
        notes: "Office setup",
      },
      {
        item_id: 5,
        user_id: null,
        transaction_type: "out",
        quantity: 1,
        notes: "In use",
      },
      {
        item_id: 6,
        user_id: null,
        transaction_type: "in",
        quantity: 8,
        notes: "Received",
      },
      {
        item_id: 6,
        user_id: null,
        transaction_type: "out",
        quantity: 2,
        notes: "Team checkout",
      },
    ];
    for (const tx of transactions) {
      await client.query(
        `INSERT INTO transactions (item_id,user_id,transaction_type,quantity,notes) VALUES ($1,$2,$3,$4,$5)`,
        [tx.item_id, tx.user_id, tx.transaction_type, tx.quantity, tx.notes]
      );

      console.log(
        `Transaction: Item ${tx.item_id} - ${tx.transaction_type === "in" ? "✓ Check-in" : "✗ Check-out"} ${tx.quantity} units`
      );
    }

    console.log("\nDatabase seeded successfully");
    console.log(`${items.length} items added`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
