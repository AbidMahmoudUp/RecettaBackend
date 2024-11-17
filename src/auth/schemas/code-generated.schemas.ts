import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
@Schema({ versionKey: false, timestamps: true })
export class GeneratedCode extends Document {
    @Prop({ required: true })
    code: string;

    @Prop({ required: true, type: mongoose.Types.ObjectId })
    userId: mongoose.Types.ObjectId;

}
export const generatedCodeSchema = SchemaFactory.createForClass(GeneratedCode);