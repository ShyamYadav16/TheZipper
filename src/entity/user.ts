import {Column, Entity, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import {UploadedFiles} from "./uploadedfiles";

@Entity('user')
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { "length": 20})
  userName: string;

  @Column("timestamp", { precision: 3, default: () => "CURRENT_TIMESTAMP(3)", onUpdate: "CURRENT_TIMESTAMP(3)"})
  created: Date;

  @OneToMany(type => UploadedFiles, uploadedfiles => uploadedfiles.user_id)
  uploadedfiles: UploadedFiles[];

}