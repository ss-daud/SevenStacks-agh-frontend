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
import Mic from "./pages/mic/Mic";

function App() {
  return (
    <>
      <ThemeProvider>
        <Routes>
          {/* <Route path="/" element={<Login />} /> */}
          <Route
            path="/"
            element={
              <AuthRoutes>
                <Login />
              </AuthRoutes>
            }
          />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route
            path="/login"
            element={
              <AuthRoutes>
                <Login />
              </AuthRoutes>
            }
          />
          {/* <Route path="/signup" element={<Signup />} /> */}
          <Route
            path="/signup"
            element={
              <AuthRoutes>
                <Signup />
              </AuthRoutes>
            }
          />
          {/* <Route path="/forgotpassword" element={<ForgotPassword />} /> */}
          <Route
            path="/forgotpassword"
            element={
              <AuthRoutes>
                <ForgotPassword />
              </AuthRoutes>
            }
          />
          {/* <Route path="/resetpassword" element={<ResetPassword />} /> */}
          <Route
            path="/resetpassword"
            element={
              <AuthRoutes>
                <ResetPassword />
              </AuthRoutes>
            }
          />
          {/* <Route path="/otp" element={<ForgetOTP />} /> */}
          <Route
            path="/otp"
            element={
              <AuthRoutes>
                <ForgetOTP />
              </AuthRoutes>
            }
          />

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

          <Route
            path="/mic"
            element={
              <AuthRoutes>
                <Mic />
              </AuthRoutes>
            }
          />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
