import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Divider,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import fetchModel from "../../lib/fetchModelData";

const formatDate = (dateString) => new Date(dateString).toLocaleString();

export default function UserPhotos({ userId, currentUser, refreshToken }) {
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");
  const [commentInputs, setCommentInputs] = useState({});

  const loadPhotos = async () => {
    try {
      setError("");
      const data = await fetchModel(`/photosOfUser/${userId}`);
      setPhotos(data);
    } catch (err) {
      setError(err.message);
      setPhotos([]);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, [userId, refreshToken]);

  const submitComment = async (photoId) => {
    const value = (commentInputs[photoId] || "").trim();
    if (!value) return;
    await fetchModel(`/commentsOfPhoto/${photoId}`, {
      method: "POST",
      body: JSON.stringify({ comment: value }),
    });
    setCommentInputs((p) => ({ ...p, [photoId]: "" }));
    await loadPhotos();
  };

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Stack spacing={2}>
      {photos.map((photo) => (
        <Card key={photo._id}>
          <CardContent>
            <img
              src={`/images/${photo.file_name}`}
              alt="uploaded"
              style={{ maxWidth: "100%", borderRadius: 8 }}
            />
            <Typography sx={{ mt: 1 }} color="text.secondary">
              Posted: {formatDate(photo.date_time)}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Stack spacing={1}>
              {photo.comments.map((comment) => (
                <Card key={comment._id} variant="outlined">
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(comment.date_time)}
                    </Typography>
                    <Typography variant="body2">
                      <Link component={RouterLink} to={`/users/${comment.user._id}`}>
                        {comment.user.first_name} {comment.user.last_name}
                      </Link>{" "}
                      - {comment.comment}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
            {currentUser && (
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Add a comment"
                  value={commentInputs[photo._id] || ""}
                  onChange={(e) =>
                    setCommentInputs((p) => ({ ...p, [photo._id]: e.target.value }))
                  }
                />
                <Button variant="contained" onClick={() => submitComment(photo._id)}>
                  Post
                </Button>
              </Stack>
            )}
          </CardContent>
        </Card>
      ))}
      {photos.length === 0 && <Typography>No photos available.</Typography>}
    </Stack>
  );
}
