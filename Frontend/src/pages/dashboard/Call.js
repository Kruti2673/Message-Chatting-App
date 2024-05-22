import {
  Box,
  Divider,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import { useTheme } from "@mui/material/styles";
import { MagnifyingGlass, Plus } from "phosphor-react";
import { SimpleBarStyle } from "../../components/Scrollbar";

const Call = () => {
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
              <Typography variant="h5">Call Logs</Typography>
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
                Start Conversation
              </Typography>
              <IconButton
                onClick={() => {
                  //setOpenDialog(true);
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
                {/* Call list */}
              </Stack>
            </SimpleBarStyle>
          </Stack>
        </Box>
        {/* Right */}
        {/* // TODO => Reuse Conversation Componetns */}
      </Stack>
    </>
  );
};

export default Call;
