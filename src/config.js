import { config } from "dotenv";
config();

export const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://jolumartinezro:57FdWQteNdhdgrpJ@imagebook.1dfzggp.mongodb.net/?retryWrites=true&w=majority&appName=imageBook";
export const PORT = process.env.PORT || 3000;
