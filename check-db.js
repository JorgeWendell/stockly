const { drizzle } = require("drizzle-orm/postgres-js");
const postgres = require("postgres");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString);
const db = drizzle(sql);

async function checkDatabase() {
  try {
    console.log("=== VERIFICANDO BANCO DE DADOS ===");

    // Verificar estrutura da tabela users
    console.log("\n1. Estrutura da tabela users:");
    const tableInfo = await sql`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `;
    console.table(tableInfo);

    // Verificar dados dos usuários
    console.log("\n2. Dados dos usuários:");
    const users = await sql`SELECT * FROM users;`;
    console.table(users);

    // Verificar se o campo access_level existe
    console.log("\n3. Verificando campo access_level:");
    const hasAccessLevel = tableInfo.some(
      (col) => col.column_name === "access_level",
    );
    console.log("Campo access_level existe?", hasAccessLevel);

    if (hasAccessLevel) {
      console.log("\n4. Valores do campo access_level:");
      const accessLevels = await sql`SELECT id, name, access_level FROM users;`;
      console.table(accessLevels);
    }
  } catch (error) {
    console.error("Erro:", error);
  } finally {
    await sql.end();
  }
}

checkDatabase();
