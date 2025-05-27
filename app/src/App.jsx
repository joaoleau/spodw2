import "./App.css";
import { TodoList } from "./TodoList";
import { Login } from "./Login";

import { useState } from "react";

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  const applyAuthentication = () => {
    setAuthenticated(true);
  }

  return (
    <main className="container">
      {authenticated ? <TodoList /> : <Login applyAuthentication={applyAuthentication} />}
    </main>
  );
}

export default App;