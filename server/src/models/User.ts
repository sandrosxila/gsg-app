import {Schema, model} from 'mongoose';

export interface User {
    fullName: string;
    username: string;
    password: string;
}

const UserSchema = new Schema<User>({
    fullName: String,
    username: String,
    password: String,
});

export default model('User', UserSchema);