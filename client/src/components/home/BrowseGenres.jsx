import React from 'react';
import { Box, Card, CardMedia, Typography, Grid } from '@mui/material';
import banner2 from '../../assets/banner2.png';
import { Link } from 'react-router-dom';


const genres = [
  { title: 'Fiction'},
  { title: 'Non-Fiction'},
  { title: 'Thrillers'},
  { title: 'Children'}, 
];

export default function BrowseGenres() {
  return (
    <Box sx={{ m : 3}}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Browse Genres <Typography component="span" variant="subtitle2" sx={{ color: 'primary.main', cursor: 'pointer' }}><Link to="/genres">(view all)</Link></Typography>
      </Typography>

      <Grid container spacing={2}>
        {genres.map((genre, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Card sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
              <CardMedia
                component="img"
                image={banner2}
                alt={genre.title}
                sx={{ height: 150 }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0, 0, 0, 0.4)',
                  color: 'white',
                }}
              >
                <Typography variant="h6">{genre.title}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
