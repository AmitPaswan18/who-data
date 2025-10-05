import { sqliteDb } from "./src/lib/sqlite.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function migrateTable(tableName, modelName) {
  console.log(`Starting migration for table: ${tableName}...`);
  try {
    const data = sqliteDb.prepare(`SELECT * FROM ${tableName}`).all();
    console.log(`Found ${data.length} rows in SQLite table "${tableName}".`);

    if (data.length === 0) return;

    // FIX: Transform data to match Prisma schema field names
    let processedData = data;
    // For tables where the column is 'country', we rename it to 'countryId'
    if (
      ["countryPopulation", "infectionData", "vaccination"].includes(modelName)
    ) {
      processedData = data.map((row) => {
        const { country, ...rest } = row;
        return { ...rest, countryId: country };
      });
    }

    // Use Prisma's efficient batch creation
    const result = await prisma[modelName].createMany({
      data: processedData,
      skipDuplicates: true,
    });

    console.log(
      `Successfully migrated ${result.count} rows to "${modelName}".`
    );
  } catch (error) {
    console.error(`Error migrating table ${tableName}:`, error);
  }
}

async function main() {
  console.log("Starting database migration with Prisma...");

  // The second argument is the camelCase model name from schema.prisma
  await migrateTable("Antigen", "antigen");
  await migrateTable("Country", "country");
  await migrateTable("CountryPopulation", "countryPopulation");
  await migrateTable("Economy", "economy");
  await migrateTable("Infection_Type", "infection_Type");
  await migrateTable("InfectionData", "infectionData");
  await migrateTable("Vaccination", "vaccination");

  console.log("Migration complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    sqliteDb.close();
  });
