import React, { useEffect, useRef, useState } from "react";
import { AUTH_URL } from "../../api";
import { Grid, Button, Typography, Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { useStyles } from "../styles/Styles";
import axios from "axios";
import "./otp.css";

function ForgetOTP() {
  const navigate = useNavigate();
  const classes = useStyles();

  const [otp, setOTP] = useState(["", "", "", ""]);
  const inputRefs = useRef([
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
  ]);
  const handleOTPChange = (event, index) => {
    // Make a copy of the OTP array to avoid mutating state directly
    const newOTP = [...otp];
    const inputValue = event.target.value;

    if (/^\d$|^$/.test(inputValue)) {
      // Only allow a single digit (0-9)
      newOTP[index] = inputValue;
      setOTP(newOTP);

      if (index < otp.length - 1 && inputValue !== "") {
        // Move to the next input field if a digit is entered and it's not the last field
        inputRefs.current[index + 1].current.focus();
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    const email = localStorage.getItem("email");

    const apiUrl = `${AUTH_URL}api/user/otp`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, otp: otpValue }),
      });

      if (response.ok) {
        navigate("/resetpassword");
      } else {
        alert("otp verification failed");
        console.error("OTP verification failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  // RESEND OTP
  const resendOTPHandler = async () => {
    // GET EMAIL FROM LOCAL STORAGE
    const _email = localStorage.getItem("email");

    // Make a POST request to check if the email exists
    const response = await axios.post(`${AUTH_URL}api/user/forgotPassword`, {
      email: _email,
    });

    if (response.data) {
      alert("otp has been send again on your registered email address");
    } else {
      // If the email does not exist, show an error message or handle it as needed
      alert("Email not found. Please check your email address.");
    }
  };

  return (
    <>
      <div className="form-container-otp">
        <form
          style={{
            width: 454,
            padding: "100px 0",
            border: "1px solid #D9D9D9",
            borderRadius: "20px",
            backgroundColor: "#FFFFFF",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontWeight: 700,
                fontSize: "28px",
                lineHeight: "28px",
                marginBottom: 2,
                color: "#023246",
              }}
            >
              OTP Verification
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "32px",
                marginBottom: 4,
                color: "#287094",
              }}
            >
              Enter OTP code
            </Typography>
          </Box>
          <Grid item xs={12} className={classes.itemCenter}>
            <div style={{ display: "flex", gap: "20px" }}>
              {otp.map((number, i) => (
                <div
                  style={{
                    color: "#000",
                    borderRadius: "14px",

                    background: "#F6F6F6",
                    width: "58px",
                    height: "58px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  key={i}
                >
                  <input
                    type="number"
                    value={number}
                    onChange={(e) => handleOTPChange(e, i)}
                    maxLength="1"
                    style={{
                      outline: "none",
                      fontSize: "25px",
                      fontWeight: "500",
                      width: "100%",
                      textAlign: "center",
                      height: "100%",
                      backgroundColor: "transparent", // Set the input background to transparent
                      border: "2px solid #287094", // Add the border to the input
                      borderRadius: "12px", // Adjust the border radius as needed
                    }}
                    ref={inputRefs.current[i]}
                  />
                </div>
              ))}
            </div>
          </Grid>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: 4,
            }}
          >
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "32px",
                color: "#287094",
              }}
            >
              Didn't recieve code?
            </Typography>

            <div onClick={resendOTPHandler}>
              <Typography
                sx={{
                  font: "Poppins",
                  fontWeight: 700,
                  fontSize: "17px",
                  lineHeight: "32px",
                  color: "#023246",
                  marginLeft: 0.5,
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Resend
              </Typography>
            </div>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              marginTop: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "32px",
                color: "#287094",
              }}
            >
              OR
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: 4,
            }}
          >
            <Button
              variant="contained"
              type="submit"
              onClick={handleSubmit}
              style={{
                backgroundColor: "#023246", // Replace with your custom color
                color: "white",
                width: 361,
                height: 48,
                borderRadius: 8,
              }}
            >
              Submit
            </Button>
          </Box>
        </form>
      </div>
    </>
  );
}

export default ForgetOTP;
