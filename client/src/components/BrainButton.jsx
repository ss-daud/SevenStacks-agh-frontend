import { Button } from "@mui/material";
import React from "react";
import "./Mike/mike.css";
import img1 from "../assets/imgs/brain8.png";

const BrainButton = ({
  isLoading,
  isMicrophoneOn,
  handleClick,
  startRecording,
}) => {
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
