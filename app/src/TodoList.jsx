import { useState, useEffect } from "react";

const filterType = {
  ALL: "ALL",
  DONE: "DONE",
  PENDING: "PENDING",
};

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

const TodoFilter = ({ handleFilter }) => {
  return (
    <div className="center-content">
      <a href="#" onClick={() => handleFilter(filterType.ALL)}>
        Todos os itens
      </a>
      <a href="#" onClick={() => handleFilter(filterType.DONE)}>
        Concluídos
      </a>
      <a href="#" onClick={() => handleFilter(filterType.PENDING)}>
        Pendentes
      </a>
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
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState(filterType.ALL);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch("http://localhost:3000/todos");
        if (!response.ok) throw new Error("Erro ao buscar os dados");
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async (text) => {
    const newTodo = { id: crypto.randomUUID(), text, done: false };
    try {
      const response = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });
      if (!response.ok) throw new Error("Erro ao inserir nova tarefa");
      const data = await response.json();
      setTodos((prev) => [...prev, data]);
    } catch (error) {
      console.error(error.message);
    }
  };

  const markTodoAsDone = async (id) => {
    const todo = todos.find((t) => t.id === id);
    const updated = { ...todo, done: true };
    try {
      const response = await fetch(`http://localhost:3000/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!response.ok) throw new Error("Erro ao atualizar tarefa");
      const data = await response.json();
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? data : t))
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleFilter = (newFilter) => setFilter(newFilter);

  const filteredTodos = todos.filter((todo) => {
    if (filter === filterType.ALL) return true;
    if (filter === filterType.DONE) return todo.done;
    if (filter === filterType.PENDING) return !todo.done;
    return true;
  });

  return (
    <>
      <h1>Todo List</h1>
      <div className="center-content">
        Versão inicial da aplicação de lista de tarefas para a disciplina SPODWE2
      </div>
      <TodoFilter handleFilter={handleFilter} />
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
