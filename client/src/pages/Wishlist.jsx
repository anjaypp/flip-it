import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import Card from "../components/common/Card";
import axios from "axios";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        console.log(userId);
        const response = await axios.get(`http://localhost:3000/api/wishlist/${userId}/get-wishlist`);
        setWishlist(response.data.wishlist);
      } catch (error) {
        setError("Failed to fetch wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userId]);

  const handleRemove = async (bookId) => {
    try {
      await axios.delete(`http://localhost:3000/api/wishlist/${userId}/remove-wishlist/${bookId}`);
      setWishlist(wishlist.filter((item) => item._id !== bookId));
    } catch (error) {
      console.error("Failed to remove book from wishlist:", error);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>{error}</Typography>;
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Typography variant="h4" gutterBottom>
        Your Wishlist
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={2}>
        {wishlist.length > 0 ? (
          wishlist.map((book) => (
            <Box key={book._id} display="flex" flexDirection="column" alignItems="center" width={300}>
              <Card
                bookId={book._id}
                coverImage={book.coverImage.optimizedUrl}
                categories={book.categories}
                title={book.title}
                author={book.author}
              />
              <Button
                variant="contained"
                color="error"
                onClick={() => handleRemove(book._id)}
                sx={{ mt: 1 }}
              >
                Remove
              </Button>
            </Box>
          ))
        ) : (
          <Typography>No items in your wishlist</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Wishlist;
