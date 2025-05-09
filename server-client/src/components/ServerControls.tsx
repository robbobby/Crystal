import React from 'react';
import { Button, Stack } from '@mui/material';
import { PlayArrow, Stop } from '@mui/icons-material';
import { ServerStatus } from '../model/ServerStatus';
import {useHome} from "../services/views/HomeContext";

const ServerControls: React.FC= () => {
 const {serverStatus, startServer, stopServer} = useHome();
    return (
        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
            <Button
                variant="contained"
                color="success"
                onClick={startServer}
                startIcon={<PlayArrow />}
                disabled={serverStatus.toLowerCase() === 'running'}
            >
                Start Server
            </Button>
            <Button
                variant="contained"
                color="error"
                onClick={stopServer}
                startIcon={<Stop />}
                disabled={serverStatus.toLowerCase() !== 'running'}
            >
                Stop Server
            </Button>
        </Stack>
    );
};

export default ServerControls;
