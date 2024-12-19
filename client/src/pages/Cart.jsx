import React, { useState, useEffect } from "react";
import ShoppingCartSharpIcon from "@mui/icons-material/ShoppingCartSharp";
import DeleteOutlineSharpIcon from "@mui/icons-material/DeleteOutlineSharp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
import "./styles/Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Cart Items
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/cart/get-cart/${localStorage.getItem("userId")}`
        );
        setCartItems(response.data.cart);
      } catch (err) {
        setError("Failed to load cart items.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  // Remove Item from Cart
  const handleRemoveItem = async (bookId) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/cart/remove-from-cart/${localStorage.getItem("userId")}/${bookId}`
      );
      setCartItems(cartItems.filter((item) => item.book._id !== bookId));
    } catch (err) {
      alert("Failed to remove item from cart.");
    }
  };

  // Handle Checkout
  const handleCheckout = async () => {
    const userId = localStorage.getItem("userId");
    
    if (!userId) {
      alert("Please log in to purchase.");
      return;
    }
  
    try {
      // Step 1: Fetch Razorpay key from the backend
      const { data: { keyId } } = await axios.get("http://localhost:3000/api/order/get-razorpay-key");
  
      // Step 2: Create an order on the backend
      const orderResponse = await axios.post("http://localhost:3000/api/order/place-order", {
        userId,
        items: cartItems.map(item => ({
          bookId: item.book._id, 
          price: item.book.price,
          quantity: 1, // Adjust this as needed for actual quantity
        })),
      });
  
      const { razorpayOrderId, amount, orderId } = orderResponse.data;
  
      // Step 3: Load Razorpay script and open payment modal
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const razorpay = new window.Razorpay({
          key: keyId, // Use the fetched Razorpay key
          amount: amount, // Amount to be paid
          currency: "INR",
          order_id: razorpayOrderId,
          handler: async (response) => {
            try {
              // Step 4: Verify payment
              await axios.post("http://localhost:3000/api/order/verify-payment", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderId,
              });
              alert("Payment successful! Your order has been placed.");
              // Optionally, you could redirect to a success page here.
            } catch (err) {
              alert("Payment verification failed. Please contact support.");
            }
          },
          theme: {
            color: "#F37254", // Customize color as needed
          },
        });
  
        razorpay.open();
      };
      document.body.appendChild(script);
    } catch (err) {
      alert("Failed to initiate checkout. Please try again later.");
    }
  };
  

  // Render Loading or Error
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box sx={{ padding: 2 }}>
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        sx={{ textAlign: "left", mb: 2 }}
        className="Cart-arrow"
      >
        Back
      </Button>
      <Typography variant="h4" align="center" gutterBottom>
        Shopping Cart
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        You have {cartItems.length} items in your cart
      </Typography>

      {cartItems.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          Your cart is empty. Start adding books!
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {cartItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.book._id}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 2,
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={item.book.coverImage.url}
                  alt={item.book.title}
                  style={{
                    width: "100%",
                    height: "auto",
                    maxWidth: "150px",
                    marginBottom: "1rem",
                  }}
                />
                <Typography variant="h6">{item.book.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {item.book.description}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    mt: 2,
                  }}
                >
                  <Typography variant="body1">Quantity: 1</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    ₹{item.book.price}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleRemoveItem(item.book._id)}
                    className="cart-item-delete"
                  >
                    <DeleteOutlineSharpIcon />
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 4,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          size="large"
          className="cart-checkout"
          startIcon={<ShoppingCartSharpIcon />}
          onClick={handleCheckout}
        >
          Checkout
        </Button>
      </Box>
    </Box>
  );
};

export default Cart;
