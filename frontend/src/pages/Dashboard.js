import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { io } from 'socket.io-client';

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null); 
  const [open, setOpen] = useState(false); 
  const socket = React.useRef(null);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/users', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const usersWithStatus = response.data.map((user) => ({
        ...user,
        isOnline: false,
      }));
      setUsers(usersWithStatus);
    } catch (error) {
      alert('Failed to fetch users');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('User deleted successfully');
      fetchUsers();
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5001/users/${editUser.id}`, editUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('User updated successfully');
      setOpen(false);
      fetchUsers();
    } catch (error) {
      alert('Failed to update user');
    }
  };

  useEffect(() => {
    fetchUsers();

    const token = localStorage.getItem('token');
    socket.current = io('http://localhost:5001', {
      auth: { token },
    });

    socket.current.on('user-joined', ({ userId }) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isOnline: true } : user
        )
      );
    });

    socket.current.on('left', ({ userId }) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isOnline: false } : user
        )
      );
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh'  }}>
      <h1>Dashboard</h1>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>SL No</TableCell>
            <TableCell>Full Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Is Online</TableCell>
            <TableCell>Last Seen</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.isOnline ? 'Yes' : 'No'}</TableCell>
              <TableCell>{user.lastSeen ? new Date(user.lastSeen).toLocaleString() : 'N/A'}</TableCell>
              <TableCell>
                <Button color="primary" onClick={() => handleEdit(user)}>Edit</Button>
                <Button color="secondary" onClick={() => handleDelete(user.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={editUser?.name || ''}
            onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={editUser?.email || ''}
            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
          />
          <TextField
            label="Phone"
            fullWidth
            margin="normal"
            value={editUser?.phone || ''}
            onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              value={editUser?.role || ''}
              onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
            >
              <MenuItem value="Student">Student</MenuItem>
              <MenuItem value="Teacher">Teacher</MenuItem>
              <MenuItem value="Institute">Institute</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Is Online"
            fullWidth
            margin="normal"
            value={editUser?.isOnline ? 'Yes' : 'No'}
            disabled
          />
          <TextField
            label="Last Seen"
            fullWidth
            margin="normal"
            value={editUser?.lastSeen ? new Date(editUser.lastSeen).toLocaleString() : 'N/A'}
            disabled
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleUpdate} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Dashboard;
