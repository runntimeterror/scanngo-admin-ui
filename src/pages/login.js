import { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Container,
  Typography,
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  useMediaQuery,
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

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(`Username: ${username}\nPassword: ${password}`);
    // TODO: submit form data to server for authentication
  }

  return (
    <StyledRoot>
      <StyledSection>
        <img src="/assets/scan-n-go.png" alt="login" />
      </StyledSection>

      <Container maxWidth="sm">
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
      </Container>
    </StyledRoot>
  );
}

export default LoginPage;