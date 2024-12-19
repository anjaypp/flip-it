import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Typography,
  Chip,
  Paper,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { Preview as PreviewIcon, ShoppingCart, Bookmark } from "@mui/icons-material";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId] = useState(localStorage.getItem("userId"));
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistMessage, setWishlistMessage] = useState("");
  const [preview, setPreview] = useState(null); // State to store the preview data
  const [previewLoading, setPreviewLoading] = useState(false); // State for loading status
  const [previewError, setPreviewError] = useState(null); // State for error status

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/book/book/${id}`);
        setBook(response.data.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleAddToWishlist = async () => {
    if (!userId) {
      alert("Please log in to add books to your wishlist.");
      return;
    }

    try {
      setWishlistLoading(true);
      const response = await axios.post(
        `http://localhost:3000/api/wishlist/${userId}/add-wishlist`,
        { bookId: id }
      );
      setWishlistMessage(response.data.message);
    } catch (err) {
      setWishlistMessage(
        err.response ? err.response.data.message : "Failed to add book to wishlist."
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  // Function to fetch ebook preview
  const fetchEbookPreview = async () => {
    if (!book) return;

    setPreviewLoading(true);
    setPreviewError(null);

    try {
      const previewResponse = await axios.post("http://localhost:3000/api/books/preview", {
        ebookUrl: book.bookFile.url,
      });
      setPreview(previewResponse.data.preview);
    } catch (err) {
      setPreviewError("Failed to load ebook preview.");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!userId) {
      alert("Please log in to add books to your cart.");
      return;
    }
  
    try {
      const response = await axios.post(
        `http://localhost:3000/api/cart/add-to-cart/${userId}`,
        { bookId: id } // Pass the bookId in the request body
      );
      alert(response.data.message || "Book added to cart successfully!");
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to add book to cart. Please try again later."
      );
    }
  };
  

  const handleCheckout = async () => {
    if (!userId) {
      alert("Please log in to purchase.");
      return;
    }
  
    try {
      // Step 1: Fetch Razorpay key from the backend
      const { data: { keyId } } = await axios.get("http://localhost:3000/api/order/get-razorpay-key");
  
      // Step 2: Place an order
      const orderResponse = await axios.post("http://localhost:3000/api/order/place-order", {
        userId,
        items: [{ bookId: id, price: book.price }],
      });
  
      const { razorpayOrderId, amount } = orderResponse.data;
  
      // Step 3: Load Razorpay script and open payment modal
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const razorpay = new window.Razorpay({
          key: keyId, // Use the fetched Razorpay key
          amount: amount,
          currency: "INR",
          order_id: razorpayOrderId,
          handler: async (response) => {
            try {
              // Step 4: Verify payment
              await axios.post("http://localhost:3000/api/order/verify-payment", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderResponse.data.orderId,
              });
              alert("Payment successful! Your order has been placed.");
            } catch (err) {
              alert("Payment verification failed. Please contact support.");
            }
          },
          theme: {
            color: "#F37254",
          },
        });
  
        razorpay.open();
      };
      document.body.appendChild(script);
    } catch (err) {
      alert("Failed to initiate checkout. Please try again later.");
    }
  };
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!book) return <div>No book found</div>;

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: 3 }}>
      <Grid container spacing={4}>
        {/* Left Column - Book Cover and Buttons */}
        <Grid item xs={12} md={4}>
          <Card>
            <Box
              component="img"
              src={book.coverImage.optimizedUrl || "/default-cover.jpg"}
              alt="Book Cover"
              sx={{ width: "200px", height: "auto", display: "block", mx: "auto", marginTop: 2 }}
            />
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button
                  variant="contained"
                  color="info"
                  fullWidth
                  startIcon={<PreviewIcon />}
                  onClick={fetchEbookPreview} 
                >
                  {previewLoading ? "Loading..." : "Preview"}
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  fullWidth
                  startIcon={<ShoppingCart />}
                  onClick={handleCheckout}
                >
                  Buy Now
                </Button>
                <Button variant="contained" onClick={handleAddToCart} fullWidth>
                  Add to Cart
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Bookmark />}
                  onClick={handleAddToWishlist}
                  disabled={wishlistLoading}
                >
                  {wishlistLoading ? "Adding..." : "Add to Wishlist"}
                </Button>
                {wishlistMessage && (
                  <Typography variant="body2" color="success" align="center">
                    {wishlistMessage}
                  </Typography>
                )}
                <Typography variant="body2" align="center">
                  Available ebook formats:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
                  {book.formats && book.formats.length > 0 ? (
                    book.formats.map((format) => (
                      <Chip key={format} label={format.toUpperCase()} size="small" color="primary" />
                    ))
                  ) : (
                    <Chip label="No formats available" size="small" color="default" />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Book Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              {book.title} by {book.author}
            </Typography>
            <Typography variant="h5" color="primary" sx={{ mb: 4 }}>
              Price: {book.price ? `₹${book.price}` : "Not Available"}
            </Typography>

            <Typography variant="body1" sx={{ mb: 4 }}>
              {book.description || "No description available."}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Table with book details */}
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>ISBN-13:</TableCell>
                  <TableCell>{book.isbn || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Language:</TableCell>
                  <TableCell>{book.language || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Publication House:</TableCell>
                  <TableCell>{book.publisher || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Published On:</TableCell>
                  <TableCell>{book.publicationDate || "N/A"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Genre:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 4 }}>
                {book.categories && book.categories.length > 0 ? (
                  book.categories.map((category) => (
                    <Chip key={category} label={category} color="secondary" />
                  ))
                ) : (
                  <Chip label="No genres available" color="default" />
                )}
              </Box>

              <Typography variant="h6" sx={{ mb: 2 }}>
                Tags:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {book.tags && book.tags.length > 0 ? (
                  book.tags.map((tag) => (
                    <Chip key={tag} label={tag} variant="outlined" size="small" />
                  ))
                ) : (
                  <Chip label="No tags available" size="small" />
                )}
              </Box>
            </Box>
          </Paper>

          {/* Preview Display */}
          {preview && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Ebook Preview:
              </Typography>
              <embed
                src={`data:application/pdf;base64,${preview}`}
                type="application/pdf"
                width="100%"
                height="600px"
              />
            </Box>
          )}

          {/* Error for preview */}
          {previewError && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {previewError}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookDetails;
