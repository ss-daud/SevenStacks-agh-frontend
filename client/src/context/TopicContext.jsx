import React, { createContext, useContext, useState, useEffect } from "react";
import { AUTH_URL } from "../api";
import axios from "axios";
const TopicContext = createContext();

export function useTopic() {
  return useContext(TopicContext);
}

export function TopicProvider({ children }) {
  const [topics, setTopics] = useState([]);
  const fetchTopics = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${AUTH_URL}api/topic/my-topics`, {
        headers: {
          Authorization: `Bearer ${token}`, // Append the token to the headers
        },
      });

      setTopics(response?.data?.topics);
    } catch (err) {}
  };
  useEffect(() => {
    fetchTopics();
  }, []);
  const addTopic = (topic) => {
    setTopics((value) => {
      return [topic, ...value];
    });
  };
  const removeTopic = (topicId) => {
    console.log("Removing", topicId);
    setTopics((prevTopics) =>
      prevTopics.filter((topic) => topic.id !== topicId)
    );
    console.log(topics);
    fetchTopics();
  };

  return (
    <TopicContext.Provider
      value={{ topics, addTopic, removeTopic, fetchTopics }}
    >
      {children}
    </TopicContext.Provider>
  );
}
