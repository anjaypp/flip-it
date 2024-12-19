import React from 'react';
import { Box, Container, Grid, Typography, IconButton, Link } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

// Footer Links
const links = [
  { title: 'About Us', url: '#' },
  { title: 'Contact', url: '#' },
  { title: 'Privacy Policy', url: '#' },
  { title: 'Terms of Service', url: '#' },
];

export default function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: '#daae40',
        color: '#fff',
        padding: '40px 0',
        marginTop: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Flip It
            </Typography>
            <Typography variant="body2">
            Discover endless stories and insights on our eBook platform, designed to bring your reading journey to life with just a click!
            </Typography>
          </Grid>

          {/* Links Section */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            {links.map((link, index) => (
              <Typography key={index}>
                <Link href={link.url} color="inherit" underline="none">
                  {link.title}
                </Link>
              </Typography>
            ))}
          </Grid>

          {/* Social Media Section */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Box>
              <IconButton color="inherit" href="https://facebook.com">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" href="https://twitter.com">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" href="https://instagram.com">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" href="https://linkedin.com">
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ borderTop: '1px solid #555', marginTop: '20px', paddingTop: '20px', textAlign: 'center' }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} FilpIt. All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
