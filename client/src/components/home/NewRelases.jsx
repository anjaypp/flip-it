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
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: { xs: '1rem', sm: '1.5rem', md: '2rem 3rem' },
        backgroundColor: '#daae40',
      }}
    >
      {/* Left Side: Title and Description */}
      <Box
        sx={{
          maxWidth: { xs: '100%', md: '50%' },
          textAlign: { xs: 'center', md: 'left' },
          marginBottom: { xs: '1.5rem', md: '0' },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            marginBottom: '16px',
            color: '#fff',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
          }}
        >
          New Releases This Week
        </Typography>
        <Typography
          variant="body1"
          sx={{
            marginBottom: '24px',
            color: '#fff',
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
          }}
        >
          It’s time to update your reading list with some of the latest and greatest releases
          in the literary world. From heart-pumping thrillers to captivating memoirs, this week’s
          new releases offer something for everyone.
        </Typography>
      </Box>

      {/* Right Side: Rotating Angled Stacked Carousel */}
      <Box
        sx={{
          position: 'relative',
          width: { xs: '100%', sm: '80%', md: '300px' },
          height: { xs: '250px', sm: '300px', md: '400px' },
          margin: { xs: '0 auto', md: '0' },
          display: 'flex',
          justifyContent: 'center', // Center alignment
          alignItems: 'center', // Vertical alignment
        }}
      >
        {banners.map((image, index) => {
          // Calculate position relative to current index
          const position = (index - currentIndex + banners.length) % banners.length;

          // Styles for each image based on its position
          const styles = {
            position: 'absolute',
            top: '50%',
            left: { xs: '50%', md: position === 0 ? '10%' : position === 1 ? '35%' : '55%' },
            transform:
              position === 0
                ? 'translate(-50%, -50%) scale(1.1)'
                : position === 1
                ? 'translate(-50%, -50%) scale(1)'
                : 'translate(-50%, -50%) scale(0.9)',
            zIndex: position === 0 ? 3 : position === 1 ? 2 : 1,
            transition: 'all 0.5s ease-in-out',
            opacity: position === 0 ? 1 : 0.8,
            width: { xs: position === 0 ? '150px' : '130px', md: position === 0 ? '200px' : '180px' },
            height: { xs: position === 0 ? '200px' : '180px', md: position === 0 ? '300px' : '270px' },
            boxShadow: position === 0 ? '0px 4px 15px rgba(0, 0, 0, 0.3)' : 'none',
          };

          return <CardMedia key={index} component="img" image={image} alt={`Banner ${index + 1}`} sx={styles} />;
        })}
      </Box>
    </Box>
  );
};

export default NewReleases;
