import { useState, useEffect, useCallback } from "react";
import {
  Container, Table, Button, Form, Alert, Spinner
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminUsersTab.css";

export default function AdminUsersTab() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId, role) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/role`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Role updated.");
      fetchUsers();
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("User deleted.");
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const filteredUsers = users
    .filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(u => filterRole === "all" ? true : u.role === filterRole);

  return (
    <Container className="my-4">
      <h3 className="text-center mb-4 text-darkblue">User Management</h3>
      {message && <Alert variant="info">{message}</Alert>}

      <div className="d-flex justify-content-between mb-3 flex-wrap gap-2">
        <Form.Control
          type="text"
          placeholder="Search user..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: "300px" }}
        />
        <Form.Select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          style={{ maxWidth: "200px" }}
        >
          <option value="all">All roles</option>
          <option value="user">User</option>
          <option value="organizer">Organizer</option>
          <option value="admin">Admin</option>
        </Form.Select>
      </div>

      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : (
        <Table bordered hover responsive className="admin-users-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <Form.Select
                    className="role-select"
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  >
                    <option value="user">user</option>
                    <option value="organizer">organizer</option>
                    <option value="admin">admin</option>
                  </Form.Select>
                </td>
                <td className="d-flex justify-content-center align-items-center flex-wrap gap-2">
                  <Button
                    className="btn-view-events"
                    size="sm"
                    onClick={() => navigate(`/organizer/${user._id}`)}
                  >
                    View events
                  </Button>
                  <Button
                    className="btn-delete-user"
                    size="sm"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
