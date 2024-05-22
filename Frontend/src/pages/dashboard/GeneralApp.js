import React from "react";
import Chats from "./Chats.js";
import { Box, Stack, Typography } from "@mui/material";
import Conversation from "../../components/Conversation";
import { useTheme } from "@mui/material/styles";
import Contact from "../../components/Contact.js";
import { useSelector } from "react-redux";
import SharedMessages from "../../components/SharedMessages.js";
import StarredMessages from "../../components/StarredMessages.js";

import NoChatSVG from "../../assets/Illustration/NoChat.js";

const GeneralApp = () => {
  const theme = useTheme();
  const { sidebar, room_id, chat_type } = useSelector((store) => store.app);

  return (
    <Stack direction={"row"} sx={{ width: "100%" }}>
      {/*Chats*/}
      <Chats />

      <Box
        sx={{
          height: "100%",
          // width: "93%",
          //width: sidebar.open ? "calc(100vw-740px)" : "calc(100vw-420px)",
          width: sidebar.open ? "calc(100vw-740px)" : "93%",

          backgroundColor:
            theme.palette.mode === "light"
              ? "#F0F4F4"
              : theme.palette.background.default,
        }}
      >
        {/* Conversation */}
        {/* <Conversation /> */}
        {/*//changes done here from code as room_id!==null*/}
        {room_id === null && chat_type === "individual" ? (
          <Conversation />
        ) : (
          <Stack
            spacing={2}
            sx={{ height: "100%", width: "100%" }}
            alignItems="center"
            justifyContent={"center"}
          >
            <NoChatSVG />
            <Typography variant="subtitle2">
              Select a Conversation or start a new one
            </Typography>
          </Stack>
        )}
      </Box>

      {/* Contact */}
      {sidebar.open &&
        (() => {
          switch (sidebar.type) {
            case "CONTACT":
              return <Contact />;

            case "STARRED":
              return <StarredMessages />;

            case "SHARED":
              return <SharedMessages />;

            default:
              break;
          }
        })()}
    </Stack>
  );
};

export default GeneralApp;
