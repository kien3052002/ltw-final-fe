import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Card,
  CardContent,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import fetchModel from "../../lib/fetchModelData";

export default function UserList({ currentUser, refreshToken }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      if (!currentUser) {
        setUsers([]);
        return;
      }
      try {
        const data = await fetchModel("/user/list");
        setUsers(data);
      } catch (err) {
        setUsers([]);
      }
    };
    loadUsers();
  }, [currentUser, refreshToken]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Users</Typography>
        <List dense>
          {users.map((user) => (
            <ListItem key={user._id} disablePadding>
              <Link
                component={RouterLink}
                to={`/users/${user._id}`}
                underline="hover"
                sx={{ py: 0.75 }}
              >
                <ListItemText
                  primary={`${user.first_name} ${user.last_name}`}
                />
              </Link>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
