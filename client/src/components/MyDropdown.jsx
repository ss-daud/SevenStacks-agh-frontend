import React, { useState } from "react";
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import { Typography, Box } from "@mui/material";

const MyDropdown = ({ onLogout, onSettingsClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to track dropdown visibility

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility
  };
  return (
    <Dropdown
      isOpen={isDropdownOpen}
      toggle={toggleDropdown}
      placement="bottom-start" // Set placement to "bottom-start"
    >
      <DropdownToggle tag="span">
        <Typography
          sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            cursor: "pointer",
            marginLeft: 1,
            marginRight: 10,
            fontSize: "20px",
            lineHeight: "28px",
            color: "#023246",
          }}
        >
          My Account
        </Typography>
      </DropdownToggle>
      <DropdownMenu
        style={{
          marginTop: 20,
          width: "214px",
          height: "140px",
          marginRight: 50,
          borderRadius: 15,
        }}
      >
        <Box
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            onClick={onSettingsClick}
            sx={{
              width: 169,
              height: 32,
              border: "1px solid #D9D9D9",
              borderRadius: 3,
              display: "flex",
              cursor: "pointer",
              "&:hover": {
                // Apply hover effect
                backgroundColor: "rgb(40, 112, 148,0.40)",
              },
            }}
          >
            <SettingsIcon
              style={{
                fontSize: 15,
                marginTop: 7,
                marginLeft: 13,
                color: "#287094",
              }}
            />
            <Typography
              sx={{
                font: "Inter",
                fontWeight: 500,
                fontSize: "12px",
                lineHeight: "12px",
                marginTop: 1,
                marginLeft: 1,
              }}
            >
              Settings
            </Typography>
          </Box>
          <Box
            onClick={onLogout}
            sx={{
              marginTop: 2,
              width: 169,
              height: 32,
              border: "1px solid #D9D9D9",
              borderRadius: 3,
              display: "flex",
              cursor: "pointer",
              "&:hover": {
                // Apply hover effect
                backgroundColor: "rgb(40, 112, 148,0.40)",
              },
            }}
          >
            <LogoutIcon
              style={{
                fontSize: 15,
                marginTop: 7,
                marginLeft: 12,
                color: "#287094",
              }}
            />
            <Typography
              sx={{
                font: "Inter",
                fontWeight: 500,
                fontSize: "12px",
                lineHeight: "12px",
                marginTop: 1,
                marginLeft: 1,
              }}
            >
              Logout
            </Typography>
          </Box>
        </Box>
      </DropdownMenu>
    </Dropdown>
  );
};

export default MyDropdown;
