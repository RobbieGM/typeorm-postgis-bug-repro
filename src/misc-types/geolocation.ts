import { IsNumber } from "class-validator";

export class Geolocation {
  @IsNumber()
  lat!: number;

  @IsNumber()
  lng!: number;
}
