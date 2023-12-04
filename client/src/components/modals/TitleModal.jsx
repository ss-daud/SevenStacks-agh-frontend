import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import Typography from "@mui/material/Typography";
import axios from "axios";
import CancelIcon from "@mui/icons-material/Cancel";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, useEffect } from "react";
import { useStyles } from "../../pages/styles/Styles";
import SaveModal from "./SaveModal";
import useOpenAI from "../../openai/OpenAi";
import { AUTH_URL } from "../../api";

import { useTopic } from "../../context/TopicContext";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 720,
  height: 280,
  bgcolor: "background.paper",
  border: "2px solid #FFFFFF",
  borderRadius: 5,
  pad: 4,
};

export default function TitleModal({ open, onClose, response }) {
  const { addTopic } = useTopic();
  const [loader, setLoader] = useState(false);
  const { data, isLoading, error, fetchData } = useOpenAI();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const classes = useStyles();
  const [tags, setTags] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const handleSaveModalClose = () => {
    setIsModalOpen(false); // Close the TitleModal
  };
  const getTitle = async () => {
    try {
      const reponse = await axios.get("http://localhost:8091/api/title/get");
      setTags(reponse?.data?.title);
    } catch (err) {}
  };
  useEffect(() => {
    getTitle();
  }, []);

  useEffect(() => {
    if (data) {
      const words = data.match(/[A-Za-z]+/g);

      if (words) {
        const newTags = words.slice(0, 5);
        setTags(newTags);
      }
    }
  }, [data]);
  const handleChipClick = (value) => {
    setSelectedTitle(value === selectedTitle ? null : value);
  };
  const handleSubmit = async () => {
    setLoader(true);
    const apiObject = { title: selectedTitle._id, response: response };
    console.log(apiObject);
    const token = localStorage.getItem("token");
    console.log(token);
    try {
      const response = await axios.post(
        `${AUTH_URL}api/topic/create`,
        apiObject,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Append the token to the headers
            "Content-Type": "application/json",
          },
        }
      );
      if (response?.data?.topic) {
        addTopic(response?.data?.topic);
      }
      setIsModalOpen(true);
      onClose();
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div>
      <Modal
        keepMounted
        open={open}
        onClose={onClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 2,
              marginRight: 2,
            }}
          >
            <CancelIcon
              onClick={onClose}
              style={{
                fontSize: 17,
                color: "#287094",
                cursor: "pointer",
              }}
            />
          </Box>
          <Box
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignitem: "center",
              marginBottom: "40px",
            }}
          >
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                marginTop: 3,
                fontSize: "30px",
                lineHeight: "16px",
                color: "#023246",
              }}
            >
              Suggested Titles
            </Typography>
          </Box>
          <Stack
            mt="20px"
            direction="row"
            spacing={5}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "space-between",
              marginBottom: "40px",
            }}
          >
            {tags.map((value, index) => (
              <Chip
                key={index}
                label={value.name}
                onClick={() => handleChipClick(value)}
                style={{
                  color: "white",
                  width: "100px",
                  backgroundColor: `${
                    selectedTitle === value ? value.color + "85" : value.color
                  }  `,
                  color: "black",
                  height: "35px",
                }}
              />
            ))}
          </Stack>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginY: 10,
            }}
          >
            <Box
              onClick={onClose}
              style={{
                backgroundColor: "#FFFFFF",
                width: "118px",
                height: "36px",
                display: "flex",
                justifyContent: "center",
                border: "1px solid 287094",
                alignItems: "center",
                borderRadius: "5px",
                marginRight: "20px",
              }}
            >
              <Typography
                style={{
                  color: "black",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Cancel
              </Typography>
            </Box>

            <Box
              onClick={handleSubmit}
              style={{
                cursor: "pointer",
                backgroundColor: "#023246",
                width: "118px",
                height: "36px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "5px",
              }}
            >
              {loader ? (
                <CircularProgress sx={{ color: "white" }} size={23} />
              ) : (
                <Typography
                  style={{
                    color: "white",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {" "}
                  Save
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Modal>
      <SaveModal
        open={isModalOpen}
        onClose={handleSaveModalClose}
        data={response}
      />
    </div>
  );
}
