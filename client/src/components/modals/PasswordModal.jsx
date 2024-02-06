import Modal from "@mui/material/Modal";
import { useStyles } from "../../pages/styles/Styles";
import React, { useState } from "react";
import { useFormik } from "formik";
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
import CircularProgress from "@mui/material/CircularProgress";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { AUTH_URL } from "../../api";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 470,
  height: 600,
  padding: "80px 0",
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
  password: yup
    .string("Enter your password")
    .min(8, "password should be of minimum 8 characters length")
    .required("password is required"),
  newPassword: yup
    .string("Enter your password")
    .min(8, "password should be of minimum 8 characters length")
    .required("password is required"),
  confirmPassword: yup
    .string("Enter your password")
    .min(8, "password should be of minimum 8 characters length")
    .required("password is required"),
});

export default function PasswordModal({ open, onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showconfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((show) => !show);
  };

  const handleClickShowNewPassword = () => {
    setShowNewPassword((show) => !show);
  };

  const handleClose = () => {
    onClose();
    formik.resetForm();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();

      const activeElement = document.activeElement;
      const inputs = document.getElementsByTagName("input");

      const currentIndex = Array.from(inputs).indexOf(activeElement);

      const nextIndex = currentIndex + 1 < inputs.length ? currentIndex + 1 : 0;
      inputs[nextIndex].focus();
    }
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (values.newPassword !== values.confirmPassword) {
        alert("Passwords do not match");
      } else {
        const apiObject = {
          password: values.password,
          newPassword: values.newPassword,
        };

        setLoader(true);
        const token = localStorage.getItem("token");
        try {
          const response = await axios.post(
            `${AUTH_URL}api/user/updatePassword`,
            apiObject,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Append the token to the headers
                "Content-Type": "application/json",
              },
            }
          );
          if (response.status == 200) {
            onClose();
            resetForm();
          }
        } catch (err) {
          alert(err?.response?.data?.message);
        } finally {
          setLoader(false);
        }
      }
    },
  });

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
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 5,
              }}
            >
              <Typography
                sx={{
                  width: "100%",
                  font: "Inter",
                  fontWeight: "550",
                  fontSize: "24px",
                  lineHeight: "16px",
                  color: "#023246",
                  textAlign: "center",
                }}
              >
                Update Password
              </Typography>
            </Box>
            <Box sx={{ width: "100%", marginBottom: 1 }}>
              <Typography
                sx={{
                  font: "Poppins",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "32px",
                  color: "#287094",
                  marginTop: 1,
                  marginLeft: 7,
                }}
              >
                Current Password
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CustomTextField
                id="password"
                onKeyDown={handleKeyDown}
                type={showPassword ? "text" : "password"}
                variant="outlined"
                placeholder="Enter your password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        style={{ color: "#287094", fontSize: "21px" }}
                      >
                        {!showPassword ? (
                          <VisibilityOffOutlinedIcon
                            sx={{ height: "18.5px", width: "21px" }}
                          />
                        ) : (
                          <VisibilityOutlinedIcon
                            sx={{
                              height: "18.5px !important",
                              width: "21px !important",
                              padding: "0px",
                              fontSize: "16px",
                            }}
                          />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            {formik.touched.password && formik.errors.password ? (
              <Typography
                sx={{
                  font: "Poppins",
                  fontSize: "12px",
                  lineHeight: "16px",
                  display: "flex",
                  justifyContent: "flex-start",
                  marginLeft: "55px",
                  color: "red",
                }}
              >
                {formik.errors.password}
              </Typography>
            ) : null}
            <Box sx={{ width: "100%", marginBottom: 1 }}>
              <Typography
                sx={{
                  font: "Poppins",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "32px",
                  color: "#287094",
                  marginTop: 1,
                  marginLeft: 7,
                }}
              >
                New Password
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CustomTextField
                id="newPassword"
                onKeyDown={handleKeyDown}
                type={showNewPassword ? "text" : "password"}
                variant="outlined"
                placeholder="Enter your password"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowNewPassword}
                        style={{ color: "#287094", fontSize: "21px" }}
                      >
                        {!showNewPassword ? (
                          <VisibilityOffOutlinedIcon
                            sx={{ height: "18.5px", width: "21px" }}
                          />
                        ) : (
                          <VisibilityOutlinedIcon
                            sx={{
                              height: "18.5px !important",
                              width: "21px !important",
                              padding: "0px",
                              fontSize: "16px",
                            }}
                          />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            {formik.touched.password && formik.errors.password ? (
              <Typography
                sx={{
                  font: "Poppins",
                  fontSize: "12px",
                  lineHeight: "16px",
                  display: "flex",
                  justifyContent: "flex-start",
                  marginLeft: "55px",
                  color: "red",
                }}
              >
                {formik.errors.password}
              </Typography>
            ) : null}
            <Box sx={{ width: "100%", marginBottom: 1 }}>
              <Typography
                sx={{
                  font: "Poppins",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "32px",
                  color: "#287094",
                  marginTop: 1,
                  marginLeft: 7,
                }}
              >
                Confirm Password
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CustomTextField
                id="confirmPassword"
                onKeyDown={handleKeyDown}
                type={showconfirmPassword ? "text" : "password"}
                variant="outlined"
                placeholder="Enter your password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowConfirmPassword}
                        style={{ color: "#287094", fontSize: "21px" }}
                      >
                        {!showconfirmPassword ? (
                          <VisibilityOffOutlinedIcon
                            sx={{ height: "18.5px", width: "21px" }}
                          />
                        ) : (
                          <VisibilityOutlinedIcon
                            sx={{
                              height: "18.5px !important",
                              width: "21px !important",
                              padding: "0px",
                              fontSize: "16px",
                            }}
                          />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            {formik.touched.password && formik.errors.password ? (
              <Typography
                sx={{
                  font: "Poppins",
                  fontSize: "12px",
                  lineHeight: "16px",
                  display: "flex",
                  justifyContent: "flex-start",
                  marginLeft: "55px",
                  color: "red",
                }}
              >
                {formik.errors.password}
              </Typography>
            ) : null}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: 8,
              }}
            >
              <Button
                variant="contained"
                onClick={handleClose}
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
        </Box>
      </Modal>
    </div>
  );
}
