import { Typography } from "@mui/material";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { MdOutlineLightMode } from "react-icons/md";
import Chat from "./chat/Chat";
import { Box } from "@mui/material";
import Name from "../assets/svgs/Name";
import { useNavigate } from "react-router-dom";
import MyDropdown from "./MyDropdown";
import SettingModal from "./SettingModal";
import { useTheme } from "../context/ThemeContext";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import IconButton from "@mui/material/IconButton";
import DarkModeIcon from "@mui/icons-material/DarkMode";
const Account = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSettingsChange = () => {
    setIsModalOpen(true); //
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <div
        style={{
          width: "100%",
          height: "100vh",
          backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
          color: darkMode ? "#ffffff" : "#000000",
        }}
      >
        <div>
          {/* <Box
            sx={{
              height: 90,
              width: 35,
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <IconButton
              sx={{ marginRight: 2 }}
              onClick={toggleDarkMode}
              color="inherit"
            >
              {darkMode ? <DarkModeIcon /> : <MdOutlineLightMode />}
            </IconButton>

            <Box
              sx={{
                border: "1px solid #023246",
                borderRadius: 9,
                display: "flex",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Name />
            </Box>
            <MyDropdown
              onSettingsClick={handleSettingsChange}
              onLogout={handleLogout}
            />
          </Box> */}
          <div
            style={{
              display: "flex",
            }}
          >
            <div
              style={{
                borderRight: "2px solid #F6F6F6",
                padding: "2px",
              }}
            >
              <Sidebar />
            </div>
            <div
              style={{
                padding: "2px",
                borderTop: "2px solid #F6F6F6",
                width: "100%",
              }}
            >
              <Chat />
            </div>
          </div>
          <SettingModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default Account;
