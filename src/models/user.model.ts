import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

// Define an interface for your user document with the custom method `comparePassword`
export interface IUser extends Document {
  email: string;
  password: string;
  refreshToken: string;
  comparePassword(password: string): Promise<boolean>;
}

// User schema
const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: { type: String },
});

// Add the comparePassword method to the schema
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// Hash the password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;
