import 'bootstrap/dist/css/bootstrap.min.css';
import AppHeader from './components/header';
import Login from './components/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from './components/Register';
import CarouselWithCards from './components/CardsCarousel';
import Footer from "./components/Footer";
import SearchBar from "./components/searchBar";
import AddEvent from './components/AddEvent';
import EventPage from './pages/EventPage';
import RequestOrganizer from "./pages/OrgReq";
import FavoritesPage from "./pages/FavoritesPage";
import OrganizerPromo from "./components/OrganizerPromo";
import { useLocation } from "react-router-dom";
import MyEvents from "./pages/MyEvents"; 
import { CartProvider } from "./context/CartContext";
import CheckoutPage from './pages/CheckoutPage';
import MyTickets from './pages/MyTickets';
import EditEventPage from "./pages/EditEventPage";
import OrganizerDashboard from './pages/OrganizerDashboard';
import CategoryCarousel from './pages/CategoryCarousel';
import { Button } from "react-bootstrap";
import { useState } from "react";
import AllEventsPage from './components/AllEventsPage';
import { Link } from "react-router-dom";
import OrganizersPage from './pages/OrganizersPage';
import BenefitsSection from './components/BenefitsSections';
import "./App.css";
import AdminDashboard from './pages/AdminDashboard';
import UserProfileLayout from './pages/UserProfileLayout';


function AppContent() {
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const hideHeaderOn = ["/request-organizer"];
  const hideFooterRoutes = [
    "/adauga-eveniment",
    "/admin-dashboard",     
    "/organizer-dashboard",
    "/checkout",
    "/myTickets"
  ];
  
  return (
    <div className="App">
      {!hideHeaderOn.includes(location.pathname) && (
        <header id="header">
          <AppHeader />
        </header>
      )}

      <main>
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <SearchBar 
                  setResults={setEvents} 
                  setIsFiltered={setIsFiltered} 
                />
                
                <div className="section-wrapper">
                  <CarouselWithCards 
                    events={events}
                    setEvents={setEvents}
                    isFiltered={isFiltered}
                    setIsFiltered={setIsFiltered}
                  />
                </div>
                <div className="view-events-section">
  <div className="view-events-divider-thin"></div>
  <Link to="/evenimente">
    <Button className="view-events-button">Vezi toate evenimentele</Button>
  </Link>
</div>




                <BenefitsSection />

                <div className="section-break"></div> 

                <OrganizerPromo />

                <div className="section-break"></div> 

                {/* Carusele pe categorii înfășurate corect */}
                <div className="category-carousel-wrapper">
                  <CategoryCarousel category="Muzică" />
                  
                <div className="section-break"></div> 
                  <CategoryCarousel category="Teatru" />
                  
                <div className="section-break"></div> 
                  <CategoryCarousel category="Stand-up" />
                  
                <div className="section-break"></div> 
                  <CategoryCarousel category="Business" />
                </div>
              </>
            }
          />

          <Route path="/account" element={<Login />} />
          <Route path="/register" element={<Register />} /> 
          <Route path="/adauga-eveniment" element={<AddEvent />} />
          <Route path="/event/:id" element={<EventPage />} />
          <Route path="/request-organizer" element={<RequestOrganizer />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/organizer/:organizerId" element={<MyEvents />} />
          <Route path="/organizer/:userId" element={<MyEvents />} />
          <Route path="/my-events" element={<MyEvents />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/myTickets" element={<MyTickets />} />
          <Route path="/edit-event/:id" element={<EditEventPage />} />
          <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
          <Route path="/evenimente" element={<AllEventsPage />} />
          <Route path="/organizers" element={<OrganizersPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/user-profile" element={<UserProfileLayout />} />
          <Route path="/all-events" element={<AllEventsPage />} />

        </Routes>
      </main>

      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
      </div>
  );
}

function App() {
  return (
    <Router>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </Router>
  );
}

export default App;
