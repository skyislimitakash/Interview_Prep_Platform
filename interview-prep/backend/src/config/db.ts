import { Sequelize } from "sequelize";
import { env } from "./env";

export const sequelize = new Sequelize(
  env.db.name,
  env.db.user,
  env.db.password,
  {
    host: env.db.host,
    port: env.db.port,
    dialect: "mysql",
    logging: env.isDev ? (sql) => console.log(`[DB] ${sql}`) : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      underscored: true,       // snake_case columns in DB
      timestamps: true,        // createdAt / updatedAt auto-managed
      freezeTableName: false,  // Sequelize auto-pluralises table names
    },
  }
);

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("[DB] MySQL connection established successfully.");

    // sync({ alter: true }) updates columns safely without dropping data.
    // Use sync({ force: true }) ONLY in fresh dev to drop & recreate tables.
    await sequelize.sync({ alter: true });
    console.log("[DB] All models synchronised with database.");
  } catch (error) {
    console.error("[DB] Unable to connect to MySQL:", error);
    process.exit(1);
  }
};
