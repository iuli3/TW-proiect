import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Button, Offcanvas } from "react-bootstrap";
import AdminUsersTab from "../components/admin/AdminUsersTab";
import AdminRequestsTab from "../components/admin/AdminRequestsTab";
import AdminStatsTab from "../components/admin/AdminStatsTab";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("requests");
  const [showSidebar, setShowSidebar] = useState(false);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const token = localStorage.getItem("token");

  const fetchRequests = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/organizer-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Eroare la cereri organizator:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Eroare la utilizatori:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    setLoading(true);
    if (activeTab === "requests") {
      fetchRequests();
    } else if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab, fetchRequests, fetchUsers]);

  const handleRequestAction = async (id, action) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/organizer-requests/${id}/${action}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`The request was ${action === "approve" ? "approved" : "rejected"}.`);
      fetchRequests();
    } catch (err) {
      console.error("Eroare la procesare cerere:", err);
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/role`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Role updated successfully.");
      fetchUsers();
    } catch (err) {
      console.error("Eroare la modificarea rolului:", err);
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
      console.error("Eroare la ștergere utilizator:", err);
    }
  };

  const renderTabContent = () => {
    if (activeTab === "requests") {
      return (
        <AdminRequestsTab
          requests={requests}
          loading={loading}
          message={message}
          onAction={handleRequestAction}
        />
      );
    } else if (activeTab === "users") {
      return (
        <AdminUsersTab
          users={users}
          loading={loading}
          message={message}
          onRoleChange={handleRoleChange}
          onDelete={handleDeleteUser}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
        />
      );
    } else {
      return <AdminStatsTab />;
    }
  };

  return (
    <div className="admin-dashboard position-relative">
      <Button className="sidebar-toggle-floating d-md-none" variant="primary" onClick={() => setShowSidebar(true)}>
        ☰
      </Button>

      <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} className="d-md-none">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Admin Panel</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <SidebarLinks activeTab={activeTab} setActiveTab={setActiveTab} onClose={() => setShowSidebar(false)} />
        </Offcanvas.Body>
      </Offcanvas>

      <div className="d-none d-md-block sidebar-fixed">
        <h5 className="px-3 py-3 border-bottom fw-bold">Admin Panel</h5>
        <SidebarLinks activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="main-content flex-grow-1 px-4">
        {renderTabContent()}
      </div>
    </div>
  );
}

function SidebarLinks({ activeTab, setActiveTab, onClose }) {
  const handleClick = (tab) => {
    setActiveTab(tab);
    if (onClose) onClose();
  };

  return (
    <>
      <div className={`menu-item ${activeTab === "requests" ? "active" : ""}`} onClick={() => handleClick("requests")}>
        ✅ Organizer Requests
      </div>
      <div className={`menu-item ${activeTab === "users" ? "active" : ""}`} onClick={() => handleClick("users")}>
        👥 Users
      </div>
      <div className={`menu-item ${activeTab === "stats" ? "active" : ""}`} onClick={() => handleClick("stats")}>
        📊 Statistics
      </div>
    </>
  );
}
