import React, { useState } from "react";
import DOMPurify from "dompurify";
import { Box, Typography } from "@mui/material";
import img from "../assets/imgs/Message.png";
import img1 from "../assets/imgs/Copy.png";
import img2 from "../assets/imgs/Printer.png";
import ClearIcon from "@mui/icons-material/Clear";
import { useChatContext } from "../context/ChatContext";

import DeleteConservation from "./DeleteConservation";
import { useTopic } from "../context/TopicContext";
import EllipsisText from "./text/EllipsiText";

const ConservationCard = ({ text, color, res, id }) => {
  const { topics } = useTopic();
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { setResponse } = useChatContext();

  const handleCopyToClipboard = (contentToCopy) => {
    console.log(contentToCopy);
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

  const handlePrint = () => {
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
          <pre>${res}</pre>
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
          backgroundColor: "rgba(88, 205, 47, 0.15)",
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
          <img src={img} alt="Brs" />
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
          {/* <Typography
            sx={{
              marginLeft: 2,
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "20px",
              color: "#000000",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              cursor: "pointer", // Change cursor on hover
              "&:hover": {
                whiteSpace: "normal",
                overflow: "visible",
              },
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isHovered
              ? text
              : text.split(" ").length > 2
              ? `${text.split(" ").slice(0, 2).join(" ")} ...`
              : text}
          </Typography> */}
        </Box>
        <Box
          onClick={handlePrint}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 6,
          }}
        >
          <img src={img2} alt="Brs" style={{ imageRendering: "pixelated" }} />
        </Box>
        <Box
          onClick={() => handleCopyToClipboard(res)}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={img1} alt="Brs" />
        </Box>
        <Box
          onClick={() => handleDelete()}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ClearIcon fontSize="13" style={{ marginLeft: 2 }} color="#000000" />
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
