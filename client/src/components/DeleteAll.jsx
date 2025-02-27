import * as React from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useStyles } from "../pages/styles/Styles";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { TopicProvider, useTopic } from "../context/TopicContext";
import { AUTH_URL } from "../api";
import { useChatContext } from "../context/ChatContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  height: 250,
  bgcolor: "background.paper",
  border: "2px solid #FFFFFF",
  borderRadius: 5,
  boxShadow: 24,
  pad: 4,
};

export default function DeleteAll({ open, onClose, id, ids, setiDs, setCheckedItems }) {
  const { topics, removeTopic, fetchTopics } = useTopic();
  const {
    input,
    brainInput,
    setBrainInput,
    setInput,
    response,
    setResponse,
    reports,
    setReports,
    previous,
    setPrevious,
  } = useChatContext();
  const classes = useStyles();
  const token = localStorage.getItem("token");
  const handleDelete = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: ids
      };

      const response = await axios.delete(
        `${AUTH_URL}api/topic/topics/delete`,
        config
      );

      if (response.status === 200) {
        setiDs([]);
        setCheckedItems();
        fetchTopics();
        onClose();
        setInput("");
        setBrainInput("");
        setResponse("");
        setReports("");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
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
          <Typography
            sx={{
              font: "Inter",
              fontWeight: 500,
              marginTop: 5,
              marginLeft: 5,
              fontSize: "32px",
              lineHeight: "16px",
              color: "#023246",
            }}
          >
            Clear Conversation
          </Typography>
          <Typography
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              font: "Poppins",
              fontWeight: 500,
              marginTop: 6,
              marginBottom: 3,
              fontSize: "20px",
              lineHeight: "32px",
              color: "#287094",
            }}
          >
            Are you sure you want to clear conversation?
          </Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              onClick={handleDelete}
              className={classes.signUpButton}
              style={{ marginRight: 20, backgroundColor: "#FF0000" }}
            >
              <Typography> Yes</Typography>
            </Button>
            <Button
              onClick={onClose}
              variant="contained"
              className={classes.signUpButton}
              style={{ backgroundColor: "#023246" }}
            >
              <Typography> No</Typography>
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
