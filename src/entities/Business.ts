import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { Column, CreateDateColumn, Entity, OneToMany } from "typeorm";
import Account from "./Account";
import tuple from "./utils/string-enum-from-tuple";
import Qualification from "./Qualification";
import { Geolocation } from "../misc-types/geolocation";
import Offer from "./Offer";

const BUSINESS_TYPES = tuple("individual", "company");
const PRICING_PLANS = tuple("free");

@Entity()
export default class Business extends Account {
  /**
   * Public name for the business.
   */
  @Column()
  @IsString()
  name!: string;

  @Column({ type: "enum", enum: BUSINESS_TYPES })
  @IsIn(BUSINESS_TYPES)
  type!: typeof BUSINESS_TYPES[number];

  @Column()
  isApproved!: boolean;

  /**
   * The date the business created their account (not when it was approved)
   */
  @CreateDateColumn()
  since!: Date;

  @Column({ nullable: true })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  fein?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @Column()
  @IsString()
  @MaxLength(200)
  bio!: string;

  @OneToMany(
    (type) => Qualification,
    (qualification) => qualification.business,
    { cascade: true }
  )
  qualifications!: Qualification[];

  @Column("simple-json")
  @IsArray()
  @IsIn(["x", "y"], { each: true })
  businessCategories!: string[];

  /**
   * Places this business is available at
   */
  @Column("simple-json")
  @Type(() => Geolocation)
  @IsArray()
  @ValidateNested()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  geolocations!: Geolocation[];

  @Column({ type: "enum", enum: PRICING_PLANS })
  @IsIn(PRICING_PLANS)
  pricingPlan!: "free";

  @OneToMany((type) => Offer, (offer) => offer.offerer)
  offers!: Offer[];
}

export type BusinessDTO = Omit<
  Business,
  "id" | "isApproved" | "since" | "qualifications" | "offers"
>;
