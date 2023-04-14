import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Container,
  Typography,
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Iconify from "../components/iconify";
import { useTheme } from "@mui/material/styles";

const StyledRoot = styled("div")(() => {
  const theme = useTheme();
  return {
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  };
});

const StyledSection = styled("div")(() => ({
  width: "100%",
  maxWidth: 480,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
}));

const StyledContent = styled("div")(() => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  return {
    maxWidth: 480,
    margin: "auto",
    minHeight: matches ? "100vh" : "",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    padding: theme.spacing(12, 0),
  };
});

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (response.status === 200) {
        const { token } = await response.json();
        localStorage.setItem("token", token);
        window.location.href = "/";
        return;
      }
      setOpen(true);
    } catch (error) {
      console.error(error);
      setOpen(true);
    }
  }

  return (
    <>
      <StyledRoot>
        <StyledSection>
          <img src="/assets/scan-n-go.png" alt="login" />
        </StyledSection>

        <Container maxWidth="sm">
          <form onSubmit={handleSubmit}>
            <StyledContent>
              <Typography variant="h4" gutterBottom>
                Sign in to Scan N Go!
              </Typography>

              <Stack sx={{ my: 2 }} spacing={3}>
                <TextField
                  name="email"
                  label="Email address"
                  value={username}
                  onChange={handleUsernameChange}
                />

                <TextField
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          <Iconify
                            icon={
                              showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Login
              </LoadingButton>
            </StyledContent>
          </form>
        </Container>
      </StyledRoot>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          elevation={6}
          variant="filled"
          severity="error"
          sx={{ width: "100%" }}
        >
          Invalid credentials.
        </Alert>
      </Snackbar>
    </>
  );
}

export default LoginPage;
