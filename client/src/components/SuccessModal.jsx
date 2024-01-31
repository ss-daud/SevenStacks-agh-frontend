import * as React from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useStyles } from "../pages/styles/Styles";
import Tick from "../assets/svgs/Tick";
import CancelIcon from "@mui/icons-material/Cancel";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 441,
  height: 266,
  bgcolor: "background.paper",
  border: "2px solid #287094",
  borderRadius: 5,
  boxShadow: 24,
};

export default function SuccessModal({
  open,
  onClose,
  isModalOpen,
  setIsModalOpen,
}) {
  const classes = useStyles();

  return (
    <div>
      <Modal
        keepMounted
        open={open}
        onClose={() => setIsModalOpen(false)}
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
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 4,
            }}
          >
            <Tick />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: "20px",
                lineHeight: "16px",
                color: "#287094",
              }}
            >
              Image uploaded Successfully
            </Typography>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
