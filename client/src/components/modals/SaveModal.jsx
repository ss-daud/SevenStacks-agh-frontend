import * as React from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

import CancelIcon from "@mui/icons-material/Cancel";
import { useStyles } from "../../pages/styles/Styles";
import Tick from "../../assets/svgs/Tick";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 440,
  height: 260,
  bgcolor: "background.paper",
  border: "2px solid #FFFFFF",
  borderRadius: 5,
  boxShadow: 24,
};

export default function SaveModal({ open, onClose, data }) {
  const [colors, setColors] = React.useState([
    "primary",
    "secondary",
    "tertiary",
  ]);
  const handleClose = () => {
    onClose();
  };
  const classes = useStyles();

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
              onClick={handleClose}
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
              marginTop: 6,
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
              Title save Successfuly
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 2,
            }}
          >
            {" "}
            <Tick />
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
