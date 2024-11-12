import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { Ingrediant } from "src/ingrediant/entities/ingrediant.entity";
import { User } from "src/auth/schemas/user.schema";


export type inventoryDoc = HydratedDocument<Inventory> 

@Schema({versionKey: false})
export class Inventory {

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true})
    user : User

    @Prop([{ingrediant: {type: mongoose.Schema.Types.ObjectId, ref : "Ingrediant"}, qte: {type: Number, required : true},date: {type : String, default:new Date().toLocaleString() } ,_id: false}])
    ingrediants: [{ingrediant: Ingrediant, qte : number , date: string }]


}


export const inventorySchema = SchemaFactory.createForClass(Inventory)