import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './Home';
import {HomeProvider} from "./services/views/HomeContext";
import {theme} from "./Theme";
import {ThemeProvider} from '@emotion/react';
import {CssBaseline} from "@mui/material";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <HomeProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Home/>
            </ThemeProvider>
        </HomeProvider>
    </React.StrictMode>
);
