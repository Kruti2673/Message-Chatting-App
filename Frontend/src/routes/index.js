// Router.js
import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
//import LoadingScreen from "../components/LoadingScreen";
import GeneralApp from "../pages/dashboard/GeneralApp";
import GroupPage from "../pages/dashboard/Group";
import Page404 from "../pages/Page404"; // Import the Page404 component
import { DEFAULT_PATH } from "../config";
import DashboardLayout from "../layouts/dashboard";
//import Chats from "../pages/dashboard/Chats";
import LoginPage from "../pages/auth/Login";
import RegisterPage from "../pages/auth/Register";
import MainLayout from "../layouts/main";
import ResetPasswordPage from "../pages/auth/ResetPassword";

import Settings from "../pages/dashboard/Settings";
import Call from "../pages/dashboard/Call";
import Profile from "../pages/dashboard/Profile";
// import NewPasswordForm from "../sections/auth/NewPasswordForm";
import NewpasswordPage from "../pages/auth/NewPassword";
import VerifyPAge from "../pages/auth/Verify";

export default function Router() {
  return useRoutes([
    {
      path: "/auth",
      element: <MainLayout />,
      children: [
        { element: <LoginPage />, path: "login" },
        { element: <RegisterPage />, path: "register" },
        { element: <ResetPasswordPage />, path: "reset-password" },
        { element: <NewpasswordPage />, path: "new-password" },
        { element: <VerifyPAge />, path: "verify" },
      ],
    },
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to={DEFAULT_PATH} replace />, index: true },
        { path: "app", element: <GeneralApp /> },
        { path: "settings", element: <Settings /> },
        { path: "profile", element: <Profile /> },
        { path: "calls", element: <Call /> },
        { path: "group", element: <GroupPage /> },
        { path: "404", element: <Page404 /> },
        { path: "*", element: <Navigate to="/404" replace /> },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
