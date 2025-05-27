import { useState } from "react";

export const Login = ({ applyAuthentication }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      alert("Preencha todos os campos");
      return;
    }

    const authentication = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }).then((response) => response.json());

    if (authentication?.error) {
      alert(authentication.error);
    } else {
      localStorage.setItem("session", JSON.stringify(authentication));
      applyAuthentication();
    }
  };

  return (
    <div className="login">
      <h1>Login</h1>
      <form>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(() => e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(() => e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </form>
    </div>
  );
};