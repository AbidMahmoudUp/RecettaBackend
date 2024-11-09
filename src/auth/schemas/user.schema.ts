import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

enum Roles {
    User = "User",
    Chef = "Chef",
    Admin = "Admin"
}

@Schema()
export class User extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: false })
    age: number;

    @Prop({ required: false })
    phone: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: false, default: Roles.User })
    role: Roles;
}
export const UserSchema = SchemaFactory.createForClass(User);