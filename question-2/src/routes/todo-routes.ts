import { Router, type Request, type Response } from "express";
import { type Todo } from "../types.js";
import { v4 as uuidv4 } from "uuid";

const router: Router = Router();

// in memory store data
let todos: Todo[] = [];

router.post("/", (req: Request, res: Response) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const newTodo: Todo = {
    id: uuidv4(),
    title,
    description,
    completed: false,
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

router.get("/", (_req: Request, res: Response) => {
  res.json(todos);
});


router.patch("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, completed, description } = req.body;

  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  if (title !== undefined) todo.title = title;
  if (completed !== undefined) todo.completed = completed;
  // since description is optional the value can be empty
  todo.description = description;

  res.json(todo);
});

router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const index = todos.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Todo not found" });
  }

  todos.splice(index, 1);
  res.status(204).send();
});

export default router;
