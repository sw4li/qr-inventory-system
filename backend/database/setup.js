import { readFile } from "fs/promises";
import { pool } from "../config/db.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupDatabase() {
  const client = await pool.connect();

  try {
    console.log("Setting up database schema...");
    // Read schema file
    const schemaPath = join(__dirname, "schema.sql");
    const schemaContent = await readFile(schemaPath, "utf8");

    const statements = schemaContent
      .split("\n")
      .filter((line) => !line.trim().startsWith("--"))
      .join("\n")
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    console.log(`Found ${statements.length} SQL statements to execute\n`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      try {
        await client.query(statement);
        // creation log 
        if (statement.includes("CREATE TABLE")) {
          const match = statement.match(/CREATE TABLE (\w+)/i);
          if (match) console.log(`Created table: ${match[1]}`);
        } else if (statement.includes('DROP TABLE')) {
          const match = statement.match(/DROP TABLE IF EXISTS (\w+)/i);
          if (match) console.log(`Dropped table: ${match[1]}`);
        }else if (statement.includes("CREATE INDEX")) {
          const match = statement.match(/CREATE INDEX (\w+)/i);
          if (match) console.log(`Created index: ${match[1]}`);
        }
      } catch (err) {
        console.error(`\n Error executing statement ${i + 1}:`);
        console.error(statement.substring(0, 100) + "...");
        console.error("Error:", err.message);
        throw err;
      }
    }

    console.log("\n Database schema created successfully");
  } catch (error) {
    console.error("Database setup failed:", error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase()
  .then(() => {
    console.log("\n Setup complete!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n Setup failed:", err.message);
    process.exit(1);
  });
