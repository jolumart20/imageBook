import app from "./app.js";
import { PORT } from "./config.js";

// database
import "./config/mongoose.js";

// Starting the server
app.listen(3001);
console.log("Server on port", app.get("port"));
