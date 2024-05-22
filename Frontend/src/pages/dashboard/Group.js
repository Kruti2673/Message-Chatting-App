import React, { useState } from "react";
import {
  Stack,
  Box,
  Typography,
  Link,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import { MagnifyingGlass, Plus } from "phosphor-react";
import { useTheme } from "@mui/material/styles";
import SimpleBarStyle from "../../components/Scrollbar";
import { ChatList } from "../../data";
import ChatElement from "../../components/ChatElement";
import CreateGroup from "../../sections/main/CreateGroup";

const Group = () => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Stack direction={"row"} sx={{ width: "100%" }}>
        {/* Left */}
        <Box
          sx={{
            height: "100vh",
            backgroundColor: (theme) =>
              theme.palette.mode === "Light"
                ? "#DFE1E5"
                : theme.palette.background,
            width: 320,
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
          }}
        >
          <Stack p={3} spacing={2} sx={{ maxHeight: "100vh" }}>
            <Stack>
              <Typography variant="h5">Groups</Typography>
            </Stack>

            <Stack sx={{ width: "100" }}>
              <Search>
                <SearchIconWrapper>
                  <MagnifyingGlass color="#709CE6" />
                </SearchIconWrapper>
                <StyledInputBase placeholder="Search..." />
              </Search>
            </Stack>
            <Stack
              direction={"row"}
              justifyContent="space-between"
              alignItems={"center"}
            >
              <Typography variant="subtitle2" component={Link}>
                Create New Group
              </Typography>
              <IconButton
                onClick={() => {
                  setOpenDialog(true);
                }}
              >
                <Plus style={{ color: theme.palette.primary.main }} />
              </IconButton>
            </Stack>
            <Divider />
            <SimpleBarStyle
              timeout={500}
              clickOnTrack={false}
              style={{ flexGrow: 1, height: "100%" }}
            >
              <Stack spacing={3}>
                <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                  Pinned
                </Typography>
                {ChatList.filter((el) => el.pinned).map((el) => {
                  return <ChatElement {...el} />;
                })}

                <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                  All Groups
                </Typography>
                {ChatList.filter((el) => !el.pinned).map((el) => {
                  return <ChatElement {...el} />;
                })}
              </Stack>
            </SimpleBarStyle>
          </Stack>
        </Box>
        {/* Right */}
        {/* // TODO => Reuse Conversation Componetns */}
      </Stack>
      {openDialog && (
        <CreateGroup open={openDialog} handleClose={handleCloseDialog} />
      )}
    </>
  );
};

export default Group;
