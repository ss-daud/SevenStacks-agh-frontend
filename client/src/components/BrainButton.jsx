import { Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import "./Mike/mike.css";
import img1 from "../assets/imgs/brain8.png";
const BrainButton = ({
  value,
  gptFunction,
  getBrainInput,
  isLoading,
  isMicrophoneOn,
  isBrainEngaged,
  onBrainEngage,
  onBrainDisengage,
}) => {
  const [startRecording, setStartRecording] = useState(false);

  const [recognition, setRecognition] = useState(null);
  const startMicrophone = async () => {
    try {
      recognition.start();
      setStartRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopMicrophone = () => {
    recognition.stop();
    setStartRecording(false);
  };
  const handleVoiceInput = (voiceInput) => {
    getBrainInput(voiceInput);
  };
  useEffect(() => {
    window.SpeechRecognition = window.webkitSpeechRecognition;
    const reg = new SpeechRecognition();
    reg.interimResults = true;
    reg.continuous = true;
    setRecognition(reg);
    reg.addEventListener("result", (e) => {
      const transcript = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join(" ");

      handleVoiceInput(transcript);
    });
  }, []);
  const handleClick = () => {
    if (startRecording) {
      stopMicrophone();
      onBrainDisengage(); // Call the disengage function
      return;
    }
    if (value === "") {
      startMicrophone();
      onBrainEngage(); // Call the engage function
    } else if (!startRecording) {
      gptFunction(value);
    }
  };
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",
      }}
    >
      {startRecording && (
        <div className="pulse-ring2" style={{ top: 5, left: 14 }}></div>
      )}

      <Button
        onClick={handleClick}
        sx={{ cursor: "pointer" }}
        disabled={isLoading || isMicrophoneOn}
      >
        <img src={img1} alt="Brain" />
      </Button>
    </div>
  );
};

export default BrainButton;
