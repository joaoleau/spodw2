import { useState } from "react";

const AddTodo = ({ addTodo }) => {
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      const input = event.target;
      const text = input.value.trim();
      if (text) {
        addTodo(text);
        input.value = "";
      }
    }
  };

  return (
    <input
      type="text"
      placeholder="Adicione aqui sua nova tarefa"
      onKeyDown={handleKeyPress}
    />
  );
};

const TodoFilter = ({ currentFilter, setFilter }) => {
  const filters = [
    { id: "all", label: "Todos os itens" },
    { id: "done", label: "Concluídos" },
    { id: "pending", label: "Pendentes" },
  ];

  return (
    <div className="center-content">
      {filters.map((filter) => (
        <a
          key={filter.id}
          href="#"
          onClick={() => setFilter(filter.id)}
          style={{
            margin: "0 8px",
            textDecoration: currentFilter === filter.id ? "underline" : "none",
          }}
        >
          {filter.label}
        </a>
      ))}
    </div>
  );
};

const TodoItem = ({ todo, markTodoAsDone }) => {
  const handleClick = () => {
    markTodoAsDone(todo.id);
  };

  return (
    <>
      {todo.done ? (
        <li style={{ textDecoration: "line-through" }}>{todo.text}</li>
      ) : (
        <li>
          {todo.text}
          <button onClick={handleClick}>Concluir</button>
        </li>
      )}
    </>
  );
};

const TodoList = () => {
  const [todos, setTodos] = useState([
    { id: crypto.randomUUID(), text: "Learn React", done: false },
    { id: crypto.randomUUID(), text: "Learn JS", done: true },
  ]);

  const [filter, setFilter] = useState("all");

  const addTodo = (text) => {
    const newTodo = { id: crypto.randomUUID(), text, done: false };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  const markTodoAsDone = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, done: true } : todo
      )
    );
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "done") return todo.done;
    if (filter === "pending") return !todo.done;
    return true;
  });

  return (
    <>
      <h1>Todo List</h1>
      <div className="center-content">
        Versão inicial da aplicação de lista de tarefas para a disciplina SPODWE2
      </div>
      <TodoFilter currentFilter={filter} setFilter={setFilter} />
      <AddTodo addTodo={addTodo} />
      <ul id="todo-list">
        {filteredTodos.map((todo, index) => (
          <TodoItem key={index} todo={todo} markTodoAsDone={markTodoAsDone} />
        ))}
      </ul>
    </>
  );
};

export { TodoList };
