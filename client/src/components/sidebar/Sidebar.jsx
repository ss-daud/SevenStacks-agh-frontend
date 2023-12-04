import { Typography, Box, Button } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import Close from "../../assets/svgs/Close";
import ConservationCard from "../ConservationCard";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import DeleteConservation from "../DeleteConservation";
import AddIcon from "@mui/icons-material/Add";
import "./sidebar.css";
import axios from "axios";
import { useTopic } from "../../context/TopicContext";
import { useChatContext } from "../../context/ChatContext";
import DeleteAll from "../DeleteAll";
import { useSidebar } from "../../context/SidebarContext";
import img1 from "../../assets/imgs/toggle.png";

const Sidebar = () => {
  const {
    input,
    setInput,
    brainInput,
    setBrainInput,
    setResponse,
    setReports,
    setPreviousInput,
  } = useChatContext();
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { topics } = useTopic();

  const handleChange = () => {
    setIsModalOpen(true);
  };
  const updateChatInputs = () => {
    setInput("");
    setBrainInput("");
    setResponse("");
    setReports("");
    setPreviousInput("");
  };
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div
      style={{
        width: isSidebarOpen ? 300 : 50, // Adjust width based on the sidebar state
        height: "100%",
        display: "flex",
        flex: "1",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "width 0.5s ease", // Add transition for smooth animation
      }}
    >
      <div>
        {isSidebarOpen ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <Box
              onClick={updateChatInputs}
              style={{
                backgroundColor: "#023246",
                width: isSidebarOpen ? 180 : 0,
                height: 49,
                borderRadius: 10,
                marginLeft: 24,
                border: "1px solid #559BB9 ",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <AddIcon
                color="white"
                style={{ marginRight: 2, fontSize: "20px" }}
              />
              <Typography
                style={{ font: "Roboto", fontWeight: 400, fontSize: "14px" }}
              >
                New chat
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={toggleSidebar}
              style={{
                backgroundColor: "#F6F6F6",
                color: "#023246",
                borderRadius: 12,
                marginLeft: 4,

                border: "1px solid #559BB9 ",
                transition: "width 0.5s ease", // Add transition for smooth closing
              }}
            >
              <Close />
            </Button>
          </Box>
        ) : (
          <Box onClick={toggleSidebar} style={{}}>
            <img src={img1} alt="tog" />
          </Box>
        )}
      </div>

      {isSidebarOpen && (
        <div
          style={{
            flex: 0.9,
            overflowY: "hidden",
          }}
        >
          <div
            style={{
              maxHeight: "calc(100vh - 250px)",
              marginTop: 20,
              overflowY: "auto",
              scrollbarWidth: "thin",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {" "}
            <style>
              {`
              ::-webkit-scrollbar {
                width: 12px; /* Width of the entire scrollbar */
              }
              ::-webkit-scrollbar-track {
                background: #f1f1f1; /* Color of the track */
                border-radius: 20px; /* Curved ends for the track */
              }
              ::-webkit-scrollbar-thumb {
                background: #023246; /* Color of the scrollbar thumb */
                border-radius: 20px; /* Roundness of the thumb */
              }
              ::-webkit-scrollbar-thumb:hover {
                background: #555; /* Color of the thumb on hover */
              }
            `}
              `{" "}
            </style>
            <Box style={{ marginLeft: 24 }}>
              <Typography
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "17px",
                  color: "#023246",
                }}
              >
                Current
              </Typography>
            </Box>
            {topics.map((data, i) => {
              return (
                <ConservationCard
                  key={i}
                  id={data?._id}
                  text={data?.heading}
                  color={data?.title?.color}
                  res={data?.response}
                />
              );
            })}
          </div>
        </div>
      )}
      {isSidebarOpen && (
        <div
          style={{
            width: "100%",
            bottom: 0,
            marginTop: 30,
            justifyContent: "flex-end",
          }}
        >
          <Box
            onClick={handleChange}
            style={{
              paddingLeft: "15px",
              display: "flex",
              alignItems: "center",
              paddingBottom: "20px",
            }}
          >
            <RiDeleteBin6Line
              style={{
                marginRight: 14,
                color: "red",
                cursor: "pointer",
              }}
            />
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "17px",
                color: "#023246",
                cursor: "pointer",
              }}
            >
              Clear conversations
            </Typography>
          </Box>
          <Box style={{ paddingLeft: "16px" }} onClick={handleLogout}>
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "17px",
                color: "#023246",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <LogoutIcon
                style={{ fontSize: 16, marginRight: 14, cursor: "pointer" }}
              />
              Log out
            </Typography>
          </Box>
        </div>
      )}

      <DeleteAll open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Sidebar;
