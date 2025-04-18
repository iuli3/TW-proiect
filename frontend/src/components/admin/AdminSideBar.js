import { Offcanvas, Button } from "react-bootstrap";

export default function AdminSidebar({ activeTab, setActiveTab, show, setShow }) {
  const handleClose = () => setShow(false);

  return (
    <>
      {/* Static sidebar pentru desktop */}
      <div className="d-none d-md-block sidebar-fixed">
        <h5 className="px-3 py-3 border-bottom fw-bold">Admin Panel</h5>
        <div className={`menu-item ${activeTab === "requests" ? "active" : ""}`} onClick={() => setActiveTab("requests")}>
          ✅ Cereri organizator
        </div>
        <div className={`menu-item ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
          👥 Utilizatori
        </div>
        <div className={`menu-item ${activeTab === "stats" ? "active" : ""}`} onClick={() => setActiveTab("stats")}>
          📊 Statistici
        </div>
      </div>

      {/* Offcanvas pentru mobil */}
      <Offcanvas show={show} onHide={handleClose} className="d-md-none">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Admin Panel</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className={`menu-item ${activeTab === "requests" ? "active" : ""}`} onClick={() => { setActiveTab("requests"); handleClose(); }}>
            ✅ Cereri organizator
          </div>
          <div className={`menu-item ${activeTab === "users" ? "active" : ""}`} onClick={() => { setActiveTab("users"); handleClose(); }}>
            👥 Utilizatori
          </div>
          <div className={`menu-item ${activeTab === "stats" ? "active" : ""}`} onClick={() => { setActiveTab("stats"); handleClose(); }}>
            📊 Statistici
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
