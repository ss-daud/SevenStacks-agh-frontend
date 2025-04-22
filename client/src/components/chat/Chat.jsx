import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  useMediaQuery,
  Tooltip,
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
import Save from "../../assets/svgs/Save";
import Print from "../../assets/svgs/Print";
import Copy from "../../assets/svgs/Copy";
import Remove from "../../assets/svgs/Remove";
import { useButton } from "../../context/SaveButtonContext";
import Emr from "../../assets/svgs/Emr";
import AddpatientModal from "../AddpatientModal";
import CircularProgress from '@mui/material/CircularProgress';
import moment from 'moment-timezone';
import { RotateCcw } from 'lucide-react'
import { RotateCw } from 'lucide-react'
import decryptionofData from "../../decryption/decryption";

import encryptionofdata from "../../encryption/page";


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
    history,
    setHistory
  } = useChatContext();
  const { addTopic, topics, fetchTopics } = useTopic();
  const isScreen = useMediaQuery("(max-width: 1100px)");
  const isLargeScreen = useMediaQuery("(min-width:2000px)");
  const { data, record, isLoading, error, fetchData, fetchRecord, setRecord, setPatientname, setPatient, patientname, currentText, setCurrentText } = useOpenAI();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState([]);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
  const [isBrainEngaged, setIsBrainEngaged] = useState(false);
  const [previousResponse, setPreviousResponse] = useState("");
  const [adminStatus, setAdminStatus] = useState();
  const responseRef = useRef(null);
  const { button, editButton, newButton, editButtoniD, trueNewButton, falseEditButton, falseNewButton, editButtons, newButtons } = useButton();
  const [addpatientModal, setaddpatientmodal] = useState(false);

  useEffect(() => {
    setCurrentText(response)
  }, [response])

  // History states
  const [position, setPosition] = useState(0);
  const [isMediumScreen, setIsMediumScreen] = useState(
    window.innerWidth > 50 && window.innerWidth <= 900
  );

  const addPreviouseInput = () => {
    setPreviousInput(input);
  };

  const handleResize = () => {
    setIsMediumScreen(window.innerWidth > 50 && window.innerWidth <= 900);
  };

  // Handle text changes
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setResponse(newText);
    setCurrentText(newText);
    setInput(newText);
    // When we make a new change after undoing, we need to remove the "future" history
    const newHistory = history.slice(0, position + 1);

    // Add the new text to history
    setHistory([...newHistory, newText]);

    // Update position to point to the latest edit
    setPosition(newHistory.length);
  };

  // Undo function
  const handleUndo = () => {
    if (position > 0) {
      setPosition(position - 1);
    }
  };

  // Redo function
  const handleRedo = () => {
    if (position < history.length - 1) {
      setPosition(position + 1);
    }
  };

  // Update text when history position changes
  useEffect(() => {
    if (!editButtons && !newButtons) {
      setCurrentText(history[position]);
      setInput(history[position]);
    }
  }, [position, history]);

  const updateChatInputs = () => {
    falseEditButton();
    falseNewButton();
    setInput("");
    setBrainInput("");
    setResponse("");
    setReports("");
    setPreviousInput("");
    setPatientname("");
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
    setInput(event.target.value);
    setResponse(event.target.value);
  };

  const getCursorPosition = () => {
    const textArea = document.getElementById("textArea");
    if (textArea) {
      return textArea.selectionStart;
    }
    return -1; // Return -1 if textArea not found or no selection
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

  const getVoiceInput = (value, storedCursorPos = -1) => {
    // Get the cursor position and the textarea element
    const textArea = document.getElementById("textArea");
    // Use the stored cursor position from MicrophoneInput if available
    let cursorPos = storedCursorPos !== -1 ? storedCursorPos : (textArea ? textArea.selectionStart : -1);
    console.log("Using cursor position:", cursorPos);
    
    // Clean value from any HTML that might be coming from voice input
    const cleanValue = value.replace(/<[^>]*>/g, "");
    
    // If in edit or new mode, use currentText as the base
    if (editButtons || newButtons) {
      let newText;
      let newCursorPos;
  
      // If no valid cursor position, append to the end
      if (cursorPos === -1 || cursorPos === undefined) {
        newText = `${currentText || ''} ${cleanValue}`.trim();
        newCursorPos = newText.length; // Set cursor at the end
      } else {
        // Insert at cursor position
        const beforeCursor = currentText.substring(0, cursorPos);
        const afterCursor = currentText.substring(cursorPos);
        newText = `${beforeCursor} ${cleanValue} ${afterCursor}`.trim();
        newCursorPos = cursorPos + cleanValue.length + 1; // +1 for the space before the value
      }
  
      // Store the final cursor position
      const finalCursorPos = newCursorPos;
      
      // Use a callback function to ensure state updates happen together
      const updateTextAndCursor = () => {
        setCurrentText(newText);
        setInput(newText);
        
        // Force a manual focus and cursor position after the state update
        window.requestAnimationFrame(() => {
          const updatedTextArea = document.getElementById("textArea");
          if (updatedTextArea) {
            updatedTextArea.focus();
            updatedTextArea.setSelectionRange(finalCursorPos, finalCursorPos);
            
            // Scroll to make cursor visible if needed
            const lineHeight = parseInt(window.getComputedStyle(updatedTextArea).lineHeight);
            const cursorLine = newText.substr(0, finalCursorPos).split('\n').length;
            updatedTextArea.scrollTop = (cursorLine - 1) * lineHeight;
          }
        });
      };
      
      // Execute update function
      updateTextAndCursor();
    } else {
      // Original behavior for non-edit mode
      let newText;
      let newCursorPos;
      
      if (cursorPos === -1 || cursorPos === undefined) {
        newText = `${input || ''} ${cleanValue}`.trim();
        newCursorPos = newText.length; // Set cursor at the end
      } else {
        // Insert at cursor position
        const beforeCursor = input.substring(0, cursorPos);
        const afterCursor = input.substring(cursorPos);
        newText = `${beforeCursor} ${cleanValue} ${afterCursor}`.trim();
        newCursorPos = cursorPos + cleanValue.length + 1; // +1 for the space before the value
      }
      
      // Store the final cursor position
      const finalCursorPos = newCursorPos;
      
      // Update input with the new text
      setInput(newText);
      
      // Force a manual focus and cursor position after the state update
      window.requestAnimationFrame(() => {
        const updatedTextArea = document.getElementById("textArea");
        if (updatedTextArea) {
          updatedTextArea.focus();
          updatedTextArea.setSelectionRange(finalCursorPos, finalCursorPos);
          
          // Scroll to make cursor visible if needed
          const lineHeight = parseInt(window.getComputedStyle(updatedTextArea).lineHeight);
          const cursorLine = newText.substr(0, finalCursorPos).split('\n').length;
          updatedTextArea.scrollTop = (cursorLine - 1) * lineHeight;
        }
      });
  
      // Update history
      const newHistory = history.slice(0, position + 1);
      setHistory([...newHistory, newText]);
      setPosition(newHistory.length);
    }
  };

  const getBrainInput = (value) => {
    setBrainInput(value);
  };

  const handleSubmit = async () => {
    const DataRes = await fetchRecord(response);

    if (typeof DataRes !== "object" || DataRes === null) {
      alert("Invalid data received");
      return;
    }

    if (!DataRes.Patient_Name) {
      setaddpatientmodal(true);
      return;
    }

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const formatTime = moment().tz(timeZone).format("D-MM-YYYY hh:mm a");

    const apiObject = {
      response: response || input.replace(/(?:\r\n|\r|\n)/g, "<br>"),
      record: DataRes,
      timeZone: formatTime
    };

    const encrypted_res = await encryptionofdata(apiObject);

    const token = localStorage.getItem("token");

    try {
      const encrypted_response = await axios.post(
        `${AUTH_URL}api/topic/create`, { encrypted_res: encrypted_res },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const response = await decryptionofData(encrypted_response.data);

      if (response?.newTopic) {
        addTopic(response?.newTopic);
        await fetchTopics();
      }

      updateChatInputs();
      setRecord('');
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handlepatientsubmit = async () => {
    const patienWithName = await setPatient(response);

    if (typeof patienWithName.record !== "object" || patienWithName.record === null) {
      alert("Invalid data received");
      return;
    }

    if (!patienWithName.record.Patient_Name) {
      setaddpatientmodal(true);
      return;
    }


    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const formatTime = moment().tz(timeZone).format("D-MM-YYYY hh:mm a");

    const apiObject = {
      response: patienWithName.content || input.replace(/(?:\r\n|\r|\n)/g, "<br>"),
      record: patienWithName.record,
      timeZone: formatTime
    };

    const token = localStorage.getItem("token");

    const encrypted_res = await encryptionofdata(apiObject);


    try {
      const encrypted_res_back = await axios.post(
        `${AUTH_URL}api/topic/create`,
        { encrypted_res: encrypted_res },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const response = await decryptionofData(encrypted_res_back.data);
      if (response?.newTopic) {
        addTopic(response?.newTopic);
        await fetchTopics();
      }

      updateChatInputs();
      setRecord('');
      setPatientname('');
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleChatPrint = async () => {
    // Get the current content of the big textbox
    let currentContent = document.querySelector('#textArea')?.value;
    if (!currentContent) {
      currentContent = res;
    }


    const iframe = document.createElement("iframe");
    iframe.style.display = "none";

    iframe.srcdoc = `
      <html>
        <head>
          <title>Print</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 0;
            }
            pre {
              white-space: pre-wrap; /* Preserve white space */
            }
          </style>
        </head>
        <body>
          <pre>${currentContent}</pre>
          <script type="text/javascript">
            // window.onload = function() {
            window.print();
            // };
          </script>
        </body>
      </html>
    `;

    document.body.appendChild(iframe);
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

      const decrypted_res = await decryptionofData(response);
      if (decrypted_res?.responses.length != 0) {
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

  const editButtonClick = async (id) => {
    // Get the current content of the big textbox
    let currentContent = document.querySelector('#textArea')?.value;
    if (!currentContent) {
      currentContent = res;
    }

    const token = localStorage.getItem("token");
    try {

      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const formatTime = moment().tz(timeZone).format("D-MM-YYYY hh:mm a");
      // Update the record
      const apiObject = {
        id: id,
        response: currentContent,
        timeZone: formatTime
      };

      const encrypted_payload = await encryptionofdata(apiObject);

      const response = await axios.put(`${AUTH_URL}api/topic/UpdateTopic/${id}`,
        { encrypted_payload: encrypted_payload },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      const decrypted_res = await decryptionofData(response.data);

      if (response.status === 200) {
        alert("Record saved successfully.");
        // success
        await fetchTopics();
        updateChatInputs();
      }
    } catch (error) {
      console.error("Error updating record:", error);
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

      const decrypted = await decryptionofData(response.data.encrypted_response);

      const topics = decrypted.topics;

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

    const encrypted_payload = await encryptionofdata(apiObject);

    try {
      const response = await axios.get(`${AUTH_URL}api/template`, {
        params: encrypted_payload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const encrypted_response = await encryptionofdata(response);

      return encrypted_response?.data?.template || "";
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

    fetchData(query);
  };

  const handleGptQuery = (text) => {
    const query = `${text} ${input}`
    fetchData(query);
  }

  useEffect(() => {
    setBrainInput("");
    if (data) {
      setPreviousResponse(response);
      setResponse(data);
      setReports("");
    }
  }, [data]);

  const handleClick = () => {
    setResponse(previousResponse);
  };

  function decodeHtmlEntities(htmlContent) {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = htmlContent;
    return textArea.value;
  }
  function replaceHeaders(htmlContent) {
    if (!htmlContent) {
      return;
    }
    // Decode the HTML entities to ensure proper processing
    const decodedContent = decodeHtmlEntities(htmlContent);
    // Use regular expressions to replace h1, h2, and h3 with h4
    const modifiedContent = decodedContent
      .replace(/<h1/g, "<h6")
      .replace(/<\/h1/g, "</h6")
      .replace(/<h2/g, "<h6")
      .replace(/<\/h2/g, "</h6")
      .replace(/<h3/g, "<h6")
      .replace(/<\/h3/g, "</h6")
      .replace(/<h4/g, "<h6")
      .replace(/<\/h4/g, "</h6")
      .replace(/<h5/g, "<h6")
      .replace(/<\/h5/g, "</h6")
      .replace(/<\s*div\s*>/g, "<div>")
      .replace(/<\s*\/\s*div\s*>/g, "</div>")
      // Handle other potential tags like spans similarly if needed
      .replace(/<\s*br\s*>/g, "<br>");
    return modifiedContent;
  }

  const [startRecording, setStartRecording] = useState(false);
  const [buttonData, setButtonData] = useState([]);

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

  const fetchDataFromAPI = async () => {
    try {
      // Make an API call to fetch the user's data
      const token = localStorage.getItem("token");
      const encrypt = await axios.get(`${AUTH_URL}api/user/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await decryptionofData(encrypt.data);
      setAdminStatus(response?.user?.isAdmin);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const fetchbuttonsData = async () => {
    try {
      const res = await axios.get(`${AUTH_URL}api/buttons/list`);
      const decrypted_data = await decryptionofData(res.data.encryptedResponse);
      setButtonData(decrypted_data.buttons);
    } catch (error) {
      console.error("Error fetching buttons data:", error);
    }
  }
  const handleCopyToClipboard = (contentToCopy) => {
    // Create a temporary textarea element to hold the text to copy
    const textArea = document.createElement("textarea");

    // Check if the content is HTML code
    if (contentToCopy.startsWith("<")) {
      const tempElement = document.createElement("div");
      tempElement.innerHTML = contentToCopy;
      textArea.value = tempElement.innerText;
    } else {
      textArea.value = contentToCopy;
    }
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand("copy");
      alert("Copied successfully");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const handlebuttonSubmit = async (name) => {
    trueNewButton();
    const buttonDataonClick = buttonData.find(x => x.name === name);
    handleGptQuery(buttonDataonClick.text);
  }

  useEffect(() => {
    fetchbuttonsData();
    fetchDataFromAPI();
  }, []);

  function recordAtCursorPosition() {
    const textArea = document.getElementById("textArea");
    let cursorPosition = textArea.selectionStart;
    return cursorPosition;
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
              backgroundColor: "#FAFEFF",
              overflow: "auto"
            }}
          >
            <Box
              style={{
                width: "100%",
                display: "flex",
                height: "100%",
                justifyContent: "flex-end",
                alignItems: "center",
                padding: "1%",
              }}
            >
              <Box
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  display: isLoading ? "flex" : "",
                  justifyContent: isLoading ? "center" : "",
                  alignItems: isLoading ? "center" : "",
                }}
              >
                {isLoading && <CircularProgress />}
                {error && response && <p>Error: {error.message}</p>}
                {!isLoading && (!newButtons && !editButtons) && (
                  <div
                    style={{
                      height: "calc(100vh - 300px)",
                      display: "flex",
                      overflowY: "auto",
                      padding: 4,
                    }}
                  >
                    {!isLoading && !error && (
                      <TextField
                        id="textArea"
                        variant="standard"
                        placeholder="Type here...."
                        onChange={handleTextChange}
                        value={input}
                        style={{
                          width: "100%",
                          marginLeft: 10,
                          resize: "none"
                        }}
                        InputProps={{ disableUnderline: true }}
                        multiline
                      />
                    )}
                  </div>
                )}
                {!isLoading && !error && response && (newButtons || editButtons) && (
                  <div
                    style={{
                      overflowY: "auto",
                      height: "calc(100vh - 300px)",
                      paddingTop: 10,
                      paddingLeft: 10,
                      paddingRight: 10,
                      border: "none",
                    }}
                  >
                    {/* <pre
                      id="textArea"
                      contentEditable={true}
                      dangerouslySetInnerHTML={{
                        __html: replaceHeaders(response.trim()), // Trim white spaces from the response.
                      }}
                      onBlur={(e) => setResponse(e.target.innerHTML)}
                      onInput={handleTextChange}
                      style={{
                        whiteSpace: "pre-wrap",   // Wraps text, respects newlines but removes excess space.
                        wordWrap: "break-word",   // Prevents overflow of long words.
                        margin: 0,                // No additional margins.
                        padding: 0,               // No additional padding.
                        outline: "none",          // No outline while editing.
                        width: "100%",            // Full width for consistency.
                        fontFamily: "inherit",    // Inherits the font from parent (you can customize this).
                      }}
                    /> */}
                    <textarea
                      id="textArea"
                      value={currentText}
                      onChange={handleTextChange}
                      rows={10}
                      cols={50}
                      className="text-area"
                      placeholder="Type here...."
                      style={{
                        whiteSpace: "pre-wrap",   // Wraps text, respects newlines but removes excess space.
                        wordWrap: "break-word",   // Prevents overflow of long words.
                        margin: 0,                // No additional margins.
                        padding: 0,               // No additional padding.
                        outline: "none",          // No outline while editing.
                        width: "100%",            // Full width for consistency.
                        fontFamily: "inherit",    // Inherits the font from parent (you can customize this).
                        height: "calc(100vh - 320px)",
                        border: "none",
                        background: "none",
                        resize: "none",
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
              marginRight: "10px",
              marginLeft: "10px",
            }}
          >
            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >

              {buttonData?.map((buttons, i) => {
                  return (
                    <Button
                      variant="outlined"
                      style={{
                        marginBottom: "10px",
                        borderRadius: "50%",
                        width: "50px",
                        height: "50px",
                        minWidth: "50px",
                        backgroundColor: "#CDE0EA",
                        color: "#023246",
                        fontSize: "11px",
                      }}
                      key={i}
                      onClick={() =>
                        handlebuttonSubmit(buttons.name)}
                    >
                      {buttons.name}
                    </Button>
                  )
                })}
            </div>
            <MicrophoneInput
              data={data}
              getVoiceInput={getVoiceInput}
              isLoading={isLoading}
              isMicrophoneOn={isMicrophoneOn}
              onStatusChange={handleMicrophoneStatusChange}
              isBrainEngaged={isBrainEngaged}
              previousInput={previousInput}
              addPreviouseInput={addPreviouseInput}
              setResponse={setResponse}
              setInput={setInput}
              currentText={currentText}
              setCurrentText={setCurrentText}
              editButtons={editButtons}
              newButtons={newButtons}
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
            <Box sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}>
              <Tooltip title='Undo' arrow placement="top">
                <Button
                  variant="outlined"
                  style={{
                    marginBottom: "10px",
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    minWidth: "50px",
                    backgroundColor: "#CDE0EA",
                    color: "#023246",
                    fontSize: "11px",
                  }}
                  disabled={isLoading || isMicrophoneOn}
                  onClick={handleUndo}
                >
                  <RotateCcw />
                </Button>
              </Tooltip>
              <Tooltip title='Redo' arrow placement="top">
                <Button
                  variant="outlined"
                  style={{
                    marginBottom: "10px",
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    minWidth: "50px",
                    backgroundColor: "#CDE0EA",
                    color: "#023246",
                    fontSize: "11px",
                  }}
                  disabled={isLoading || isMicrophoneOn}
                  onClick={handleRedo}
                >
                  <RotateCw />
                </Button>
              </Tooltip>

            </Box>
          </Box>


        </Box>



        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 4,
          margin: 2
        }}>
          <Tooltip title='Save' arrow placement="top">
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
              onClick={((editButtons && newButtons) || (!newButtons && editButtons)) ? () => editButtonClick(editButtoniD) : (!editButtons && newButtons) ? () => handleSubmit() : console.warn("Button not clicked")}
            >
              <Save />
            </Button>
          </Tooltip>

          <Tooltip title='Remove' arrow placement="top">
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
              onClick={updateChatInputs}
            >
              <Remove />
            </Button>
          </Tooltip>

          <Tooltip title='Print' arrow placement="top">
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
              onClick={handleChatPrint}
            >
              <Print />
            </Button>
          </Tooltip>

          <Tooltip title='Copy' arrow placement="top">
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
              onClick={() => handleCopyToClipboard(response)}
            >
              <Copy />
            </Button>
          </Tooltip>

          <Tooltip title='EMR' arrow placement="top">
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
              onClick={() => alert('Emr Button Clicked !!!')}
            >
              <Emr />
            </Button>
          </Tooltip>

        </Box>

        {
          adminStatus &&
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
        }
        <AddpatientModal open={addpatientModal} onClose={() => setaddpatientmodal(false)} setPatientname={setPatientname} fetchRecord={fetchRecord} response={response} handleSubmit={handleSubmit} handlepatientsubmit={handlepatientsubmit} patientname={patientname} />
      </div>
    </>
  );
};

export default Chat;
