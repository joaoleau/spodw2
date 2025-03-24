const todos = [];

document.getElementById("filtros").addEventListener("change", function(e) {
    renderTodos();
})

document.getElementById("new-todo").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        const newTodoInput = document.getElementById("new-todo");
        const todoText = newTodoInput.value.trim();
        if (todoText === "") return;

        addTodo(todoText);
        newTodoInput.value = "";
        
        renderTodos();
    }
});

function renderTodos() {
    const todoListUl = document.getElementById("todo-list");
    const filtro = document.getElementById("filtros").value

    todoListUl.innerHTML = "";

    for (const todo of todos) {
        const todoItemLi = document.createElement("li");
        todoItemLi.textContent = todo.text;

        if (filtro === "ativos" && todo.done) {
            continue;
        }

        if (filtro === "realizados" && !todo.done) {
            continue;
        }

        if (!todo.done) {
            const markTodoAsDoneButton = document.createElement("button");
            markTodoAsDoneButton.textContent = "Concluir";
            markTodoAsDoneButton.onclick = function () {
                todo.done = true;
                renderTodos();
            };
            todoItemLi.appendChild(markTodoAsDoneButton);
        } else {
            todoItemLi.style.textDecoration = "line-through";
        }

        todoListUl.appendChild(todoItemLi);
    }
}

function addTodo(todoText) {
    const lastId = todos.length > 0 ? todos[todos.length - 1].id : 0;

    const newTodo = {
        id: lastId + 1,
        text: todoText,
        done: false,
    };

    todos.push(newTodo);
}

function markTodoAsDone(todoId) {
    const todo = todos.find((todo) => todo.id === todoId);
    todo.done = true;
}

renderTodos();
