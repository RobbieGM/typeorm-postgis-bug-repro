import { IsIn, IsNumber, IsOptional, IsString, IsUrl } from "class-validator";
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import Business from "./Business";
import { Point } from "geojson";

@Entity()
export default class Offer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsString()
  name!: string;

  @Column()
  @IsString()
  description!: string;

  @Column()
  @IsNumber()
  price!: number;

  @Column()
  @IsIn(["a", "b"])
  category!: string;

  @Column({ nullable: true })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @Column("geometry", { srid: 4326, spatialFeatureType: "Point" })
  geolocation!: Point;

  @ManyToOne((type) => Business, { onDelete: "CASCADE" })
  offerer!: Business;

  @UpdateDateColumn()
  lastModified!: Date;
}

export type OfferDTO = Omit<Offer, "id" | "offerer" | "lastModified">;
