import app from "./app.js";
import { PORT } from "./config.js";


// database
import "./config/mongoose.js";

// Starting the server
app.listen(PORT, () => {
  console.log(`Server on port http://localhost:${PORT}`);
});

