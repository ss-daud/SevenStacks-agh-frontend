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
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import * as yup from "yup";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import styled from "@emotion/styled";
import { Input } from "reactstrap";
import { Box } from "@mui/material";

import { ErrorOutline } from "@mui/icons-material";
import "./forgotpassword.css";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import { Link, NavLink, useNavigate } from "react-router-dom";
import decryptionofdata from "../../decryption/decryption";
import decryptionofData from "../../decryption/decryption";

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
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Enter a valid email")
    .required("Email is required"),
});

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      localStorage.setItem("email", values.email);
      setLoader(true);
      try {
        // Make a POST request to check if the email exists
        const encrypted_res = await axios.post(
          `${AUTH_URL}api/user/forgotPassword`,
          {
            email: values.email,
          }
        );
        const response = await decryptionofdata(encrypted_res.data);
        if (response) {
          alert(response.message);
          navigate("/otp");
        } else {
          // If the email does not exist, show an error message or handle it as needed
          alert("Email not found. Please check your email address.");
        }
      } catch (err) {
        const error = await decryptionofData(err.response.data);
        alert(error.message);
      } finally {
        setLoader(false);
      }
    },
  });

  return (
    <>
      <div className="form-container-password ">
        <form
          onSubmit={formik.handleSubmit}
          style={{
            width: 454,
            padding: "100px 0",
            border: "1px solid #D9D9D9",
            borderRadius: "20px",
            backgroundColor: "#FFFFFF",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                font: "Poppins",
                fontWeight: 600,
                fontSize: "28px",
                lineHeight: "28px",
                color: "#023246",
              }}
            >
              Forget Password
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                font: "Poppins",
                fontWeight: 400,
                marginTop: 3,
                fontSize: "16px",
                lineHeight: "28px",
                color: "#287094",
              }}
            >
              No worries, we'll send your reset instructions
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
                marginTop: 7,
                marginBottom: 2,
                marginLeft: 6,
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
                fontFamily: "Poppins",
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
                "  Reset Password"
              )}
            </Button>
          </Box>
          <NavLink to="/" style={{ textDecoration: "none" }}>
            <Box
              sx={{ display: "flex", justifyContent: "center", marginTop: 5 }}
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
