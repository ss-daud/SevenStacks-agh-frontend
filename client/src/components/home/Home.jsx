import React, { useEffect } from "react";
import Topbar from "../topbar/Topbar";
import { useTheme } from "../../context/ThemeContext";
import { Hidden, IconButton } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { MdOutlineLightMode } from "react-icons/md";
import { TopicProvider, useTopic } from "../../context/TopicContext";
import { ChatContextProvider, useChatContext } from "../../context/ChatContext";
import { SidebarProvider } from "../../context/SidebarContext";
import { SaveButtonProvider } from "../../context/SaveButtonContext";
const Home = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <SidebarProvider>
      <TopicProvider>
        <ChatContextProvider>
          <SaveButtonProvider >
          <div
            style={{
              height: "100vh",
              overflowX: "hidden",

              // backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
              color: darkMode ? "#ffffff" : "#000000",
            }}
          >
            <Topbar />
          </div>
          </SaveButtonProvider>
        </ChatContextProvider>
      </TopicProvider>
    </SidebarProvider>
  );
};

export default Home;
