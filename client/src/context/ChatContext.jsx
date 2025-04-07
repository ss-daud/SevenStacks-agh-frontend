// ChatContext.js
import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export function useChatContext() {
  return useContext(ChatContext);
}

export function ChatContextProvider({ children }) {
  const [input, setInput] = useState(""); // Add input state
  const [brainInput, setBrainInput] = useState(""); // Add brainInput state
  const [response, setResponse] = useState(""); // Add data state
  const [reports, setReports] = useState([]);
  const [previousInput, setPreviousInput] = useState("");
  const [history, setHistory] = useState([response]);

  return (
    <ChatContext.Provider
      value={{
        input,
        setInput,
        brainInput,
        setBrainInput,
        response,
        setResponse,
        reports,
        setReports,
        previousInput,
        setPreviousInput,
        history,
        setHistory
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
