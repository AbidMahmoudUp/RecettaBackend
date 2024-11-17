import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { Ingredient } from "src/ingrediant/entities/ingredient.entity";
import { User } from "src/auth/schemas/user.schema";


export type inventoryDoc = HydratedDocument<Inventory> 

@Schema({versionKey: false})
export class Inventory {

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true})
    user : User

    @Prop([{ingredient: {type: mongoose.Schema.Types.ObjectId, ref : "Ingredient"}, qte: {type: Number, required : true},date: {type : String, default:new Date().toLocaleString() } ,_id: false}])
    public ingredients: [{ingredient: Ingredient, qte : number , date: string }]


}


export const inventorySchema = SchemaFactory.createForClass(Inventory)