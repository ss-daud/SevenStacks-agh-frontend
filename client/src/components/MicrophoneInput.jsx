import React, { useState, useEffect } from "react";

import { Box, Button, useMediaQuery, FormControl, Select, MenuItem } from "@mui/material";
import img1 from "../assets/imgs/mic.png";
import Mike from "./Mike/Mike";

const MicrophoneInput = ({
  data,
  getVoiceInput,
  isLoading,
  isMicrophoneOn,
  onStatusChange,
  isBrainEngaged,
  previousInput,
  addPreviouseInput,
  setResponse,
  setInput
}) => {
  const [attached, setAttached] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en-US")
  const [audioStream, setAudioStream] = useState(null);
  const [isMicrophoneActive, setIsMicrophoneActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const isLargeScreen = useMediaQuery("(min-width:2000px)");
  const [isMediumScreen, setIsMediumScreen] = useState(
    window.innerWidth > 50 && window.innerWidth <= 900
  );

  const handleResize = () => {
    setIsMediumScreen(window.innerWidth > 50 && window.innerWidth <= 900);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleInput = (e, PI) => {
    const transcript = Array.from(e.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join(" ");

    getVoiceInput(transcript);
  };

  const startMicrophone = async () => {
    try {
      recognition.start();
      recognition.addEventListener("result", (e) =>
        handleInput(e, previousInput)
      );
      setIsMicrophoneActive(true);
      onStatusChange(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopMicrophone = () => {
    recognition.stop();
    setIsMicrophoneActive(false);
    onStatusChange(false);
    recognition.removeEventListener("result", handleInput);
    // addPreviouseInput();
    setInput('');
    console.log("Microphone is stopped");
  };

  useEffect(() => {
    let reg;
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      window.SpeechRecognition = window.webkitSpeechRecognition;
      reg = new SpeechRecognition();
      reg.interimResults = true;
      reg.continuous = true;
      reg.lang = selectedLanguage

      setRecognition(reg);
      reg.addEventListener("result", (e) => handleInput(e, previousInput));
    } else {
      console.error("Web Speech API is not supported in this browser.");
    }
  }, [selectedLanguage, previousInput]);

  return (
    <>
      <div>
        <FormControl style={{ marginBottom: 16, marginLeft: 10, background: selectedLanguage ? '#E0F7FA' : 'transparent', border: '1px solid blue', borderRadius: '5px' }}>
          <Select
            labelId="language-select-label"
            id="language-select"
            value={selectedLanguage}
            label="Language"
            onChange={(e) => {
              if (!isMicrophoneActive) {
                setSelectedLanguage(e.target.value);
              }
            }}
          >
            <MenuItem value="ar-SA">AR</MenuItem>
            <MenuItem value="en-US">EN</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div>
        <Box style={{ marginBottom: 10, }}>
          {isMicrophoneActive ? (
            <>
              <Button
                variant="outlined"
                style={{
                  marginBottom: "10px",
                  borderRadius: "50%",
                  width: "50px",
                  height: "50px",
                  minWidth: "50px",
                  padding: "0",
                  backgroundColor: "#CDE0EA ",
                  color: "#023246",
                }}
                onClick={stopMicrophone}          >
                <Mike />
              </Button>
            </>
          ) : (
            <Box>
              <Button
                style={{
                  width: "50px",
                  height: "50px",
                  minWidth: "50px",
                }}
                onClick={startMicrophone}
                disabled={isLoading || isBrainEngaged}
              >
                <img
                  src={img1}
                  alt="microphone"
                  height={isLargeScreen ? 80 : 60}
                  width={isLargeScreen ? 80 : 60}
                />
              </Button>
            </Box>
          )}
        </Box>
      </div>

      {/* <TitleModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        response={data}
      /> */}
    </>
  );
};

export default MicrophoneInput;