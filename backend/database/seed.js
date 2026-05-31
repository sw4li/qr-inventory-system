import { pool } from "../config/db.js";

async function seedDatabase() {
  const client = await pool.connect();

  try {
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
