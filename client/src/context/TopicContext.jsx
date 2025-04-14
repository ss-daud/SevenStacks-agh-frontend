import React, { createContext, useContext, useState, useEffect } from "react";
import { AUTH_URL } from "../api";
import axios from "axios";
import  decryptionofData  from "../decryption/decryption";
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
          Authorization: `Bearer ${token}`,
        },
      });

      const decrypted = await decryptionofData(response.data.encrypted_response);

      setTopics(decrypted.topics || []);
    } catch (err) {
      console.error("Failed to fetch or decrypt topics", err);
    }
  };
  useEffect(() => {
    fetchTopics();
  }, []);
  const addTopic = (topic) => {
    setTopics((value) => {
      return [...value, topic];
    });
  };
  const removeTopic = (topicId) => {
    setTopics((prevTopics) =>
      prevTopics.filter((topic) => topic.id !== topicId)
    );

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
