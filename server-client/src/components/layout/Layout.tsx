import React from 'react';
import Header from './Header';
import MirMenuBar from '../menuBar/MirMenuBar';
import { Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';   // ← import Outlet
import { Footer } from "./Footer";

export const Layout: React.FC = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Header />
    <MirMenuBar />
    <Container sx={{ mt: 4, flex: 1 }}>
      <Outlet />
    </Container>
    <Footer />
  </Box>
);
