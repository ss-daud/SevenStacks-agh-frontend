import { useState } from "react";

import { API_KEY } from "../../src/api/index";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true,
});

const useOpenAI = () => {
  const [data, setData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (prompt) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: [
          {
            role: "system",
            content:
              "You are a physician that provides answers ready to be put in an electronic medical records system using the best practices in the medical field. Be concise, no editorial commands are needed, limit your answer to what is asked of you. Do not refer to external inputs from other physicians. Any answer should be provided as it would be entered in an EMR system by a physician.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.5,
      });

      const messageContent = response.choices[0]?.message?.content;

      setData(messageContent);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, fetchData };
};

export default useOpenAI;
