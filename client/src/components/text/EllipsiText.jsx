import React from "react";
import PropTypes from "prop-types";
import Tooltip from "@mui/material/Tooltip";
import "./ellipsitext.css";

const EllipsisText = ({ text }) => {
  return (
    <Tooltip title={text} arrow placement="top">
      <div className="ellipsis-text">
        {text.length > 12 ? text.slice(0, 12) + "..." : text}
      </div>
    </Tooltip>
  );
};

EllipsisText.propTypes = {
  text: PropTypes.string.isRequired,
};

export default EllipsisText;
