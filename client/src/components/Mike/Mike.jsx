import React from "react";
import "./mike.css";
import Mic from "../../assets/svgs/Mic";
const Mike = () => {
  return (
    <>
      <div>
        <div className="container">
          <div className="btn ">
            <Mic />
            <div className="pulse-ring"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Mike;
