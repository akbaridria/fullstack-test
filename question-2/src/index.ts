import express from "express";
import todoRoutes from "./routes/todo-routes.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/todos", todoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
