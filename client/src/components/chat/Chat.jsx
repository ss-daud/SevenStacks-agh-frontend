import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  useMediaQuery,
} from "@mui/material";
import { AUTH_URL } from "../../api";
import useOpenAI from "../../openai/OpenAi";
import MicrophoneInput from "../MicrophoneInput";
import img1 from "../../assets/imgs/undo.png";
import BrainButton from "../BrainButton";
import { useChatContext } from "../../context/ChatContext";
import axios from "axios";
import { useTopic } from "../../context/TopicContext";
import { gpt_query } from "../../utils/GPT-query";
import { useTheme } from "@mui/material/styles";
import AWS_Mic from "../AWS Mic/AWS_Mic";

const Chat = () => {
  const {
    input,
    brainInput,
    setBrainInput,
    setInput,
    response,
    setResponse,
    reports,
    setReports,
    previousInput,
    setPreviousInput,
  } = useChatContext();
  const { addTopic, topics } = useTopic();
  const isScreen = useMediaQuery("(max-width: 1100px)");
  const isLargeScreen = useMediaQuery("(min-width:2000px)");
  const { data, isLoading, error, fetchData } = useOpenAI();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState([]);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
  const [isBrainEngaged, setIsBrainEngaged] = useState(false);
  const [previousResponse, setPreviousResponse] = useState("");
  const responseRef = useRef(null);

  const [previous, setPrevious] = useState("");

  const [isMediumScreen, setIsMediumScreen] = useState(
    window.innerWidth > 50 && window.innerWidth <= 900
  );

  const addPreviouseInput = () => {
    setPreviousInput(input);
  };

  const handleResize = () => {
    setIsMediumScreen(window.innerWidth > 50 && window.innerWidth <= 900);
  };

  const updateChatInputs = () => {
    setInput("");
    setBrainInput("");
    setResponse("");
    setReports("");
    setPreviousInput("");
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleMicrophoneStatusChange = (microphoneOn) => {
    setIsMicrophoneOn(microphoneOn);
  };

  const handleInputChange = (event) => {
    console.log(event.target.value);
    setInput(event.target.value);
  };

  const getCursorPosition = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const { startContainer, startOffset } = range;

      // The cursor position
      const cursorPosition = startOffset;

      return cursorPosition;
    }
  };

  const getChatInput = (value) => {
    const cursorPosition = getCursorPosition();
    if (cursorPosition !== -1) {
      const start = response.substring(0, cursorPosition);
      const end = response.substring(cursorPosition);

      // Append the value at the cursor position
      const newResponse = `${start}${value}${end}`;

      // Update the response state
      setResponse(newResponse);
    }
  };

  const getVoiceInput = (value) => {
    setInput(`${input} ${value}`);
  };

  const getBrainInput = (value) => {
    setBrainInput(value);
  };

  const handleSubmit = async () => {
    const trimmedText = brainInput.replace(/^save as\s*/i, "");
    if (trimmedText == "") {
      alert("enter name to save");
      return;
    }

    const apiObject = {
      heading: trimmedText,
      response: response || input.replace(/(?:\r\n|\r|\n)/g, "<br>"),
    };

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${AUTH_URL}api/topic/create`,
        apiObject,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Append the token to the headers
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.newTopic) {
        addTopic(response?.data?.newTopic);
      }

      updateChatInputs();
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handlePrint = async () => {
    const trimmedText = brainInput.replace(/^print\s*/i, "");

    const wordArray = trimmedText.split(/\s+and\s+/);
    setTitle(wordArray);

    const token = localStorage.getItem("token");

    try {
      const queryString = wordArray
        .map((word) => `headings[]=${word}`)
        .join("&");
      const url = `${AUTH_URL}api/topic/responses-by-heading?${queryString}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response?.data?.responses.length != 0) {
        setReports(response?.data?.responses);
      } else {
        setReports([""]);
      }
      setResponse("");
      setBrainInput("");
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${AUTH_URL}api/topic/my-topics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const topics = response.data.topics;

      const allResponses = topics.map((topic) => topic.response);

      return allResponses;
    } catch (error) {
      alert("Error: no template exists for this name");
    }
  };
  const handleTemplate = async () => {
    // let trimmedText;
    // if (brainInput.toLowerCase().includes("review of system")) {
    //   trimmedText = "review of system";
    // } else if (brainInput.toLowerCase().includes("r.o.s")) {
    //   trimmedText = "r.o.s";
    // } else if (brainInput.toLowerCase().includes("physical exam")) {
    //   trimmedText = "physical exam";
    // } else if (brainInput.toLowerCase().includes("p.e")) {
    //   trimmedText = "p.e";
    // } else if (brainInput.toLowerCase().includes("pe")) {
    //   trimmedText = "pe";
    // } else if (brainInput.toLowerCase().includes("ros")) {
    //   trimmedText = "ros";
    // }
    let textAfterComprehensive = "";

    let indexComprehensive = brainInput.indexOf("comprehensive");

    if (indexComprehensive !== -1) {
      // Extract the text after "comprehensive"
      textAfterComprehensive = brainInput
        .substring(indexComprehensive + "comprehensive".length + 1)
        .trim();
    }

    const token = localStorage.getItem("token");
    const apiObject = {
      name: textAfterComprehensive,
    };

    try {
      const response = await axios.get(`${AUTH_URL}api/template`, {
        params: apiObject,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response?.data?.template || "";
    } catch (error) {
      alert("Error: no template exists for this name");
    }
  };

  // const gptFunction = () => {
  //   let inputData;
  //   if (brainInput.includes("edit")) {
  //     if (response) {
  //       inputData = ` edit  """ ${response}"""`;
  //     } else if (input) {
  //       inputData = ` edit  """ ${input}"""`;
  //     }
  //   } else if (brainInput.split(" ")[0].trim().toLowerCase() == "add") {
  //     inputData = ` ${brainInput} """ ${response}"""`;
  //   } else if (brainInput.split(" ")[0].trim().toLowerCase() == "save") {
  //     handleSubmit();
  //     return;
  //   } else if (brainInput.split(" ")[0].trim().toLowerCase() == "print") {
  //     handlePrint();
  //     return;
  //   } else if (brainInput.split(" ")[0].trim().toLowerCase() == "interpret") {
  //     inputData = `${brainInput}  of ${input}  in details  in html format  in single div`;
  //   } else {
  //     if (brainInput.split(" ")[0].trim().toLowerCase() == "list") {
  //       if (response) {
  //         inputData = `${brainInput} in details  in html format  in single div of ${response} `;
  //       } else if (input) {
  //         inputData = `${brainInput} in details  in html format  in single div of ${input} `;
  //       }
  //     } else {
  //       inputData = `${brainInput} `;
  //     }
  //   }

  //
  //   fetchData(inputData);
  // };
  const gptFunction = async () => {
    let history_arr = topics.map((topic) => {
      return topic.response;
    });

    let history = history_arr.join(", ");

    let inputData;
    let query;
    // Extracting the first word from brainInput for better comparison

    const command = brainInput.split(" ")[0].trim().toLowerCase();

    if (command === "edit") {
      query = ` edit  """ ${response || input}"""`;
      inputData = ` edit  """ ${response || input}"""`;
    } else if (command === "add") {
      inputData = ` ${brainInput} """ ${response}"""`;
    } else if (command === "save") {
      handleSubmit();
      return;
    } else if (command === "load") {
      handleTemplate();
      return;
    } else if (command === "print") {
      handlePrint();
      return;
    } else if (command === "interpret") {
      query = `${brainInput} of ${input} in hstml format in single div `;
    } else if (command === "list" || command === "give") {
      if (brainInput.toLowerCase().includes("comprehensive")) {
        const _headings = await handleSave();

        const _format = await handleTemplate();

        if (input) {
          query = `${brainInput} of ${input}in format of ${_format} in html format in single div `;
        } else {
          query = `${brainInput} of ${_headings}}in format of ${_format} in html format in single div `;
        }

        // query = gpt_query(brainInput, input, history, format);
      } else {
        console.log("give");
        const _value = response || input;

        if (input) {
          query = `${brainInput}   in html format in single div in detail of${input}  `;
          // query = gpt_query(brainInput, input, history);
        }
        if (response) {
          query = `${brainInput}  in html format in single div in detail of ${response}  `;
          // query = gpt_query(brainInput, response, history);
        }
        // inputData = `${brainInput} in details  in html format  in single div of ${
        //   response || input
        // } `;
      }
    } else {
      if (input) {
        query = `${brainInput}  in html format in single div in detail of ${input} `;
        // query = gpt_query(brainInput, input, history);
        // inputData = gpt_query(brainInput, input, history);
      } else {
        query = `${brainInput}  in html format in single div in detail of ${response}  `;
        // inputData = gpt_query(brainInput, response, history);
        // query = gpt_query(brainInput, response, history);
      }
    }

    console.log(query);
    fetchData(query);
  };

  useEffect(() => {
    setBrainInput("");
    if (data) {
      setPreviousResponse(response); // Store the previous response
      setResponse(data);
      setReports("");
    }
  }, [data]);

  const handleClick = () => {
    setResponse(previousResponse);
  };
  function replaceHeaders(htmlContent) {
    if (!htmlContent) {
      return;
    }

    // Use regular expressions to replace h1, h2, and h3 with h4
    const modifiedContent = htmlContent
      .replace(/<h1/g, "<h6")
      .replace(/<\/h1/g, "</h6")
      .replace(/<h2/g, "<h6")
      .replace(/<\/h2/g, "</h6")
      .replace(/<h3/g, "<h6")
      .replace(/<\/h3/g, "</h6")
      .replace(/<h4/g, "<h6")
      .replace(/<\/h4/g, "</h6")
      .replace(/<h5/g, "<h6")
      .replace(/<\/h5/g, "</h6");
    return modifiedContent;
  }

  const [startRecording, setStartRecording] = useState(false);

  const [recognition, setRecognition] = useState(null);
  const startMicrophone = async () => {
    try {
      recognition.start();
      setStartRecording(true);
      setIsBrainEngaged(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopMicrophone = () => {
    recognition.stop();
    setStartRecording(false);
    setIsBrainEngaged(false);
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

  const handleBrainMic = () => {
    if (startRecording) {
      stopMicrophone();
      setIsBrainEngaged(false);
      return;
    }
    if (!brainInput && !startRecording) {
      startMicrophone();
      setIsBrainEngaged(true);
    }
  };

  const handleBrainButtonClick = () => {
    if (!brainInput && !startRecording) {
      startMicrophone();
      setIsBrainEngaged(true);
    }
    if (startRecording) {
      stopMicrophone();
      setIsBrainEngaged(false);
      return;
    }
    if (!startRecording && brainInput.length) {
      gptFunction();
    }
  };

  let cursorPosition = 0;
  function recordAtCursorPosition() {
    const textArea = document.getElementById("textArea");
    cursorPosition = textArea.selectionStart;
  }

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "calc(100vh - 50px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            padding: 10,
          }}
        >
          <div
            style={{
              width: isScreen ? "90%" : "95%",
              height: "100%",
              border: "1px solid #808080",
              borderRadius: "15px",
              display: "flex",
              flexDirection: "column",
              boxShadow: "10px 10px 15px rgba(0, 0, 0, 0.2)",
              backgroundColor: "#FAFEFF", // Add this line for box shadow
            }}
          >
            <Box
              style={{
                width: "100%",
                display: "flex",
                height: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1%",
              }}
            >
              <Box
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              >
                {isLoading && <p>Loading...</p>}
                {error && response && <p>Error: {error.message}</p>}
                {!response && !isLoading && reports.length == 0 && (
                  <div
                    style={{
                      height: "calc(100vh - 200px)",
                      display: "flex",
                      overflowY: "auto",
                      padding: 4,
                    }}
                  >
                    {!isLoading && !error && !response && (
                      <TextField
                        variant="standard"
                        placeholder="Type here...."
                        onChange={handleInputChange}
                        value={input}
                        style={{
                          width: "100%",
                          marginLeft: 10,
                        }}
                        InputProps={{ disableUnderline: true }}
                        multiline
                      />
                    )}
                  </div>
                )}
                {!isLoading && !error && response && (
                    <div
                        style={{
                          overflowY: "auto",
                          height: "calc(100vh - 200px)",
                          padding: 10,
                          border: "none",
                        }}
                    >
                      <pre
                          id="textArea"
                          contentEditable={true}
                          dangerouslySetInnerHTML={{
                            __html: replaceHeaders(response.trim()), // Trim white spaces from the response.
                          }}
                          onBlur={(e) => setResponse(e.target.innerHTML)}
                          style={{
                            whiteSpace: "pre-wrap",   // Wraps text, respects newlines but removes excess space.
                            wordWrap: "break-word",   // Prevents overflow of long words.
                            margin: 0,                // No additional margins.
                            padding: 0,               // No additional padding.
                            outline: "none",          // No outline while editing.
                            width: "100%",            // Full width for consistency.
                            fontFamily: "inherit",    // Inherits the font from parent (you can customize this).
                          }}
                      />

                    </div>
                )}

                {/* {reports.length > 0 && !response && (
                  <div
                    style={{
                      overflowY: "auto",
                      height: "calc(100vh - 200px)",
                      padding: 10,
                    }}
                  >
                    {reports?.map((item, key) => (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: replaceHeaders(item),
                        }}
                      />
                    ))}
                  </div>
                )} */}
                {!isLoading && !error && !response && reports.length > 0 && (
                    <div
                        style={{
                          overflowY: "auto",
                          height: "calc(100vh - 200px)",
                          padding: 10,
                    }}
                  >
                    {reports?.map((item, key) => (
                      <div key={key}>
                        {title[key] && (
                          <Typography
                            variant="body1"
                            style={{
                              color: "#023246",
                              marginBottom: 10,
                              fontWeight: "bold",
                            }}
                          >
                            {title[key]}:<br></br>
                          </Typography>
                        )}
                        <div
                          dangerouslySetInnerHTML={{
                            __html: replaceHeaders(item),
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </Box>
            </Box>
          </div>

          <Box
            style={{
              width: isScreen ? "10%" : "5%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              margin: "auto", // Add this line to center the div
            }}
          >
            <MicrophoneInput
              data={data}
              getVoiceInput={getVoiceInput}
              isLoading={isLoading}
              isMicrophoneOn={isMicrophoneOn}
              onStatusChange={handleMicrophoneStatusChange}
              isBrainEngaged={isBrainEngaged}
              previousInput={previousInput}
              addPreviouseInput={addPreviouseInput}
            />
            {/* <AWS_Mic
              getVoiceInput={getVoiceInput}
              isLoading={isLoading}
              isMicrophoneOn={isMicrophoneOn}
              onStatusChange={handleMicrophoneStatusChange}
              isBrainEngaged={isBrainEngaged}
              previousInput={previousInput}
              addPreviouseInput={addPreviouseInput}
              getChatInput={getChatInput}
              response={response}
            /> */}
            <Box>
              <Button
                disabled={isLoading || isMicrophoneOn}
                onClick={handleClick}
              >
                <img
                  src={img1}
                  alt="Brain"
                  height={isLargeScreen ? 80 : 45}
                  width={isLargeScreen ? 80 : 45}
                />
              </Button>
            </Box>
          </Box>
        </Box>

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              width: isScreen ? "90%" : "100%",
              borderRadius: "15px",
              height: "50px",
              border: "1px solid #808080",
              marginLeft: "10px",
              marginRight: isScreen ? "11%" : "5.5%",
              marginBottom: 15,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "10px 10px 15px rgba(0, 0, 0, 0.2)",
              backgroundColor: "#FAFEFF",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                height: "100%",
                alignItems: "center",
              }}
            >
              <TextField
                variant="standard"
                placeholder="Chat with AI ...."
                onChange={(e) => {
                  setBrainInput(e.target.value);
                }}
                value={brainInput}
                style={{
                  width: "100%",
                  padding: "1%",
                }}
                InputProps={{ disableUnderline: true }}
                InputLabelProps={{
                  style: { color: "#023246" },
                }}
              />
              {/* <Brain_Mic
                value={brainInput}
                gptFunction={gptFunction}
                getBrainInput={getBrainInput}
                isLoading={isLoading}
                isMicrophoneOn={isMicrophoneOn}
                handleBrain={handleBrain}
                isBrainEngaged={isBrainEngaged}
                onBrainEngage={handleBrainEngage}
                onBrainDisengage={handleBrainDisengage}
              /> */}
              <BrainButton
                isLoading={isLoading}
                isBrainEngaged={isBrainEngaged}
                isMicrophoneOn={isMicrophoneOn}
                handleMic={handleBrainMic}
                handleClick={handleBrainButtonClick}
                startRecording={startMicrophone}
                stopMicrophone={stopMicrophone}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
