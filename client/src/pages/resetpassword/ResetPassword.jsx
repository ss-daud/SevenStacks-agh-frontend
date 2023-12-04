import React, { useState } from "react";
import { useFormik } from "formik";
import { AUTH_URL } from "../../api";
import {
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import axios from "axios";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import * as yup from "yup";
import styled from "@emotion/styled";
import { Box } from "@mui/material";
import "./resetpassword.css";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

const CustomTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    height: "48px",
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
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
  confirmPassword: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

export default function ResetPassword() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showconfirmPassword, setShowConfirmPassword] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((show) => !show);
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.password !== values.confirmPassword) {
        alert("Passwords do not match");
      } else {
        const apiObject = {
          email: localStorage.getItem("email"),
          password: values.password,
        };
        setLoader(true);
        try {
          const response = await axios.post(
            `${AUTH_URL}api/user/resetpassword`,
            {
              email: localStorage.getItem("email"),
              password: values.password,
            }
          );

          // Check the response status and handle accordingly
          if (response.status === 200) {
            alert("Password updated successfully!");
            navigate("/");
          } else {
            alert("Password update failed. Please try again.");
          }
        } catch (error) {
          console.error("Error updating password:", error);
          alert("An error occurred while updating the password.");
        } finally {
          setLoader(false);
        }
      }
    },
  });

  return (
    <>
      <div className="form-container-reset">
        <form
          onSubmit={formik.handleSubmit}
          style={{
            width: 454,
            padding: "80px 0",
            border: "1px solid #D9D9D9",
            borderRadius: "20px",
            backgroundColor: "#FFFFFF",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography
              sx={{
                font: "Poppins",
                fontWeight: 700,
                marginBottom: 6,
                fontSize: "28px",
                lineHeight: "28px",
                color: "#023246",
              }}
            >
              Reset Password
            </Typography>
          </Box>

          <Box>
            <Typography
              sx={{
                font: "Poppins",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "32px",
                color: "#287094",
                marginBottom: 1,
                marginLeft: 6,
              }}
            >
              Password
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
              type={showPassword ? "text" : "password"}
              variant="outlined"
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
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
                marginLeft: "50px",
                color: "red",
              }}
            >
              {formik.errors.password}
            </Typography>
          ) : null}

          <Box sx={{ width: "100%", marginBottom: 1, marginTop: 1 }}>
            <Typography
              sx={{
                font: "Poppins",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "32px",
                color: "#287094",
                marginLeft: 6,
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
              type={showconfirmPassword ? "text" : "password"}
              variant="outlined"
              placeholder="Enter your password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
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
                marginLeft: "50px",
                color: "red",
              }}
            >
              {formik.errors.password}
            </Typography>
          ) : null}
          <Box
            sx={{ display: "flex", justifyContent: "center", marginTop: 10 }}
          >
            <Button
              variant="contained"
              type="submit"
              style={{
                backgroundColor: "#023246", // Replace with your custom color
                color: "white",
                width: 361,
                height: 48,
                borderRadius: 8,
              }}
            >
              {loader ? (
                <CircularProgress sx={{ color: "white" }} size={23} />
              ) : (
                " Update Password"
              )}
            </Button>
          </Box>
        </form>
      </div>
    </>
  );
}
