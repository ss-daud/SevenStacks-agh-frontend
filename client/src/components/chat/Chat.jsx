import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  useMediaQuery,
} from "@mui/material";
import "./chat.css";
import { AUTH_URL } from "../../api";
import useOpenAI from "../../openai/OpenAi";
import MicrophoneInput from "../MicrophoneInput";
import img1 from "../../assets/imgs/undo.png";
import TitleModal from "../modals/TitleModal";
import BrainButton from "../BrainButton";
import { useChatContext } from "../../context/ChatContext";
import axios from "axios";
import { useTopic } from "../../context/TopicContext";
import { gpt_query } from "../../utils/GPT-query";
import { useTheme } from "@mui/material/styles";
import AWS_Mic from "../AWS Mic/AWS_Mic";
import Brain_Mic from "../Brain_Mic";

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
  const [previous, setPrevious] = useState("");
  const [format, setFormat] = useState();
  const theme = useTheme();

  const [isMediumScreen, setIsMediumScreen] = useState(
    window.innerWidth > 50 && window.innerWidth <= 900
  );

  const addPreviouseInput = () => {
    setPreviousInput(input);
  };

  const handleResize = () => {
    setIsMediumScreen(window.innerWidth > 50 && window.innerWidth <= 900);
  };

  const handleBrainEngage = () => {
    setIsBrainEngaged(true);
  };

  const handleBrainDisengage = () => {
    setIsBrainEngaged(false);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleMicrophoneStatusChange = (microphoneOn) => {
    setIsMicrophoneOn(microphoneOn);
    console.log("Microphone status changed:", microphoneOn);
  };
  const handleBrain = () => {
    setIsMicrophoneOn(false);
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const getChatInput = (value) => {
    setPrevious(value);
    setResponse(`${response} ${previous}`);
    console.log(previous);
  };

  const getVoiceInput = (value) => {
    setInput(`${previousInput} ${value}`);
  };

  const getBrainInput = (value) => {
    setBrainInput(value);
  };
  const handleDoubleClick = (event, content) => {
    console.log("Double-clicked on:", content);
    setResponse(content);
  };

  // const getTitle = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:8091/api/title/get");
  //     setTitle(response?.data?.title);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // useEffect(() => {
  //   getTitle();
  // }, []);

  // const ids = title.map((index) => index._id);
  // const randomIndex = Math.floor(Math.random() * ids.length); // Generate a random index
  // const selectedId = ids[randomIndex]; // Get the ID at the random index

  const handleSubmit = async () => {
    const trimmedText = brainInput.replace(/^save as\s*/i, "");

    const apiObject = {
      heading: trimmedText,
      response: response,
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

      setBrainInput("");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handlePrint = async () => {
    console.log("print");
    const trimmedText = brainInput.replace(/^print\s*/i, "");
    console.log(trimmedText);
    const wordArray = trimmedText.split(/\s+and\s+/);
    setTitle(wordArray);
    console.log(wordArray);
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
      console.log(response);
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

  const handleTemplate = async () => {
    // console.log("Template");
    // const trimmedText = brainInput.replace(/^load\s*/i, "");
    // console.log(trimmedText);
    let trimmedText;
    if (brainInput.toLowerCase().includes("demo 1")) {
      trimmedText = "demo 1";
    }

    const token = localStorage.getItem("token");
    const apiObject = {
      name: trimmedText,
    };
    console.log(apiObject);

    try {
      const response = await axios.get(`${AUTH_URL}api/template`, {
        params: apiObject,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response?.data?.template);
      setFormat(response?.data?.template);
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

  //   console.log(inputData);
  //   fetchData(inputData);
  // };
  const gptFunction = () => {
    let history_arr = topics.map((topic) => {
      return topic.response;
    });

    let history = history_arr.join(", ");

    let inputData;

    // Extracting the first word from brainInput for better comparison
    const command = brainInput.split(" ")[0].trim().toLowerCase();
    console.log(command);
    if (command === "edit") {
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
      inputData = gpt_query(brainInput, input, history);
    } else if (command === "list") {
      console.log(brainInput);
      console.log("list");
      if (
        brainInput.toLowerCase().includes("comprehensive") &&
        brainInput.toLowerCase().includes("demo 1")
      ) {
        console.log("yes");
        handleTemplate();

        inputData = gpt_query(brainInput, input, history, format);
      } else {
        const _value = response || input;

        inputData = gpt_query(brainInput, input, history);

        // inputData = `${brainInput} in details  in html format  in single div of ${
        //   response || input
        // } `;
      }
    } else {
      if (input) {
        inputData = gpt_query(brainInput, input, history);
      } else {
        inputData = gpt_query(brainInput, response, history);
      }
    }

    console.log(inputData);
    fetchData(inputData);
  };

  useEffect(() => {
    setBrainInput("");
    if (data) {
      // setPrevious(response); // Store the current response in the 'previous' state
      setResponse(data);
      setReports("");
      console.log(response);
    }
  }, [data]);

  const handleTitleChange = () => {
    setIsModalOpen(true);
  };

  const handleClick = () => {
    console.log("click");
    setResponse(input);
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
                    <div
                      dangerouslySetInnerHTML={{
                        __html: replaceHeaders(response),
                      }}
                      onDoubleClick={() => handleDoubleClick(response)}
                      contentEditable={true} // Add this line
                      style={{
                        border: "none",
                        boxSizing: "border-box",
                        outline: "none",
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
            {/* <MicrophoneInput
              data={data}
              getVoiceInput={getVoiceInput}
              isLoading={isLoading}
              isMicrophoneOn={isMicrophoneOn}
              onStatusChange={handleMicrophoneStatusChange}
              isBrainEngaged={isBrainEngaged}
              previousInput={previousInput}
              addPreviouseInput={addPreviouseInput}
            /> */}
            <AWS_Mic
              getVoiceInput={getVoiceInput}
              isLoading={isLoading}
              isMicrophoneOn={isMicrophoneOn}
              onStatusChange={handleMicrophoneStatusChange}
              isBrainEngaged={isBrainEngaged}
              previousInput={previousInput}
              addPreviouseInput={addPreviouseInput}
              getChatInput={getChatInput}
              response={response}
            />
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
              backgroundColor: "#FAFEFF", // Add this line for box shadow
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
                value={brainInput}
                gptFunction={gptFunction}
                getBrainInput={getBrainInput}
                isLoading={isLoading}
                isMicrophoneOn={isMicrophoneOn}
                isBrainEngaged={isBrainEngaged}
                onBrainEngage={handleBrainEngage}
                onBrainDisengage={handleBrainDisengage}
              />
            </div>
          </div>
        </div>
        <TitleModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          response={data}
        />
      </div>
    </>
  );
};

export default Chat;
