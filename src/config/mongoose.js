import mongoose from "mongoose";
mongoose.set('strictQuery', true); 
import { MONGODB_URI } from "../config.js";

(async () => {
  const db = await mongoose.connect(MONGODB_URI);
  console.log("db is connected: ", db.connection.name);
})();
