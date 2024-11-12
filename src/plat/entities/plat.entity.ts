import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { Ingrediant } from "src/ingrediant/entities/ingrediant.entity";

export type platDoc = HydratedDocument<Plat>

@Schema({versionKey : false})
export class Plat {

     id : string
     title: string
     description: string
     imageRes: number
     category :string
     cookingTime: string
     energy: string
     rating : string
    @Prop([{ingrediant : {type: mongoose.Schema.Types.ObjectId, ref : "Ingrediant"}, qte: {type: Number, required : true}, _id: false}])
    ingrediants: [{ingrediant: Ingrediant, qte : number}]
}

export const platSchema = SchemaFactory.createForClass(Plat)