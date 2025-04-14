import * as React from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useStyles } from "../pages/styles/Styles";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AUTH_URL } from "../api";
import CircularProgress from "@mui/material/CircularProgress";
import decryptionofdata from '../decryption/decryption'

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 550,
  height: 250,
  bgcolor: "background.paper",
  border: "2px solid #287094",
  borderRadius: 5,
  boxShadow: 24,
  pad: 4,
};

export default function KeepMountedModal({ open, onClose }) {
  const classes = useStyles();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    const email = localStorage.getItem("email");
    setLoader(true);
    try {
      // Create a data object with the email
      const data = {
        email: email,
      };
      const encrypt = await axios.delete(`${AUTH_URL}api/user/delete`, { data });
      const response = await decryptionofdata(encrypt.data);
      if (response.success) {
        alert(response.message); 
        handleLogout();
      }
      else{
        alert(response.message);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
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
          <Typography
            sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              marginTop: 3,
              marginLeft: 5,
              fontSize: "24px",
              lineHeight: "16px",
              color: "#023246",
            }}
          >
            Delete Account
          </Typography>
          <Typography
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              marginTop: 6,
              marginBottom: 3,
              fontSize: "20px",
              lineHeight: "32px",
              color: "000000",
            }}
          >
            Are you sure you want to delete account?
          </Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              onClick={handleDeleteAccount}
              variant="contained"
              className={classes.signUpButton}
              style={{ marginRight: 28, backgroundColor: "#FF0000" }}
            >
              {loader ? (
                <CircularProgress sx={{ color: "white" }} size={23} />
              ) : (
                " Yes"
              )}
            </Button>
            <Button
              onClick={onClose}
              variant="contained"
              className={classes.signUpButton}
              style={{ backgroundColor: "#023246" }}
            >
              No
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
