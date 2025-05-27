import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import {
  getAllTodos,
  getTodo,
  insertTodo,
  updateTodo,
  getUserByEmail,
} from "./db.mjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

app.disable("x-powered-by");

app.use(cors());
app.use(express.json());

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token not provided" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const user = getUserByEmail.get({ $email: email });

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });

  return res.status(200).json({ token });
});


app.get("/todos", authenticateToken, (_req, res) => {
  const allTodos = getAllTodos.all();

  return res.status(200).json(
    allTodos.map((todo) => ({
      id: todo.id,
      text: todo.text,
      done: Boolean(todo.done),
    }))
  );
});

app.post("/todos", authenticateToken, (req, res) => {
  const text = req.body.text?.trim();

  if (!text || text.length === 0) {
    return res.status(400).json({ error: "Text is required" });
  }

  const newId = crypto.randomUUID();

  const newTodo = insertTodo.get({ $id: newId, $text: text });

  return res.status(200).json({
    id: newTodo.id,
    text: newTodo.text,
    done: Boolean(newTodo.done),
  });
});

app.put("/todos/:id", authenticateToken, (req, res) => {
  const id = req.params.id;
  const todo = getTodo.get({ $id: id });

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  const isTextUpdated = req.body.text !== undefined && req.body.text !== null;
  const isDoneUpdated = req.body.done !== undefined && req.body.done !== null;

  if (!isTextUpdated && !isDoneUpdated) {
    return res.status(400).json({ error: "Text or done is required" });
  }

  const newText = isTextUpdated ? req.body.text.trim() : todo.text;
  const newDone = isDoneUpdated ? Number(req.body.done) : todo.done;

  if (isTextUpdated && newText.length === 0) {
    return res.status(400).json({ error: "Text should not be empty" });
  }

  const updatedTodo = updateTodo.get({
    $id: id,
    $text: newText,
    $done: newDone,
  });

  return res.status(200).json({
    id: updatedTodo.id,
    text: updatedTodo.text,
    done: Boolean(updatedTodo.done),
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
