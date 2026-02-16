// // db.js
// const { Pool } = require("pg");

// // Use environment variables for security and flexibility
// const pool = new Pool({
//   user: process.env.PGUSER || "postgres",
//   host: process.env.PGHOST || "localhost",
//   database: process.env.PGDATABASE || "asa",
//   password: process.env.PGPASSWORD || "Admin",
//   port: process.env.PGPORT || 5432,
// });

// module.exports = {
//   query: (text, params) => pool.query(text, params),
//   pool, // Exporting the pool instance can be useful too
// };

// db.js  (replace existing)
// const { PrismaClient } = require("../generated/prisma");

require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
console.log("Adapter:", adapter);
const prisma = new PrismaClient({
  adapter,
  log: ["warn", "error", "query"],
});

// Graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
