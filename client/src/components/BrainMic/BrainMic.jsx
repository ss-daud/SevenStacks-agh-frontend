import React from "react";
import "./brainmic.css";

import Bmic from "../../assets/svgs/Bmic";
const BrainMic = () => {
  return (
    <>
      <div>
        <div className="container1">
          <div className="btn1 ">
            <Bmic />
            <div className="pulse-ring1"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrainMic;
