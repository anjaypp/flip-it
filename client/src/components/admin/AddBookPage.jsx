import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Container, Box } from '@mui/material';
import axios from 'axios';

const AddBookPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    isbn: '',
    categories: '',
    price: '',
    discountedPrice: '',
    publisher: '',
    publicationDate: '',
    tags: '',
    coverImage: null,
    bookFile: null,
    audioBookFile: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        formDataToSubmit.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post('/api/admin/addBook', formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
    } catch (err) {
      console.error('Error adding book:', err);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Add a New Book
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Author"
              variant="outlined"
              fullWidth
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="ISBN"
              variant="outlined"
              fullWidth
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Categories (comma separated)"
              variant="outlined"
              fullWidth
              name="categories"
              value={formData.categories}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Price"
              variant="outlined"
              fullWidth
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Discounted Price"
              variant="outlined"
              fullWidth
              name="discountedPrice"
              value={formData.discountedPrice}
              onChange={handleChange}
              required
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Publisher"
              variant="outlined"
              fullWidth
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Publication Date"
              variant="outlined"
              fullWidth
              name="publicationDate"
              value={formData.publicationDate}
              onChange={handleChange}
              required
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Tags (comma separated)"
              variant="outlined"
              fullWidth
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Box>
              <Button variant="contained" component="label">
                Upload Cover Image
                <input
                  type="file"
                  name="coverImage"
                  onChange={handleFileChange}
                  hidden
                  required
                />
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box>
              <Button variant="contained" component="label">
                Upload Book File
                <input
                  type="file"
                  name="bookFile"
                  onChange={handleFileChange}
                  hidden
                  required
                />
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box>
              <Button variant="contained" component="label">
                Upload Audiobook File
                <input
                  type="file"
                  name="audioBookFile"
                  onChange={handleFileChange}
                  hidden
                />
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Add Book
        </Button>
      </form>
    </Container>
  );
};

export default AddBookPage;
