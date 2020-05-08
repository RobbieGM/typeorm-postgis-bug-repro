import { Point } from "geojson";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Business {
  @PrimaryGeneratedColumn()
  id!: number;
  /**
   * Places this business is available at
   */
  @Column("geometry", { srid: 4326, spatialFeatureType: "Point", array: true })
  geolocations!: Point[];
}
