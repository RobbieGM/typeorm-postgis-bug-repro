import { Type } from "class-transformer";
import { IsString, ValidateNested } from "class-validator";
import { Column, Entity } from "typeorm";
import { Geolocation } from "../misc-types/geolocation";
import Account from "./Account";

@Entity()
export default class Customer extends Account {
  @Column()
  @IsString()
  firstName!: string;

  @Column()
  @IsString()
  lastName!: string;

  @Type(() => Geolocation)
  @Column("simple-json")
  @ValidateNested()
  geolocation!: Geolocation;
}
