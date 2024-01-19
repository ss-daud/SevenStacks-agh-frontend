import React, { useState } from "react";
import { Typography, Button, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { AUTH_URL } from "../../api";
import Tick from "../../assets/svgs/Tick";
import "./verifyemail.css";

export default function Verify() {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  const handleSubmit = async () => {
    setLoader(true);
    try {
      const response = await axios.post(`${AUTH_URL}api/user/verify`, {
        token: token,
      });

      if (response.status === 200) {
        navigate("/");
      } else {
        alert("Verify your email address");
      }
    } catch (error) {
      console.error("Error during verification:", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <div className="form-container-verify">
        <div
          style={{
            width: 454,
            padding: "80px 0",
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
                fontWeight: 600,
                fontSize: "32px",
                lineHeight: "28px",
                color: "#023246",
              }}
            >
              Congratulations
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
                marginTop: 2,
                fontSize: "20px",
                lineHeight: "28px",
                color: "#287094",
              }}
            >
              Your account is verified
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: 4,
            }}
          >
            <Tick />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
            <Button
              variant="contained"
              onClick={handleSubmit} // Call the API when the button is clicked
              style={{
                marginBottom: 20,
                backgroundColor: "#023246",
                color: "white",
                width: 361,
                height: 48,
                borderRadius: 8,
              }}
            >
              {loader ? (
                <CircularProgress sx={{ color: "white" }} size={23} />
              ) : (
                "Login"
              )}
            </Button>
          </Box>
        </div>
      </div>
    </>
  );
}
