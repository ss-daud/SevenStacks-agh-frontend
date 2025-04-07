import React from "react";
import PropTypes from "prop-types";
import Tooltip from "@mui/material/Tooltip";
import "./ellipsitext.css";

const EllipsisText = ({ text, dob }) => {
  return (
    <Tooltip title={text} arrow placement="top" className="ellipisis-container">
    <div>
      <div className="ellipsis-text">
        {text.length > 8 ? text.slice(0, 8) + "..." : text}
      </div>
      <div className="ellipsis-dob">
        {dob}
      </div>
    </div>

    </Tooltip>
  );
};

EllipsisText.propTypes = {
  text: PropTypes.string.isRequired,
};

export default EllipsisText;
