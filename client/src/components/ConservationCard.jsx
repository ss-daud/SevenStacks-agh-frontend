import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import img from "../assets/imgs/Message.png";
import img1 from "../assets/imgs/Copy.png";
import img2 from "../assets/imgs/Printer.png";
import ClearIcon from "@mui/icons-material/Clear";
import { useChatContext } from "../context/ChatContext";

import DeleteConservation from "./DeleteConservation";
import { useTopic } from "../context/TopicContext";
import EllipsisText from "./text/EllipsiText";
import Message from "../assets/svgs/Message";
import Copy from "../assets/svgs/Copy";
import Print from "../assets/svgs/Print";
import Save from "../assets/svgs/Save";
import Remove from "../assets/svgs/Remove";
import axios from "axios";
import {AUTH_URL} from "../api/index.js";

const ConservationCard = ({ text, color, res, id }) => {
  const { topics, fetchTopics } = useTopic();
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { setResponse } = useChatContext();

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

    const handleSave = async (id) => {

        // Get the current content of the big textbox
        let currentContent = document.querySelector('#textArea')?.innerText;
        if(!currentContent) {
            currentContent = res;
        }

        const token = localStorage.getItem("token");
        try {

            // Update the record
            const apiObject = {
                response: currentContent
            };

            const response = await axios.put(`${AUTH_URL}api/topic/UpdateTopic/${id}`,
                apiObject,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Append the token to the headers
                        "Content-Type": "application/json",
                    },
                });
            if (response.status === 200) {
                alert("record save successfully.");
                // success
                await fetchTopics();

            }
        } catch (error) {
            console.error("Error updating record:", error);
        }

    };

  const handlePrint = async (id) => {
      // Get the current content of the big textbox
      let currentContent = document.querySelector('#textArea')?.innerText;
    if(!currentContent) {
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
  const handleDelete = async () => {
    setIsModalOpen(true);
    // try {
    //   const response = await axios.delete(
    //     `http://localhost:8091/api/topic/delete/${id}`
    //   );
    //   console.log("Record deleted successfully:", response);
    // } catch (error) {
    //   console.error("Error deleting record:", error);
    // }
  };

  return (
    <div>
      <Box
        sx={{
          margin: 3,
          padding: 2,
          width: 247,
          height: 49,
          display: "flex",
          borderRadius: "10px",
          backgroundColor: `${color}20`,
          justifyContent: "space-between",
          alignItems: "center",
        }}
        style={{ cursor: "pointer" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <Message />
        </Box>
        <Box
          onClick={() => setResponse(res)}
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <EllipsisText text={text} />
        </Box>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
            <Box
                onClick={() => handleSave(id)}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Save />
            </Box>
          <Box
            onClick={() => handlePrint(id)}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Print />
          </Box>
          <Box
            onClick={() => handleCopyToClipboard(res)}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Copy />
          </Box>
          <Box
            onClick={() => handleDelete()}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Remove />
          </Box>
        </Box>
      </Box>
      <DeleteConservation
        id={id}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ConservationCard;
