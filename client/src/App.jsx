import { Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import ForgetOTP from "./pages/Otp/Otp";
import { ThemeProvider } from "./context/ThemeContext";
import VerifyEmail from "./pages/verifyEmail/VerifyEmail";
import ResetPassword from "./pages/resetpassword/ResetPassword";
import Home from "./components/home/Home";
import Success from "./pages/success/Success";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import { TopicProvider } from "./context/TopicContext";
import DeleteConservation from "./components/DeleteConservation";
import AuthRoutes from "./utils/AuthRoutes";
import ChangePassword from "./pages/changePassword/ChangePassword";

function App() {
  return (
    <>
      <ThemeProvider>
        <Routes>
          {/* <Route path="/" element={<Login />} /> */}
          <Route path="/" element={<Login />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/login" element={<Login />} />
          {/* <Route path="/signup" element={<Signup />} /> */}
          {/* <Route
            path="/signup"
            element={
              <AuthRoutes>
                <Signup />
              </AuthRoutes>
            }
          />
            */}
          {/* <Route path="/forgotpassword" element={<ForgotPassword />} /> */}
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          {/* <Route path="/resetpassword" element={<ResetPassword />} /> */}
          <Route path="/resetpassword" element={<ResetPassword />} />
          {/* <Route path="/otp" element={<ForgetOTP />} /> */}
          <Route path="/otp" element={<ForgetOTP />} />
          <Route
            path="/home"
            element={
              <ProtectedRoutes>
                <Home />
              </ProtectedRoutes>
            }
          />
          {/* <Route path="/verify" element={<VerifyEmail />} /> */}
          <Route
            path="/verify"
            element={
              <AuthRoutes>
                <VerifyEmail />
              </AuthRoutes>
            }
          />
          {/* <Route path="/success" element={<Success />} /> */}
          <Route
            path="/success"
            element={
              <AuthRoutes>
                <Success />
              </AuthRoutes>
            }
          />
          {/* <Route path="/success" element={<Success />} /> */}
          <Route
            path="/change-password"
            element={
              <AuthRoutes>
                <ChangePassword />
              </AuthRoutes>
            }
          />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
