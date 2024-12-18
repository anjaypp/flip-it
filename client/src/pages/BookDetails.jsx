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
  const { id } = useParams(); // Get the book ID from URL params
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId] = useState(localStorage.getItem("userId"));
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistMessage, setWishlistMessage] = useState("");

  useEffect(() => {
    // Function to fetch book data from the API
    const fetchBook = async () => {
      try {
        console.log("Fetching book with ID:", id);
        const response = await axios.get(`http://localhost:3000/api/book/book/${id}`);
        setBook(response.data.data); // Set book data to state
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!book) {
    return <div>No book found</div>;
  }

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: 3 }}>
      <Grid container spacing={4}>
        {/* Left Column - Book Cover and Buttons */}
        <Grid item xs={12} md={4}>
          <Card>
            <Box
              component="img"
              src={book.coverImage.optimizedUrl || "/default-cover.jpg"} // Fallback if no cover image
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
                >
                  Preview
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  fullWidth
                  startIcon={<ShoppingCart />}
                >
                  Buy Now
                </Button>
                <Button variant="contained" fullWidth>
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
                <Box
                  sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}
                >
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookDetails;
