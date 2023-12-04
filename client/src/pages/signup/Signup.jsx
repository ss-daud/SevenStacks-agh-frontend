import React, { useState } from "react";
import { useFormik } from "formik";
import { AUTH_URL } from "../../api";
console.log("WEB SERVER : ", AUTH_URL);
import {
  TextField,
  Typography,
  IconButton,
  Button,
  InputAdornment,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import * as yup from "yup";
import axios from "axios";
import styled from "@emotion/styled";

import { Box } from "@mui/material";

import { ErrorOutline } from "@mui/icons-material";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import "./signup.css";
import { Link, NavLink, useNavigate, useNavigation } from "react-router-dom";
import Name from "../../assets/svgs/Name";

const CustomTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    height: "38px",
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
  name: yup.string("Enter your full name").required("name is required"),
  username: yup.string("Enter your  username").required("username is required"),
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Enter a valid email")
    .required("email is required"),
  password: yup
    .string("Enter your password")
    .min(8, "password should be of minimum 8 characters length")
    .required("password is required"),
  confirmPassword: yup
    .string("Enter your password")
    .min(8, "password should be of minimum 8 characters length")
    .required("password is required"),
});

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showconfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const [loader, setLoader] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((show) => !show);
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.password !== values.confirmPassword) {
        alert("Passwords do not match");
      } else {
        const apiObject = {
          name: values.name,
          username: values.username,
          email: values.email,
          password: values.password,
        };

        setLoader(true);
        localStorage.setItem("email", values.email);

        try {
          const response = await axios.post(
            `${AUTH_URL}api/user/register`,
            apiObject
          );

          if (response) {
            navigate("/success");
          } else {
            alert("Token not found in the response.");
          }
        } catch (err) {
          console.log(err?.response?.data?.message);
          setError(err?.response?.data?.message);
        } finally {
          setLoader(false);
        }
      }
    },
  });

  return (
    <>
      <div className="form-container-signup">
        <form
          onSubmit={formik.handleSubmit}
          style={{
            width: 470,
            padding: "25px 0",
            border: "1px solid #D9D9D9",
            borderRadius: "20px",
            backgroundColor: "#FFFFFF",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                font: "'DM Sans', sans-serif",
                fontWeight: 700,
                marginBottom: 1,
                fontSize: "28px",
                lineHeight: "28px",
                color: "#023246",
              }}
            >
              Signup
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
                marginLeft: 7,
              }}
            >
              Full Name
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
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
                font: "Poppins",
                fontSize: "12px",
                lineHeight: "16px",
                display: "flex",
                justifyContent: "flex-start",
                marginLeft: "50px",
                color: "red",
              }}
            >
              {formik.errors.name}
            </Typography>
          ) : null}
          <Box>
            <Typography
              sx={{
                font: "Poppins",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "32px",
                color: "#287094",
                marginTop: 1,
                marginBottom: 1,
                marginLeft: 7,
              }}
            >
              Username
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CustomTextField
              id="username"
              placeholder="Enter your username"
              variant="outlined"
              value={formik.values.username}
              onChange={formik.handleChange}
              error={formik.touched.username && Boolean(formik.errors.username)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Name />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          {formik.touched.username && formik.errors.username ? (
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
              {formik.errors.username}
            </Typography>
          ) : null}
          <Box>
            <Typography
              sx={{
                font: "Poppins",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "32px",
                color: "#287094",
                marginBottom: 1,
                marginTop: 1,
                marginLeft: 7,
              }}
            >
              Email
            </Typography>
            <Typography
              sx={{
                font: "Poppins",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "32px",
                color: "red",
                marginBottom: 1,
                marginTop: 1,
                marginLeft: 7,
              }}
            >
              {error}
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
                font: "Poppins",
                fontSize: "12px",
                lineHeight: "16px",
                display: "flex",
                justifyContent: "flex-start",
                marginLeft: "50px",
                color: "red",
              }}
            >
              {formik.errors.email}
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
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
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
              {formik.errors.confirmPassword}
            </Typography>
          ) : null}
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
            <Button
              variant="contained"
              type="submit"
              onClick={formik.submit}
              style={{
                marginBottom: 10,
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
                " Register"
              )}
            </Button>
          </Box>
          <NavLink to="/" style={{ textDecoration: "none" }}>
            <Box
              sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}
            >
              <Typography
                sx={{
                  font: "Poppins",
                  fontWeight: 400,
                  fontSize: "19px",
                  lineHeight: "32px",
                  color: "#023246",
                  textDecoration: "none",
                }}
              >
                Already have an account?
              </Typography>
              <Typography
                sx={{
                  font: "Poppins",
                  fontWeight: 600,
                  fontSize: "19px",
                  lineHeight: "32px",
                  color: "#023246",
                  marginLeft: 1,
                  textDecoration: "underline",
                }}
              >
                Login
              </Typography>
            </Box>
          </NavLink>
        </form>
      </div>
    </>
  );
}
