import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CardMedia } from '@mui/material';
import banner1 from '../../assets/banner1.png';
import banner2 from '../../assets/banner2.png';
import banner3 from '../../assets/banner3.png';

const banners = [banner1, banner2, banner3];

const NewReleases = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '2rem 0.9rem 2rem 3rem',
        backgroundColor: '#daae40',
      }}
    >
      {/* Left Side: Title and Description */}
      <Box sx={{ maxWidth: '50%' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '16px', color: '#fff' }}>
          New Releases This Week
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '24px', color: '#fff' }}>
          It’s time to update your reading list with some of the latest and greatest releases
          in the literary world. From heart-pumping thrillers to captivating memoirs, this week’s
          new releases offer something for everyone.
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#fbc02d',
            color: '#000',
            textTransform: 'none',
            padding: '8px 16px',
            '&:hover': {
              backgroundColor: '#f9a825',
            },
          }}
        >
          Subscribe
        </Button>
      </Box>

      {/* Right Side: Rotating Angled Stacked Carousel */}
      <Box sx={{ position: 'relative', width: '300px', height: '400px', paddingLeft: '200px' }}>
        {banners.map((image, index) => {
          // Calculate position relative to current index
          const position = (index - currentIndex + banners.length) % banners.length;

          // Styles for each image based on its position
          const styles = {
            position: 'absolute',
            top: '50%',
            left: position === 0 ? '10%' : position === 1 ? '35%' : '55%',
            transform:
              position === 0
                ? 'translate(-50%, -50%) scale(1.1)' 
                : position === 1
                ? 'translate(-50%, -50%) scale(1)' 
                : 'translate(-50%, -50%) scale(0.9)',
            zIndex: position === 0 ? 3 : position === 1 ? 2 : 1, 
            transition: 'all 0.5s ease-in-out',
            opacity: position === 0 ? 1 : 1, 
            width: position === 0 ? '200px' : '180px', 
            height: position === 0 ? '300px' : '270px',
            boxShadow: position === 0 ? '0px 4px 15px rgba(0, 0, 0, 0.3)' : 'none',
          };

          return <CardMedia key={index} component="img" image={image} alt={`Banner ${index + 1}`} sx={styles} />;
        })}
      </Box>
    </Box>
  );
};

export default NewReleases;
