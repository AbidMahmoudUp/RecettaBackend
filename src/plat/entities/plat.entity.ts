import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { Ingrediant } from "src/ingrediant/entities/ingrediant.entity";

export type platDoc = HydratedDocument<Plat>

@Schema({versionKey : false})
export class Plat {

    @Prop({unique: true})
    name: string

    @Prop([{ingrediant : {type: mongoose.Schema.Types.ObjectId, ref : "Ingrediant"}, qte: {type: Number, required : true}, _id: false}])
    ingrediants: [{ingrediant: Ingrediant, qte : number}]
}

export const platSchema = SchemaFactory.createForClass(Plat)