import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { Ingredient } from "src/ingrediant/entities/ingredient.entity";

export type platDoc = HydratedDocument<Plat>

@Schema({versionKey : false})
export class Plat {

     @Prop()
     title: string
     @Prop()
     description: string
     @Prop()
     image: string
     @Prop()
     
     category :string
     @Prop()
     cookingTime: string
     @Prop()
     energy: string
     @Prop()
     rating : string
@Prop([
        {
          ingredient: { type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" },
          qte: { type: Number, required: true },
          _id: false,
        },
      ])
      ingredients: { ingredient: Ingredient; qte: number }[];
      @Prop()
      instructions :string[]
    

      constructor() {
        this.title = "";
        this.description = "";
        this.image = "";
        this.category = "";
        this.cookingTime = "";
        this.energy = "";
        this.rating = "";
        this.ingredients = [];
        this.instructions = [];
      }
}

export const platSchema = SchemaFactory.createForClass(Plat)