import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useStyles } from "../pages/styles/Styles";
import CancelIcon from "@mui/icons-material/Cancel";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { RiDeleteBin6Line } from "react-icons/ri";

import ProfileModal from "./ProfileModal";
import { useState } from "react";
import KeepMountedModal from "./Modal";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 220,
  bgcolor: "background.paper",
  border: "2px solid #287094",
  borderRadius: 5,

  pad: 4,
};

export default function SettingModal({ open, onClose }) {
  const classes = useStyles();
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const openDeleteModal = () => {
    setDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setDeleteModal(false);
  };
  const openProfileModal = () => {
    setProfileModalOpen(true);
    onClose();
  };

  const closeProfileModal = () => {
    setProfileModalOpen(false);
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
          <Box>
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                marginTop: 3,
                marginLeft: 5,
                fontSize: "32px",
                lineHeight: "16px",
                color: "#023246",
              }}
            >
              Settings
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginTop: 3,
              marginLeft: 5,
            }}
            onClick={openProfileModal}
          >
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: "20px",
                lineHeight: "16px",
                color: "#023246",
                marginRight: 2,
                cursor: "pointer",
              }}
            >
              My profile
            </Typography>
            <KeyboardArrowRightIcon
              onClick={openProfileModal}
              style={{
                fontSize: 20,
                marginLeft: 370,
                color: "black",
                cursor: "pointer",
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginTop: 3,
              marginLeft: 5,
            }}
            onClick={openDeleteModal}
          >
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: "20px",
                lineHeight: "16px",
                color: "red",
                marginRight: 2,
                cursor: "pointer",
              }}
            >
              Delete Account
            </Typography>
            <RiDeleteBin6Line
              fontSize={18}
              onClick={openDeleteModal}
              style={{
                fontSize: 20,
                marginLeft: 320,
                color: "red",
                cursor: "pointer",
              }}
            />
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          ></Box>
        </Box>
      </Modal>
      <ProfileModal open={isProfileModalOpen} onClose={closeProfileModal} />
      <KeepMountedModal open={deleteModal} onClose={closeDeleteModal} />
    </div>
  );
}
