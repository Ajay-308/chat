"use client";
import { useState } from "react";
import { useSocket } from "../app/context/socketProvider";
import classes from "./page.module.css";

export default function Page() {
  const { sendMessage } = useSocket();
  const [message, setMessage] = useState("");

  return (
    <div>
      <div>
        <input
          value={message} // Bind input value to state
          onChange={(e) => setMessage(e.target.value)}
          className={classes["chat-input"]}
          placeholder="Message..."
        />
        <button
          onClick={(e) => sendMessage(message)}
          className={classes["button"]}
        >
          Send
        </button>
      </div>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li> // Added unique key
        ))}
      </ul>
    </div>
  );
}
