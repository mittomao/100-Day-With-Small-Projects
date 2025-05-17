const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const dataPath = path.join(__dirname, "../data/todos.json");

// Helper
function readTodos() {
  const data = fs.readFileSync(dataPath, "utf8");
  return JSON.parse(data);
}

function writeTodos(todos) {
  fs.writeFileSync(dataPath, JSON.stringify(todos, null, 2));
}

// Get all todos
/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Get all todos
 *     tags:
 *       - Todo
 *     responses:
 *       200:
 *         description: List of todos
 */
router.get("/", (req, res) => {
  const todos = readTodos();
  res.json(todos);
});

// Add a new todo
/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Add a new todo
 *     tags:
 *       - Todo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/", (req, res) => {
  const todos = readTodos();
  const newTodo = {
    id: Date.now(),
    title: req.body.title,
    completed: false
  };
  todos.push(newTodo);
  writeTodos(todos);
  res.status(201).json(newTodo);
});

// Toggle completed
/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Toggle todo completed
 *     tags:
 *       - Todo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Updated
 */
router.put("/:id", (req, res) => {
  const todos = readTodos();
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).send("Not found");

  todo.completed = !todo.completed;
  writeTodos(todos);
  res.json(todo);
});

// Delete
/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     tags:
 *       - Todo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Deleted
 */
router.delete("/:id", (req, res) => {
  let todos = readTodos();
  const id = parseInt(req.params.id);
  todos = todos.filter(t => t.id !== id);
  writeTodos(todos);
  res.status(204).send();
});

module.exports = router;
