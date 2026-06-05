import { useEffect, useMemo, useState } from "react";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import fetchModel from "../../lib/fetchModelData";

export default function TopBar({ currentUser, path, onLogout, onUploaded }) {
  const [contextLabel, setContextLabel] = useState("");

  const viewedUserId = useMemo(() => {
    const parts = path.split("/");
    if (parts[1] === "users" || parts[1] === "photos") return parts[2];
    return null;
  }, [path]);

  useEffect(() => {
    const loadContext = async () => {
      if (!currentUser || !viewedUserId) {
        setContextLabel(currentUser ? "Please select a user" : "Please Login");
        return;
      }
      try {
        const user = await fetchModel(`/user/${viewedUserId}`);
        const prefix = path.startsWith("/photos/") ? "Photos of " : "";
        setContextLabel(`${prefix}${user.first_name} ${user.last_name}`);
      } catch (err) {
        setContextLabel("");
      }
    };
    loadContext();
  }, [path, viewedUserId, currentUser]);

  const onFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("photo", file);
    await fetch("/photos/new", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    onUploaded();
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
        <Typography variant="h6">HP Photo Share</Typography>
        <Typography>{contextLabel}</Typography>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {currentUser ? (
            <>
              <Typography variant="body2">Hi {currentUser.first_name}</Typography>
              <Button variant="contained" component="label" color="secondary">
                Add Photo
                <input hidden type="file" accept="image/*" onChange={onFileChange} />
              </Button>
              <Button variant="outlined" color="inherit" onClick={onLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Typography>Please Login</Typography>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
