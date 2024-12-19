import React, { useRef } from 'react';
import { Box, Card, CardMedia, CardContent, Typography, Button, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import banner1 from '../../assets/banner1.png';


// Styled Button
const AddToCartButton = styled(Button)({
  backgroundColor: '#FFD700',
  color: '#000',
  '&:hover': {
    backgroundColor: '#FFC107',
  },
});

// Scrollable container styling
const ScrollableContainer = styled(Box)({
  display: 'flex',
  overflowX: 'auto',
  gap: '20px',
  paddingBottom: '10px',
  scrollBehavior: 'smooth',
  '&::-webkit-scrollbar': {
    height: '8px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#cccccc',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#999999',
  },
});

// Scroll Button Styling
const ScrollButton = styled(Button)({
  minWidth: '40px',
  height: '40px',
  borderRadius: '50%',
  margin: '2 0.5rem',
  backgroundColor: '#daae40',
  color: '#000',
  '&:hover': {
    backgroundColor: '#FFC107',
  },
});

export default function TopSellers() {
  const scrollRef = useRef(null);

  const handleScrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const handleScrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const books = [
    {
      title: 'How to Grow Your Online Store',
      description: 'Learn the best strategies to grow your online store in today’s competitive market.',
      price: '19.99',
      oldPrice: '29.99',
      image: '../../../assets/banner1.png',
    },
    {
      title: 'Top 10 Fiction Books This Year',
      description: 'A curated list of the best fiction books that are trending this year.',
      price: '14.99',
      oldPrice: '24.99',
      image: '../../../assets/banner1.png',
    },
    {
      title: 'Mastering SEO in 2024',
      description: 'Tips and tricks to boost your SEO and rank higher on search engines.',
      price: '29.99',
      oldPrice: '39.99',
      image: '../../../assets/banner1.png',
    },
    {
      title: 'Advanced React Patterns',
      description: 'Take your React skills to the next level with advanced design patterns.',
      price: '25.99',
      oldPrice: '35.99',
      image: '../../../assets/banner1.png',
    },
    {
      title: 'The Art of Storytelling',
      description: 'Learn how to tell compelling stories that resonate with your audience.',
      price: '19.99',
      oldPrice: '29.99',
      image: '../../../assets/banner1.png',
    },
  ];

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
      <Typography variant="h4" gutterBottom>
        Top Sellers
      </Typography>

      <Select defaultValue="" displayEmpty sx={{ marginBottom: '20px', width: '200px' }}>
        <MenuItem value="">
          <em>Choose a genre</em>
        </MenuItem>
        <MenuItem value="fiction">Fiction</MenuItem>
        <MenuItem value="non-fiction">Non-Fiction</MenuItem>
        <MenuItem value="self-help">Self-Help</MenuItem>
      </Select>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <ScrollButton onClick={handleScrollLeft}>&#8592;</ScrollButton>
        <ScrollableContainer ref={scrollRef}>
          {books.map((book, index) => (
            <Card key={index} sx={{ minWidth: '250px', maxWidth: '250px', flexShrink: 0 }}>
              <CardMedia component="img" height="150" image={banner1} alt={book.title} />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {book.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', marginRight: '10px' }}>
                    ${book.price}
                  </Typography>
                  <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'gray' }}>
                    ${book.oldPrice}
                  </Typography>
                </Box>
                <AddToCartButton variant="contained" sx={{ marginTop: '15px' }} fullWidth>
                  Add to Cart
                </AddToCartButton>
              </CardContent>
            </Card>
          ))}
        </ScrollableContainer>
        <ScrollButton onClick={handleScrollRight}>&#8594;</ScrollButton>
      </Box>
    </Box>
  );
}
