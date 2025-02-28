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
  const [checked, setChecked] = useState(false)
  const [ids, setiDs] = useState([])
  const [searchText, setSearchText] = useState('');

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
            {filteredData.map((data, i) => {
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
              Clear Chat
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

      <DeleteAll open={isModalOpen} onClose={() => setIsModalOpen(false)} ids={ids} setiDs={setiDs} setCheckedItems={setCheckedItems} />
    </div>
  );
};

export default Sidebar;
