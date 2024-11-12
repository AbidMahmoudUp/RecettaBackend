import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type ingrediantDoc = HydratedDocument<Ingrediant>

@Schema({versionKey: false})
export class Ingrediant {

    @Prop({unique : true})
    name : string
    @Prop()
    categorie : string 
    @Prop()
    image : string

}


export const ingrediantSchema = SchemaFactory.createForClass(Ingrediant)