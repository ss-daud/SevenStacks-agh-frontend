import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "../../context/ThemeContext";
import { MdOutlineLightMode } from "react-icons/md";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Name from "../../assets/svgs/Name";
import MyDropdown from "../MyDropdown";
import axios from "axios";
import Chat from "../chat/Chat";
import SettingModal from "../SettingModal";
import MicrophoneInput from "../MicrophoneInput";
import Sidebar from "../sidebar/Sidebar";
import { ChatContextProvider, useChatContext } from "../../context/ChatContext";
import { TopicProvider } from "../../context/TopicContext";
import { SidebarProvider, useSidebar } from "../../context/SidebarContext";
import { AUTH_URL } from "../../api";
import GreetComp from "../Greeting/GreetComp";
const Topbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setusername] = useState("");
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [image, setImage] = useState();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const handleSettingsChange = () => {
    setIsModalOpen(true);
  };
  const handleLogout = () => {
    localStorage.clear();

    navigate("/");
  };
console.log("username", username);
  const fetchDataFromAPI = async () => {
    try {
      // Make an API call to fetch the user's data
      const token = localStorage.getItem("token");
      const response = await axios.get(`${AUTH_URL}api/user/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data?.user?.userImage) {
        setImage(
          `https://ai-emr.s3.amazonaws.com/profile-images/${response?.data?.user?.userImage}`
        );
      }
      else if (response?.data.user?.username){
        setusername(response?.data.user?.username);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };
  useEffect(() => {
    fetchDataFromAPI();
  }, []);

  return (
    <>
      <TopicProvider>
        <ChatContextProvider>
          <div style={{ width: "100%", height: "100vh" }}>
            <div
              style={{
                height: 50,
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "2px solid #F6F6F6",
                marginLeft: 50,
              }}
            >
              {/* <IconButton
              sx={{ marginRight: 2 }}
              onClick={toggleDarkMode}
              color="inherit"
            >
              {darkMode ? <DarkModeIcon /> : <MdOutlineLightMode />}
            </IconButton> */}
            <GreetComp username={username}/>
            <div style={{display: 'flex'}}>
            <div
                style={{
                  height: 31,
                  width: 31,
                  borderRadius: "50%",
                  border: "1px solid #023246",
                  display: "flex",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {image ? (
                  <img
                    src={image}
                    alt="Profile"
                    style={{
                      width: "31px",
                      height: "31px",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  <Name />
                )}
              </div>
              <MyDropdown
                onSettingsClick={handleSettingsChange}
                onLogout={handleLogout}
              />
            </div>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div
                style={{
                  width: isSidebarOpen ? 300 : 50,
                  marginTop: 10,
                  height: "calc(100vh-100px)",
                }}
              >
                <Sidebar />
              </div>
              <div
                style={{
                  width: "100%",
                  height: "100%",
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
        </ChatContextProvider>
      </TopicProvider>
    </>
  );
};

export default Topbar;
