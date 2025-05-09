import {Box, Button, Container, CssBaseline, Divider, Paper, ThemeProvider, Typography} from '@mui/material';

import Header from './components/Header';
import MessageList from './components/MessageList';
import ServerControls from './components/ServerControls';
import {theme} from "./Theme";
import {useHome} from "./services/views/HomeContext";
import {FatalError} from "./components/error/Error";

function Home() {
    const {logs, startServer, stopServer, clearLogs, error} = useHome();

    if (error) {
        return (
            <>
                <FatalError error={error}/>
            </>
        );
    }


    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
                <Header/>
                <Container sx={{mt: 4, flex: 1}}>
                    <ServerControls/>

                    <Paper elevation={3} sx={{p: 2, mt: 2}}>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Typography variant="h6" gutterBottom>
                                Logs
                            </Typography>
                            <Button variant="outlined" color="secondary" onClick={clearLogs} sx={{mb: 2}}>
                                Clear Logs
                            </Button>
                        </Box>
                        <Divider sx={{mb: 2}}/>
                        <MessageList messages={logs}/>
                    </Paper>
                </Container>
                <Box component="footer" sx={{p: 2, bgcolor: 'background.paper', mt: 'auto'}}>
                    <Typography variant="body2" color="text.secondary" align="center">
                        SignalR React Client
                    </Typography>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default Home;
