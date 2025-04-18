import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [username, setUsername] = useState(null);
  const [openCart, setOpenCart] = useState(false);

  // 🔄 Ascultăm când apare username în localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // 🔁 Când avem username, încărcăm coșul
  useEffect(() => {
    if (username) {
      const stored = localStorage.getItem(`cart_${username}`);
      if (stored) {
        try {
          setCartItems(JSON.parse(stored));
        } catch (e) {
          console.error("Eroare la parsat coșul:", e);
        }
      }
    }
  }, [username]);

  // 💾 Salvăm coșul când se schimbă
  useEffect(() => {
    if (username) {
      localStorage.setItem(`cart_${username}`, JSON.stringify(cartItems));
    }
  }, [cartItems, username]);

  const addToCart = ({ eventId, ticketType, quantity, price, eventTitle }) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.eventId === eventId && item.ticketType === ticketType
      );
  
      let updatedItems;
      if (existing) {
        updatedItems = prev.map((item) =>
          item.eventId === eventId && item.ticketType === ticketType
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedItems = [...prev, { eventId, ticketType, quantity, price, eventTitle }];
      }
  
      // 🔥 Deschide automat coșul
      setOpenCart(true);
  
      return updatedItems;
    });
  };
  

  const clearCart = () => setCartItems([]);

  const loadCartFromStorage = (u) => {
    const stored = localStorage.getItem(`cart_${u}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCartItems(parsed);
        setUsername(u);
      } catch (e) {
        console.error("Eroare la loadCartFromStorage:", e);
      }
    }
  };

  const removeFromCart = (eventId, ticketType) => {
    setCartItems(prev =>
      prev.filter(item => !(item.eventId === eventId && item.ticketType === ticketType))
    );
  };
  
  const updateQuantity = (eventId, ticketType, newQuantity) => {
    setCartItems(prev =>
      prev.map(item =>
        item.eventId === eventId && item.ticketType === ticketType
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item
      )
    );
  };
  

  return (
    <CartContext.Provider
    value={{
      cartItems,
      addToCart,
      clearCart,
      loadCartFromStorage,
      removeFromCart,
      updateQuantity,
      openCart,         // ✅ adaugă această linie
      setOpenCart       // ✅ deja era adăugat, păstrează-l
    }}
  >
    {children}
  </CartContext.Provider>
  
  );
};
