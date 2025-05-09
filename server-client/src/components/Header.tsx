// src/components/Header.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, Chip } from '@mui/material';
import {useHome} from "../services/views/HomeContext";

const Header = () => {
    const {serverStatus} = useHome();
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    SignalR Server Control
                </Typography>
                <Chip
                    label={serverStatus}
                    color={serverStatus.toLowerCase() === 'running' ? 'success' : 'error'}
                    variant="outlined"
                />
            </Toolbar>
        </AppBar>
    );
};

export default Header;
