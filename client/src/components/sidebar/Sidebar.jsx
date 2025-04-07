import { Typography, Box, Button, containerClasses } from "@mui/material";
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
import SidebarChat from "../SidebarChat/SidebarChat";
import { TextField } from '@mui/material';
import { useButton } from "../../context/SaveButtonContext";

const Sidebar = () => {
  const {
    input,
    setInput,
    brainInput,
    setBrainInput,
    setResponse,
    setReports,
    setPreviousInput,
    history,
    setHistory
  } = useChatContext();
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const {newButton} = useButton();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { topics } = useTopic();
  const [checked, setChecked] = useState(false)
  const [ids, setiDs] = useState([])
  const [searchText, setSearchText] = useState('');
  const [hideChat, setHideChat] = useState(true);
  const {falseEditButton, falseNewButton} = useButton();

  const handleChange = () => {
    if (ids.length === 0) {
      alert("Please select a conversation to delete");
      return;
    }
    setIsModalOpen(true);
  };
  const updateChatInputs = () => {
    setHistory([]);
    falseEditButton();
    falseNewButton();
    newButton();
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
  const [checkedItems, setCheckedItems] = useState({});

  const handleCheckChange = (id, e) => {
    const isChecked = e.checked;
    setCheckedItems((prev) => {
      const updatedItems = { ...prev };
      if (isChecked) {
        updatedItems[id] = true;
      } else {
        delete updatedItems[id];
      }
      return updatedItems;
    });

    setiDs((prev) => {
      if (e.checked) {
        return [...prev, id];
      } else {
        return prev.filter((idz) => idz !== id);
      }
    });
  };

  const handleTextChange = (e) => {
    setSearchText(e.target.value)
  }

  const filteredData = topics.filter((item) =>
    [item?.record.DOB, item?.record.MRN, item.record.Patient_Name].some((field) =>
      field?.toLowerCase().includes(searchText?.toLowerCase())
    )
  );



  return (
    <div
      style={{
        width: isSidebarOpen ? 300 : 50,
        height: "100%",
        display: "flex",
        flex: "1",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "width 0.5s ease",
      }}
    >
      <div>
        {isSidebarOpen ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: 'center',
              marginLeft: 2,
            }}
          >
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              size="small"
              value={searchText}
              onChange={handleTextChange}
              sx={{
                maxWidth: 300,
              }}
            />
            <Box
              onClick={updateChatInputs}
              style={{
                backgroundColor: "#023246",
                width: isSidebarOpen ? 60 : 0,
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
            </Box>

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
            <div className="flex">
              {
                hideChat ?
                  <div style={{ marginLeft: "22px" }} > <span onClick={() => setHideChat(!hideChat)} className="flex items-center gap-3 cursor-pointer" style={{ cursor: "pointer" }}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" /></svg> <span>Hide</span> </span></div>
                  :
                  <div style={{ marginLeft: "22px" }} > <span onClick={() => setHideChat(!hideChat)} className="flex items-center gap-3 cursor-pointer" style={{ cursor: "pointer" }}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" /></svg> <span>Show</span></span></div>
              }
            </div>
            {hideChat && filteredData.reverse().map((data, i) => {
              return (
                <SidebarChat
                  key={i}
                  id={data?._id}
                  text={data?.record?.Patient_Name}
                  color={data?.title?.color}
                  res={data?.patients}
                  patient={data?.patients}
                  handleCheckChange={handleCheckChange}
                  checked={checkedItems} // Use checked state from object
                  setChecked={setChecked}
                  ids={ids}
                  setiDs={setiDs}
                  dob={data?.record?.DOB}
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
              Clear Record
            </Typography>
          </Box>
        </div>
      )}

      <DeleteAll open={isModalOpen} onClose={() => setIsModalOpen(false)} ids={ids} setiDs={setiDs} setCheckedItems={setCheckedItems} />
    </div>
  );
};

export default Sidebar;
