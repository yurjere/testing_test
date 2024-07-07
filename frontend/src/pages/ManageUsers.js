import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../axiosConfig';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from '@mui/material';
import '../styles/css/ManageUsers.css'; // Import the CSS file here

const ManageUsers = () => {
  const { user: currentUser } = useAuth(); // Access the current logged-in user
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newUserModalOpen, setNewUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', phone_number: '', password: '', status: 'active', user_role: 'user', tickets_purchased: 0 });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get('/admin/users', { withCredentials: true });
      setUsers(response.data);
    } catch (error) {
      setError('Error fetching users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get(`/admin/users/search?email=${searchTerm}`, { withCredentials: true });
      setUsers(response.data);
    } catch (error) {
      setError('Error searching users');
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setModalIsOpen(true);
  };

  const handleStatusChange = async (user) => {
    const confirmChange = window.confirm(`Are you sure you want to ${user.status === 'active' ? 'deactivate' : 'activate'} this user?`);
    if (!confirmChange) return;

    try {
      const updatedStatus = user.status === 'active' ? 'inactive' : 'active';
      await apiClient.put(`/admin/users/${user.user_id}/status`, { status: updatedStatus }, { withCredentials: true });
      fetchUsers(); // Refresh user list after update
      if (selectedUser && selectedUser.user_id === user.user_id) {
        setSelectedUser({ ...selectedUser, status: updatedStatus });
      }
    } catch (error) {
      setError('Error updating user status');
      console.error('Error updating user status:', error);
    }
  };

  const handleRoleChange = async (user, newRole) => {
    try {
      await apiClient.put(`/admin/users/${user.user_id}/role`, { user_role: newRole }, { withCredentials: true });
      fetchUsers(); // Refresh user list after update
      if (selectedUser && selectedUser.user_id === user.user_id) {
        setSelectedUser({ ...selectedUser, user_role: newRole });
      }
    } catch (error) {
      setError('Error updating user role');
      console.error('Error updating user role:', error);
    }
  };

  const handleClose = () => {
    setModalIsOpen(false);
    setSelectedUser(null);
  };

  const handleNewUserChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async () => {
    try {
      await apiClient.post('/admin/users', newUser, { withCredentials: true });
      fetchUsers(); // Refresh user list after creating new user
      setNewUserModalOpen(false);
      setNewUser({ name: '', email: '', phone_number: '', password: '', status: 'active', user_role: 'user', tickets_purchased: 0 });
    } catch (error) {
      setError('Error creating new user');
      console.error('Error creating new user:', error);
    }
  };

  return (
    <div>
      <h2>Manage Users</h2>
      <form className='admin-search' onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by email"
          value={searchTerm}
          style={{ width: '300px', height: '40px' , marginBottom: '20px', borderRadius: '5px', padding: '5px'}}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button style={{ color: 'white'}} type="submit">Search</button>
      </form>
      {currentUser.role !== 'cus_support' && (
        <div className='admin-search'>
          <button style={{ color: 'white' }} type="submit" onClick={() => setNewUserModalOpen(true)}>Create New Account</button>
        </div>
      )}
      {loading ? <p>Loading...</p> : null}
      {error ? <p style={{ color: 'red' }}>{error}</p> : null}
      <div className="scrollable-list">
        <ul>
          {users.map(user => (
            <li key={user.user_id} onClick={() => handleUserClick(user)}>
              {user.email}
            </li>
          ))}
        </ul>
      </div>
      {selectedUser && (
        <Dialog open={modalIsOpen} onClose={handleClose}>
          <DialogTitle>User Details</DialogTitle>
          <DialogContent>
            <p>Name: {selectedUser.name}</p>
            <p>Email: {selectedUser.email}</p>
            <p>Phone Number: {selectedUser.phone_number}</p>
            <p>Tickets Purchased: {selectedUser.tickets_purchased}</p>
            <p>Status: {selectedUser.status}</p>
            <p>Role: {selectedUser.user_role}</p>
            {currentUser.role !== 'cus_support' && (
              <>
                <Button onClick={() => handleStatusChange(selectedUser)}>
                  {selectedUser.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
                <Select
                  value={selectedUser.user_role}
                  onChange={(e) => handleRoleChange(selectedUser, e.target.value)}
                  fullWidth
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="event">Event Staff</MenuItem>
                  <MenuItem value="cus_support">Customer Support</MenuItem>
                </Select>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
      {newUserModalOpen && (
        <Dialog open={newUserModalOpen} onClose={() => setNewUserModalOpen(false)}>
          <DialogTitle>Create New User</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              name="name"
              value={newUser.name}
              onChange={handleNewUserChange}
              fullWidth
              margin="normal"
              variant="standard"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Email"
              name="email"
              value={newUser.email}
              onChange={handleNewUserChange}
              fullWidth
              margin="normal"
              variant="standard"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Phone Number"
              name="phone_number"
              value={newUser.phone_number}
              onChange={handleNewUserChange}
              fullWidth
              margin="normal"
              variant="standard"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={newUser.password}
              onChange={handleNewUserChange}
              fullWidth
              margin="normal"
              variant="standard"
              InputLabelProps={{ shrink: true }}
            />
            <Select
              label="Role"
              name="user_role"
              value={newUser.user_role}
              onChange={handleNewUserChange}
              fullWidth
              margin="normal"
              variant="standard"
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="event">Event Staff</MenuItem>
              <MenuItem value="cus_support">Customer Support</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewUserModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateUser}>Create</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default ManageUsers;
