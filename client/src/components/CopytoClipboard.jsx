import { useState } from "react";
import Copy from "../assets/svgs/Copy";
import { Box } from "@mui/material";

export default function ClipboardCopy({ copyText }) {
  const [isCopied, setIsCopied] = useState(false);

  async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  const handleCopyClick = () => {
    copyTextToClipboard(copyText)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Box onClick={handleCopyClick} sx={{ cursor: "pointer" }}>
        {isCopied ? "Copied" : <Copy />}
      </Box>
    </div>
  );
}
