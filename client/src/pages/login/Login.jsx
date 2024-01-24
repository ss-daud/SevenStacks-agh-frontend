import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import { AUTH_URL } from "../../api";
import {
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import * as yup from "yup";
import styled from "@emotion/styled";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";
import "./login.css";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import { Link, useNavigate } from "react-router-dom";

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
  emailOrUsername: yup
    .string("Enter your email or username")
    .required("Email or username is required"),
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

export default function Login() {
  //btnLoader
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const formik = useFormik({
    initialValues: {
      emailOrUsername: "", // combined field for email or username
      password: "",
    },
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      const apiObject = {
        password: values.password,
        userInput: values.emailOrUsername,
      };
      setLoader(true);
      localStorage.setItem("email", values.emailOrUsername);

      try {
        const response = await axios.post(
          `${AUTH_URL}api/user/login`,
          apiObject
        );

        if (response?.data?.token) {
          localStorage.setItem("token", response.data.token);
          if (response.data.isPasswordActive === false) {
            navigate("/change-password");
          } else {
            navigate("/home");
          }
        } else {
          alert("Token not found in the response.");
        }
      } catch (err) {
        if (err.response.data.message == "Account Not Found") {
          setError("Account Not Found");
        } else {
          setError("Wrong email or password");
        }
      } finally {
        setLoader(false);
      }
    },
  });

  return (
    <>
      <div className="form-container-login">
        <form
          onSubmit={formik.handleSubmit}
          style={{
            width: 454,
            padding: "35px 0",
            border: "1px solid #D9D9D9",
            borderRadius: "20px",
            backgroundColor: "#FFFFFF",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography
              sx={{
                width: 76,
                font: "Poppins",
                fontWeight: 700,
                marginBottom: 6,
                fontSize: "28px",
                lineHeight: "28px",
                color: "#023246",
              }}
            >
              Login
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
                marginBottom: 2,
                marginLeft: 6,
              }}
            >
              Email or Username
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 1,
            }}
          >
            <CustomTextField
              id="emailOrUsername"
              placeholder="Enter your email or username"
              variant="outlined"
              value={formik.values.emailOrUsername}
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
          {formik.touched.emailOrUsername && formik.errors.emailOrUsername ? (
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontSize: "12px",
                lineHeight: "16px",
                display: "flex",
                justifyContent: "flex-start",
                marginLeft: "50px",
                color: "red",
              }}
            >
              {formik.errors.emailOrUsername}
            </Typography>
          ) : null}
          <Box sx={{ width: "100%", marginBottom: 2, marginTop: 2 }}>
            <Typography
              sx={{
                font: "Poppins",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "32px",
                color: "#287094",
                marginBottom: 2,
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
              marginBottom: 1,
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
                fontFamily: "Poppins",
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
          <Box
            sx={{ display: "flex", justifyContent: "center", marginTop: 10 }}
          >
            <Button
              variant="contained"
              type="submit"
              style={{
                marginBottom: 20,
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
                " Login"
              )}
            </Button>
          </Box>
          {/* <Link to="/signup" style={{ textDecoration: "none" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Typography
                sx={{
                  font: "Poppins",
                  fontWeight: 400,
                  fontSize: "19px",
                  lineHeight: "32px",
                  marginTop: 6,
                  color: "#023246",
                  textDecoration: "none", // This line removes the underline
                }}
              >
                Don't have an account?
              </Typography>
              <Typography
                sx={{
                  font: "Poppins",
                  fontWeight: 700,
                  fontSize: "19px",
                  lineHeight: "32px",
                  marginTop: 6,
                  marginLeft: 1,
                  color: "#023246",
                  textDecoration: "underline", // This line removes the underline
                }}
              >
                Signup
              </Typography>
            </Box>
          </Link> */}
          <Link to="/forgotpassword" style={{ textDecoration: "none" }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Typography
                sx={{
                  font: "Poppins",
                  fontWeight: 600,
                  marginTop: 2,
                  fontSize: "16px",
                  lineHeight: "32px",
                  color: "#023246",
                }}
              >
                Forgot Password
              </Typography>
            </Box>
          </Link>
        </form>
      </div>
    </>
  );
}
