import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import banner3 from '../assets/banner3.png';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import Bookmark from '@mui/icons-material/Bookmark';

const EbookDetailsPage = () => {
  const bookDetails = {
    title: '1984',
    author: 'George Orwell',
    price: '$3.99 USD',
    formats: ['epub', 'mobi', 'pdf', 'rtf', 'pdb', 'txt'],
    isbn: '9781452443447',
    language: 'English',
    pages: '500',
    publishedOn: 'Feb 16, 2012',
    categories: ['Fiction', 'Classics', 'Dystopian'],
    tags: [
      'science fiction',
      'dystopia',
      'post-apocalyptic',
      'novel',
    ],
  };

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 3 }}>
      <Grid container spacing={4}>
        {/* Left Column - Book Cover and Buttons */}
        <Grid item xs={12} md={4}>
          <Card>
            <Box
              component="img"
              src={banner3}
              alt="Book Cover"
              sx={{ width: '100%', height: 'auto' }}
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  color="warning"
                  fullWidth
                  startIcon={<ShoppingCart />}
                >
                  Buy Now
                </Button>
                <Button variant="outlined" fullWidth startIcon={<Bookmark />}>
                  Add to Wishlist
                </Button>
                <Typography variant="body2" align="center">
                  Available ebook formats:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                  {bookDetails.formats.map((format) => (
                    <Chip key={format} label={format.toUpperCase()} size="small" color="primary" />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Book Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              {bookDetails.title} by {bookDetails.author}
            </Typography>
            <Typography variant="h5" color="primary" sx={{ mb: 4 }}>
              {bookDetails.price}
            </Typography>

            <Typography variant="body1" sx={{ mb: 4 }}>
              1984 is a dystopian novel by English novelist George Orwell, published in 1949.
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>ISBN-13:</TableCell>
                  <TableCell>{bookDetails.isbn}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Language:</TableCell>
                  <TableCell>{bookDetails.language}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Pages:</TableCell>
                  <TableCell>{bookDetails.pages}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Published On:</TableCell>
                  <TableCell>{bookDetails.publishedOn}</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Categories:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                {bookDetails.categories.map((category) => (
                  <Chip key={category} label={category} color="secondary" />
                ))}
              </Box>

              <Typography variant="h6" sx={{ mb: 2 }}>
                Tags:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {bookDetails.tags.map((tag) => (
                  <Chip key={tag} label={tag} variant="outlined" size="small" />
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EbookDetailsPage;
