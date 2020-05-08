import dotenv from "dotenv";
import "reflect-metadata";
import { createConnection, DeepPartial } from "typeorm";
import Business from "./entities/Business";
import Customer from "./entities/Customer";
import Offer from "./entities/Offer";
import Qualification from "./entities/Qualification";

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
    entities: [Business, Customer, Offer, Qualification],
  });
  console.debug("Created connection");

  const business: Omit<Business, "id" | "since"> = {
    name: "test",
    email: "me@me.com",
    type: "company",
    fein: "297385353",
    bio: "blksdjgslg",
    isApproved: false,
    geolocations: [
      {
        lat: 3,
        lng: 6,
      },
    ],
    businessCategories: [],
    pricingPlan: "free",
    offers: [],
    passwordHash: "asdj9f8239fj2",
    qualifications: [],
  };
  const offer: Omit<Offer, "id" | "lastModified" | "offerer"> & {
    offerer: DeepPartial<Offer>["offerer"];
  } = {
    name: "test",
    description: "test",
    price: 8,
    category: "a",
    geolocation: {
      type: "Point",
      coordinates: [45, 45],
    },
    offerer: business,
  };
  await manager.save(Business, business);
  await manager.save(Offer, offer);
  console.debug("Saved object to database");
}

main();
