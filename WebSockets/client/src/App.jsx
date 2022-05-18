import React, { useState, useEffect } from "react";
import Input from "./Input/Input.jsx";
import io from "socket.io-client";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (socket === null) setSocket(io("http://localhost:3001"));
    if (socket) {
      socket.on("message", (data) => {
        setMessages((m) => [...m, "Connected"]);
        console.log(data);
      });
      socket.on("messageReturn", (message) => {
        setMessages((m) => [...m, message]);
      });
      socket.on("newUser", (username) => {
        console.log({ username });
        setMessages((m) => [...m, `${username} has joined`]);
        setUsers((m) => [...m, username]);
      });
      socket.on("userDisconnect", (response) => {
        setMessages((m) => [...m, `${response[0]} has left`]);
        setUsers(response[1]);
      });
      socket.on("loginSucc", (succ) => {
        setIsLoggedIn(true);
        setUsers(succ);
      });
    }
  }, [socket]);

  // useEffect(() => {
  //   socket.on("message", (data) => {
  //     setMessages((m) => [...m, "Connected"]);
  //     console.log(data);
  //   });
  //   socket.on("messageReturn", (message) => {
  //     setMessages((m) => [...m, message]);
  //   });
  //   socket.on("newUser", (username) => {
  //     console.log({ username });
  //     setMessages((m) => [...m, `${username} has joined`]);
  //     setUsers((m) => [...m, username]);
  //   });
  //   socket.on("userDisconnect", (response) => {
  //     setMessages((m) => [...m, `${response[0]} has left`]);
  //     setUsers(response[1]);
  //   });
  // }, [isLoggedIn]);

  // useEffect(() => {
  //   socket.on("loginSucc", (succ) => {
  //     setIsLoggedIn(true);
  //     setUsers(succ);
  //   });
  // }, []);

  const send = (message) => socket.emit("message", message);
  const login = (username) => socket.emit("login", username);

  if (!isLoggedIn)
    return (
      <div className="container">
        <h3>Zaloguj się:</h3>
        <Input send={login} />
      </div>
    );

  return (
    <div className="container">
      <div className="users">
        <h3>Lista użytkowników:</h3>
        {users.map((u, i) => (
          <li key={i}>{u}</li>
        ))}
      </div>
      <Input send={send} />
      <ul className="messageList">
        {messages.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
    </div>
  );
}
