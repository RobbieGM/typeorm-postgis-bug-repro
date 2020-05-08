import {
  IsArray,
  IsIn,
  IsOptional,
  IsUrl,
  ValidateNested,
} from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import tuple from "./utils/string-enum-from-tuple";
import Business from "./Business";

const VALIDITY_STATES = tuple("valid", "pending-review", "invalid");

@Entity()
export default class Qualification {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ManyToOne((type) => Business, (business) => business.qualifications, {
    onDelete: "CASCADE",
  })
  business!: Business;

  @Column({ type: "enum", enum: VALIDITY_STATES, default: "invalid" })
  validity!: typeof VALIDITY_STATES[number];

  /**
   * The categories (slugs)
   */
  @Column("simple-json")
  @ValidateNested()
  @IsArray()
  @IsIn(["a", "b"], { each: true })
  categories!: string[];
}

export type QualificationDTO = Omit<
  Qualification,
  "id" | "validity" | "business"
>;
