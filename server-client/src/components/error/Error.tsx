import {Container, CssBaseline, Paper, ThemeProvider, Typography} from "@mui/material";
import {theme} from "../../Theme";

type Props = {
    error: string;
}

export const FatalError = ({error}: Props) => {
    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Container sx={{mt: 4, flex: 1}}>
                    <Paper elevation={3} sx={{p: 2, mt: 2}}>
                        <Typography variant="h6" gutterBottom>
                            Fatal Error
                        </Typography>
                        <Typography variant="body1" color="error">
                            {error}
                        </Typography>
                    </Paper>
                </Container>
            </ThemeProvider>
        </>
    );
}
