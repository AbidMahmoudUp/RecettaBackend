import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, ObjectId, Types } from "mongoose";


export type ingredientDoc = HydratedDocument<Ingredient>

@Schema({versionKey: false})
export class Ingredient {

    @Prop({_id : true, auto: true})
    _id : Types.ObjectId

    @Prop({unique : true})
    name : string
    @Prop()
    categorie : string 
    @Prop()
    unit : string
    @Prop()
    image : string

}


export const ingredientSchema = SchemaFactory.createForClass(Ingredient)