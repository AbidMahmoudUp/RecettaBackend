import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { Plat } from "src/plat/entities/plat.entity";
import { User } from "src/auth/schemas/user.schema";

export type ratingDoc = HydratedDocument<Rating>

@Schema({versionKey: false})
export class Rating {


    @Prop({type: mongoose.Schema.Types.ObjectId, ref: "User"})
    user : User

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: "Plat"})
    plat : Plat
    
    @Prop()
    rate : number

    @Prop()
    comment: string

}

export const ratingSchema = SchemaFactory.createForClass(Rating)