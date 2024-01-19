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
      <Box sx={{ marginTop: "3px" }}>
        {isBrainEngaged ? (
          <Box
            onClick={stopMicrophone}
            sx={{ width: "100% ", marginTop: "3px" }}
          >
            <BrainMic />
          </Box>
        ) : (
          <Box
            sx={{
              cursor: "pointer",
            }}
          >
            <Button
              onClick={startRecording}
              disabled={isLoading || isMicrophoneOn}
            >
              <img src={img2} alt="microphone" height={35} width={35} />
            </Button>
          </Box>
        )}
      </Box>

      <Button
        onClick={handleClick}
        sx={{ cursor: "pointer" }}
        disabled={isLoading || isMicrophoneOn}
      >
        <Brain />
      </Button>
    </div>
  );
};

export default BrainButton;
