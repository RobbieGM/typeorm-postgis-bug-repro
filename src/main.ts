import dotenv from "dotenv";
import "reflect-metadata";
import { createConnection, DeepPartial } from "typeorm";
import Business from "./entities/Business";

dotenv.config();

async function main() {
  const { DATABASE_URL } = process.env;
  if (
    DATABASE_URL == null ||
    typeof DATABASE_URL !== "string" ||
    DATABASE_URL.trim() === ""
  ) {
    throw new Error(
      "Please include a DATABASE_URL environment variable pointing to a postgres database."
    );
  }

  const { manager } = await createConnection({
    type: "postgres",
    url: DATABASE_URL,
    synchronize: true,
    entities: [Business],
  });
  console.debug("Created connection with no problems.");

  // const business: Omit<Business, "id"> = {
  //   geolocations: [
  //     {
  //       type: "Point",
  //       coordinates: [30, 60],
  //     },
  //   ],
  // };

  // await manager.save(Business, business);
  // console.debug("Saved object to database");
}

main();
