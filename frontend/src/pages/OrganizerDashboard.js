import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Spinner, Alert, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTicket, faMoneyBill, faStar } from "@fortawesome/free-solid-svg-icons";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const OrganizerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/dashboard/organizer-stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!stats || !stats.stats) return null;

  const totalTickets = stats.stats.reduce((acc, e) => acc + e.ticketsSold, 0);
  const totalRevenue = stats.stats.reduce((acc, e) => acc + e.totalRevenue, 0);
  const averageRating = stats.reviews?.average;

  const ratingChartData = {
    labels: ["⭐ 1", "⭐ 2", "⭐ 3", "⭐ 4", "⭐ 5"],
    datasets: [
      {
        label: "Rating Distribution",
        data: stats.reviews.distribution,
        backgroundColor: ["#FF6384", "#FF9F40", "#FFCD56", "#4BC0C0", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#FF9F40", "#FFCD56", "#4BC0C0", "#36A2EB"],
      },
    ],
  };

  const topEventsForChart = [...stats.stats]
    .sort((a, b) => b.ticketsSold - a.ticketsSold)
    .slice(0, 5);

  const topEventsChartData = {
    labels: topEventsForChart.map((event) => event.title || "Unavailable"),
    datasets: [
      {
        label: "Tickets Sold",
        data: topEventsForChart.map((event) => event.ticketsSold),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Total Revenue (lei)",
        data: topEventsForChart.map((event) => event.totalRevenue),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const earningsChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Earnings",
        data: [5000, 10000, 7500, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const earningsChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Earnings Overview",
      },
    },
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center">📊 Organizer Dashboard</h2>

      <Row className="g-4">
        <Col md={4}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <FontAwesomeIcon icon={faTicket} size="2x" className="mb-3 text-primary" />
              <h5>Tickets Sold</h5>
              <h3>{totalTickets}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <FontAwesomeIcon icon={faMoneyBill} size="2x" className="mb-3 text-success" />
              <h5>Total Revenue</h5>
              <h3>{totalRevenue.toFixed(2)} lei</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <FontAwesomeIcon icon={faStar} size="2x" className="mb-3 text-warning" />
              <h5>Average Rating</h5>
              <h3>{averageRating !== "N/A" ? averageRating : "N/A"}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={8}>
          <h4 className="mb-3">📈 Earnings Overview</h4>
          <div style={{ height: "300px" }}>
            <Bar data={earningsChartData} options={earningsChartOptions} />
          </div>
        </Col>
        <Col md={4}>
          <h4 className="mb-3">⭐ Rating Distribution</h4>
          <div style={{ width: "200px", height: "200px", margin: "0 auto" }}>
            <Doughnut data={ratingChartData} />
          </div>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={6}>
          <h4 className="mb-3">📊 Top 5 Events - Stats</h4>
          <Bar data={topEventsChartData} options={{ responsive: true }} />
        </Col>
        <Col md={6}>
          <h4 className="mb-3">📅 Event Details</h4>
          <Table striped bordered hover className="table-light shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Event Name</th>
                <th>Tickets Sold</th>
                <th>Total Revenue (lei)</th>
              </tr>
            </thead>
            <tbody>
              {stats.stats.map((event, index) => (
                <tr key={event.id || index}>
                  <td>{index + 1}</td>
                  <td>{event.title || "Unavailable"}</td>
                  <td>{event.ticketsSold}</td>
                  <td>{event.totalRevenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default OrganizerDashboard;
