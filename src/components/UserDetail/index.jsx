import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Card, CardContent, Divider, Link, Stack, Typography } from "@mui/material";
import fetchModel from "../../lib/fetchModelData";

export default function UserDetail({ userId, refreshToken }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        setError("");
        const data = await fetchModel(`/user/${userId}`);
        setUser(data);
      } catch (err) {
        setError(err.message);
        setUser(null);
      }
    };
    loadUser();
  }, [userId, refreshToken]);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!user) return <Typography>Loading user...</Typography>;

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">
          {user.first_name} {user.last_name}
        </Typography>
        <Divider sx={{ my: 1.5 }} />
        <Stack spacing={1}>
          <Typography>
            <strong>Location:</strong> {user.location}
          </Typography>
          <Typography>
            <strong>Occupation:</strong> {user.occupation}
          </Typography>
          <Typography>
            <strong>Description:</strong> {user.description}
          </Typography>
          <Link component={RouterLink} to={`/photos/${user._id}`}>
            View Photos
          </Link>
        </Stack>
      </CardContent>
    </Card>
  );
}
