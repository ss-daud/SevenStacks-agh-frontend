import Modal from "@mui/material/Modal";
import { useStyles } from "../pages/styles/Styles";
import React, { useState, useEffect, useRef } from "react";
import { FastField, useFormik } from "formik";
import {
  TextField,
  Typography,
  IconButton,
  Button,
  InputAdornment,
} from "@mui/material";
import * as yup from "yup";
import axios from "axios";
import styled from "@emotion/styled";
import { Box } from "@mui/material";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import Name from "../assets/svgs/Name";
import Profile from "../assets/svgs/Profile";

import SuccessModal from "./SuccessModal";
import { AUTH_URL } from "../api";
import PasswordModal from "./modals/PasswordModal";
import { AlternateEmail } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 470,
  height: 600,
  padding: "60px 0",
  bgcolor: "background.paper",
  border: "1px solid #287094",
  borderRadius: 6,
};
const CustomTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    height: "42px",
    fontSize: "16px",
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: "28px",
    color: "777676",
    borderRadius: "8px",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "0px solid red", // set the border width when the input is focused
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "0px solid yellow", // remove the border by default
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    border: "0px solid blue", // set the border width on hover
  },
  width: "361px  !important",
  backgroundColor: "white",
  borderRadius: "8px",
  border: "1px solid #D9D9D9",
});

const validationSchema = yup.object({
  name: yup.string("Enter your full name").required("Enter your full name"),
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Enter a valid email")
    .required("Email is required"),
});

export default function ProfileModal({ open, onClose }) {
  const classes = useStyles();
  const [loader, setLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [fetchedData, setFetchedData] = useState(null);
  const [image, setImage] = useState(null);
  const [prevImage, setPrevImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      fetchDataFromAPI();
    }
  }, [open]);

  const fetchDataFromAPI = async () => {
    try {
      // Make an API call to fetch the user's data
      const token = localStorage.getItem("token");
      const response = await axios.get(`${AUTH_URL}api/user/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFetchedData(response?.data);

      if (response?.data?.user?.userImage) {
        setImage(
          `https://ai-emr.s3.amazonaws.com/profile-images/${response?.data?.user?.userImage}`
        );
        setPrevImage(
          `https://ai-emr.s3.amazonaws.com/profile-images/${response?.data?.user?.userImage}`
        );
      }

      formik.setValues({
        name: response?.data?.user?.name,
        email: response?.data?.user?.email,
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleClearImage = () => {
    setImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };
  const handleProfileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getBase64 = (file, cb) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result);
    };
    reader.onerror = function (error) {};
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const token = localStorage.getItem("token");
      if (image !== prevImage) {
        console.log("image");
        const formData = new FormData();
        if (image) {
          formData.append("image", image);
        }

        setLoader(true);
        try {
          const response = await axios.put(
            `${AUTH_URL}api/user/update`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Append the token to the headers
                "Content-Type": "application/json",
              },
            }
          );
          console.log(response);
          if (response?.data?.message == "User updated successfully") {
            setIsModalOpen(true);
            onClose();
          }
        } catch (error) {
          console.error("Error saving profile:", error);
        } finally {
          setLoader(false);
        }
      } else {
        console.log("dsata");
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);

        setLoader(true);
        try {
          const response = await axios.put(
            `${AUTH_URL}api/user/update`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Append the token to the headers
                "Content-Type": "application/json",
              },
            }
          );
          if (response?.data?.message == "User updated successfully") {
            onClose();
          }
        } catch (error) {
          if (error.response && error.response.data) {
            alert(error?.response?.data?.message);
          } else {
            console.error("Error saving profile:", error.message);
          }

          console.error("Error saving profile:", error);
        } finally {
          setLoader(false);
        }
      }
    },
  });

  const handleImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const tempExtention = file.name.split(".");
      const fileExtention = tempExtention[tempExtention.length - 1];
      const allowedFileExtentions = ["png", "jpg", "jpeg"];
      if (!allowedFileExtentions.includes(fileExtention)) {
        alert("enter valid file extension");
        return;
      }

      if (file.size > 200000) {
        alert("enter file size less then 200kb");
        return;
      } else {
        getBase64(file, (result) => {
          setImage(result);
        });
      }
    }
  };

  const handleClick = () => {
    setIsPasswordModalOpen(true);
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
          <form onSubmit={formik.handleSubmit}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center", // Center horizontally
                justifyContent: "center", // Center vertically
                marginBottom: 2,
              }}
            >
              <Typography
                sx={{
                  width: "100%",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: "32px",
                  lineHeight: "16px",
                  color: "#023246",
                  textAlign: "center",
                }}
              >
                My Profile
              </Typography>
            </Box>
            <Box
              onClick={handleProfileClick}
              sx={{
                display: "flex",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              {/* Conditionally render the selected image or profile icon */}
              {image ? (
                <div>
                  <img
                    src={image}
                    alt="Selected Profile"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                    }}
                  />
                  <input
                    accept="image/*"
                    id="icon-button-file"
                    type="file"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleImage}
                  />
                </div>
              ) : (
                <div>
                  <input
                    accept="image/*"
                    id="icon-button-file"
                    type="file"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleImage}
                  />
                  <Profile />
                </div>
              )}
            </Box>

            <Box>
              <Typography
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "32px",
                  color: "#287094",
                  marginBottom: 1,
                  marginLeft: 9,
                }}
              >
                Full Name
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 3,
              }}
            >
              <CustomTextField
                id="name"
                placeholder="Enter your full name "
                variant="outlined"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Name />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            {formik.touched.name && formik.errors.name ? (
              <Typography
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  lineHeight: "16px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "red",
                }}
              >
                {formik.errors.name}
              </Typography>
            ) : null}
            <Box>
              <Typography
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "32px",
                  color: "#287094",
                  marginBottom: 1,
                  marginLeft: 9,
                }}
              >
                Email
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CustomTextField
                id="email"
                placeholder="Enter your email "
                variant="outlined"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <EmailOutlined style={{ color: "#287094" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            {formik.touched.email && formik.errors.email ? (
              <Typography
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  lineHeight: "16px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "red",
                }}
              >
                {formik.errors.email}
              </Typography>
            ) : null}

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: 8,
                marginBottom: 2,
              }}
            >
              <Button
                variant="contained"
                onClick={onClose}
                style={{
                  marginBottom: 20,
                  backgroundColor: "#FFFFFF", // Replace with your custom color
                  color: "#287094",
                  width: 118,
                  height: 36,
                  borderRadius: 8,
                  marginRight: 20,
                  border: "1px solid #287094",
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                style={{
                  backgroundColor: "#023246", // Replace with your custom color
                  color: "white",
                  width: 118,
                  height: 36,
                  borderRadius: 8,
                }}
              >
                {loader ? (
                  <CircularProgress sx={{ color: "white" }} size={23} />
                ) : (
                  " Save"
                )}
              </Button>
            </Box>
          </form>

          <Box
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: 2,
            }}
          >
            <Typography
              onClick={handleClick}
              style={{
                color: "#023246",
                borderBottom: "3px solid #287094",
                cursor: "pointer",
              }}
            >
              Update Password
            </Typography>
          </Box>
        </Box>
      </Modal>
      <SuccessModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <PasswordModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        open={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}
