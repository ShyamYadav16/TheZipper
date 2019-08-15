import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";

@Entity("uploadedfiles")
export class UploadedFiles {

  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  user_id: number;

  @Column("varchar", { "length": 100})
  fileName: string;

  @Column("boolean", { default: false })
  deleted?: boolean;

  @Column("timestamp", { precision: 3, default: () => "CURRENT_TIMESTAMP(3)", onUpdate: "CURRENT_TIMESTAMP(3)"})
  created?: Date;

  @OneToOne(type => User, user => user.uploadedfiles)
  user?: User;

  constructor(fileName: string, user_id: number) {
    this.fileName = fileName;
    this.user_id = user_id;
  }

}