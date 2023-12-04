import React, { useEffect } from "react";
import Topbar from "../topbar/Topbar";
import { useTheme } from "../../context/ThemeContext";
import { IconButton } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { MdOutlineLightMode } from "react-icons/md";
import { TopicProvider, useTopic } from "../../context/TopicContext";
import { ChatContextProvider, useChatContext } from "../../context/ChatContext";
import { SidebarProvider } from "../../context/SidebarContext";
const Home = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <SidebarProvider>
      <TopicProvider>
        <ChatContextProvider>
          <div
            style={{
              width: "100%",
              height: "100vh",

              // backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
              color: darkMode ? "#ffffff" : "#000000",
            }}
          >
            <Topbar />
          </div>
        </ChatContextProvider>
      </TopicProvider>
    </SidebarProvider>
  );
};

export default Home;
