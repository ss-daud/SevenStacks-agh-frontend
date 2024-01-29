import { Button, Box } from "@mui/material";
import React from "react";
import "./Mike/mike.css";
import img1 from "../assets/imgs/brain8.png";
import Brain from "../assets/svgs/Brain";
import img2 from "../assets/imgs/mic.png";
import Mike from "./Mike/Mike";
import BrainMic from "./BrainMic/BrainMic";

const BrainButton = ({
  isLoading,
  isMicrophoneOn,
  handleClick,
  startRecording,
  isBrainEngaged,
  handleMic,
  stopMicrophone,
}) => {
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <Button
        onClick={handleClick}
        sx={{ cursor: "pointer" }}
        disabled={isLoading || isMicrophoneOn}
      >
        {isBrainEngaged && (
          <div className="pulse-ring3" style={{ left: 11, top: 1 }}></div>
        )}
        {isLoading && (
          <div className="pulse-ring4" style={{ left: 11, top: 1 }}></div>
        )}

        <Brain />
      </Button>
    </div>
  );
};

export default BrainButton;
