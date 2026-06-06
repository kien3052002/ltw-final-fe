import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import fetchModel from "../../lib/fetchModelData";

const emptyRegister = {
  login_name: "",
  password: "",
  confirm_password: "",
  first_name: "",
  last_name: "",
  location: "",
  description: "",
  occupation: "",
};

const registerFieldLabels = {
  login_name: "Login Name",
  password: "Password",
  confirm_password: "Confirm Password",
  first_name: "First Name",
  last_name: "Last Name",
  location: "Location",
  description: "Description",
  occupation: "Occupation",
};

export default function LoginRegister({ onLogin }) {
  const [login, setLogin] = useState({ login_name: "", password: "" });
  const [register, setRegister] = useState(emptyRegister);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const doLogin = async () => {
    try {
      setError("");
      const user = await fetchModel("/admin/login", {
        method: "POST",
        body: JSON.stringify(login),
      });
      onLogin(user);
    } catch (err) {
      setError(err.message);
    }
  };

  const doRegister = async () => {
    try {
      setError("");
      setMessage("");
      if (register.password !== register.confirm_password) {
        throw new Error("Passwords do not match.");
      }
      const { confirm_password, ...payload } = register;
      await fetchModel("/user", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setMessage("Registration successful. You can login now.");
      setRegister(emptyRegister);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Stack spacing={2}>
      {error && <Alert severity="error">{error}</Alert>}
      {message && <Alert severity="success">{message}</Alert>}
      <Card>
        <CardContent>
          <Typography variant="h6">Login</Typography>
          <Stack spacing={1.5} sx={{ mt: 1 }}>
            <TextField
              label="Login Name"
              value={login.login_name}
              onChange={(e) =>
                setLogin((p) => ({ ...p, login_name: e.target.value }))
              }
            />
            <TextField
              label="Password"
              type="password"
              value={login.password}
              onChange={(e) =>
                setLogin((p) => ({ ...p, password: e.target.value }))
              }
            />
            <Button variant="contained" onClick={doLogin}>
              Login
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h6">Register</Typography>
          <Stack spacing={1.5} sx={{ mt: 1 }}>
            {Object.keys(emptyRegister).map((key) => (
              <TextField
                key={key}
                label={registerFieldLabels[key]}
                type={key.includes("password") ? "password" : "text"}
                value={register[key]}
                onChange={(e) =>
                  setRegister((p) => ({ ...p, [key]: e.target.value }))
                }
              />
            ))}
            <Button variant="outlined" onClick={doRegister}>
              Register Me
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
