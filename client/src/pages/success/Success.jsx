import React from "react";
import { Typography } from "@mui/material";

import { Box, Button } from "@mui/material";
import "./success.css";
import { useNavigate } from "react-router-dom";
export default function Success() {
  const nav = useNavigate();
  const handleClick = () => {
    nav("/");
  };
  return (
    <>
      <div className="form-container-verify">
        <Box
          style={{
            width: 454,
            padding: "150px 0",
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
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: "23px",
                lineHeight: "28px",
                color: "#023246",
              }}
            >
              Account created successfully
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                marginTop: 2,
                fontSize: "14px",
                lineHeight: "28px",
                color: "#287094",
              }}
            >
              We have sent a verification email please check your inbox
            </Typography>
          </Box>

          <Box
            sx={{ display: "flex", justifyContent: "center", marginTop: 10 }}
          >
            <Button
              variant="contained"
              onClick={handleClick}
              style={{
                marginBottom: 20,
                backgroundColor: "#023246", // Replace with your custom color
                color: "white",
                width: 361,
                height: 48,
                borderRadius: 8,
              }}
            >
              Login
            </Button>
          </Box>
        </Box>
      </div>
    </>
  );
}
