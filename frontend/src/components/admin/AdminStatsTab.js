import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import {
  Bar,
  Doughnut,
  Pie,
  Line,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import "./AdminStatsTab.css";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);

export default function AdminStatsTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  const topEventsBarData = {
    labels: stats?.topEvents.map(e => e.title),
    datasets: [
      {
        label: "Tickets sold",
        data: stats?.topEvents.map(e => e.ticketsSold),
        backgroundColor: "#FFA500",
      },
    ],
  };

  const doughnutData = {
    labels: ["Tickets sold", "Total revenue (RON)"],
    datasets: [
      {
        data: [stats?.totalTickets, stats?.totalRevenue],
        backgroundColor: ["#36A2EB", "#FFCE56"],
        hoverOffset: 10,
      },
    ],
  };

  const pieData = {
    labels: ["Users", "Organizers", "Admins"],
    datasets: [
      {
        data: [
          stats?.totalUsers - stats?.totalOrganizers - 1,
          stats?.totalOrganizers,
          1,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FF9F40"],
      },
    ],
  };

  const lineData = {
    labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
    datasets: [
      {
        label: "Tickets sold per week",
        data: [5, 9, 8, 12, 15, 10, 14, 18],
        fill: false,
        borderColor: "#4ECCA3",
        tension: 0.4,
      },
    ],
  };

  return (
    <Container className="mt-4 admin-stats-dashboard">
      <h3 className="text-center mb-4">Admin Statistics Dashboard</h3>

      {loading || !stats ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : (
        <>
          <Row className="g-3 text-center">
            <StatBox label="Users" value={stats.totalUsers} icon="👤" />
            <StatBox label="Organizers" value={stats.totalOrganizers} icon="👥" />
            <StatBox label="Events" value={stats.totalEvents} icon="🌟" />
            <StatBox label="Tickets sold" value={stats.totalTickets} icon="🎫" />
            <StatBox label="Total revenue" value={stats.totalRevenue.toFixed(2) + " RON"} icon="💰" />
          </Row>

          <Row className="mt-4 g-4">
            <Col xs={12} md={6}><Card className="p-3 shadow h-100"><Line data={lineData} /></Card></Col>
            <Col xs={12} md={6}><Card className="p-3 shadow h-100"><Bar data={topEventsBarData} /></Card></Col>
          </Row>

          <Row className="mt-4 g-4">
            <Col xs={12} md={6}><Card className="p-3 shadow h-100"><Pie data={pieData} /></Card></Col>
            <Col xs={12} md={6}><Card className="p-3 shadow h-100"><Doughnut data={doughnutData} /></Card></Col>
          </Row>
        </>
      )}
    </Container>
  );
}

function StatBox({ label, value, icon }) {
  return (
    <Col xs={6} sm={4} md={3} lg={2} className="d-flex align-items-stretch">
      <Card className="p-2 text-center shadow-sm w-100">
        <div className="fw-bold fs-5">{icon}</div>
        <div className="text-muted small">{label}</div>
        <div className="fw-semibold fs-6 text-dark">{value}</div>
      </Card>
    </Col>
  );
}
