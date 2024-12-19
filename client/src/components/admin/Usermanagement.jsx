import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from the backend API
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/users") // Backend API URL
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching users");
        setLoading(false);
      });
  }, []);

  // Handle button actions (Suspend/Activate)
  const toggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Suspended" : "Active";
    axios
      .patch(`http://localhost:3001/api/users/${id}`, { status: newStatus }) // Update status on backend
      .then((response) => {
        // Update the local state to reflect the status change
        const updatedUsers = users.map((user) =>
          user.id === id ? { ...user, status: newStatus } : user
        );
        setUsers(updatedUsers);
      })
      .catch((err) => {
        setError("Error updating status");
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={10} md={8} lg={6} xl={5}>
          <main className="content">
            <h1>User Management</h1>

            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Search users..."
                  variant="outlined"
                  size="small"
                />
              </Grid>
            </Grid>

            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className={`status ${user.status.toLowerCase()}`}>
                        {user.status}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color={user.status === "Active" ? "error" : "success"}
                          onClick={() => toggleStatus(user.id, user.status)}
                        >
                          {user.status === "Active" ? "Suspend" : "Activate"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </main>
        </Grid>
      </Grid>
    </div>
  );
};

export default UserManagement;
