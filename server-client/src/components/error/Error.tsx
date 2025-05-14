import { Box, Button, Container, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import WarningIcon from '@mui/icons-material/Warning';

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
  100% {
    transform: translateY(0px) rotate(0deg);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const glitch = keyframes`
  0% {
    transform: translate(0);
    text-shadow: 2px 2px #ff4444;
  }
  20% {
    transform: translate(-2px, 2px);
    text-shadow: -2px -2px #ff0000;
  }
  40% {
    transform: translate(-2px, -2px);
    text-shadow: 2px -2px #ff4444;
  }
  60% {
    transform: translate(2px, 2px);
    text-shadow: -2px 2px #ff0000;
  }
  80% {
    transform: translate(2px, -2px);
    text-shadow: 2px 2px #ff4444;
  }
  100% {
    transform: translate(0);
    text-shadow: 2px 2px #ff4444;
  }
`;

const StyledErrorIcon = styled(ErrorOutlineIcon)`
  animation: ${float} 3s ease-in-out infinite;
  font-size: 120px;
  color: #d32f2f;
`;

const StyledWarningIcon = styled(WarningIcon)`
  animation: ${rotate} 8s linear infinite;
  position: absolute;
  opacity: 0.2;
`;

const StyledTypography = styled(Typography)`
  animation: ${glitch} 1s linear infinite;
  position: relative;
`;

interface FatalErrorProps {
  error?: Error;
  onReset?: () => void;
}

export const FatalError = ({ error, onReset }: FatalErrorProps) => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          gap: 4,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <StyledWarningIcon
          sx={{
            fontSize: 400,
            top: -100,
            left: -100,
            color: '#ffcdd2'
          }}
        />
        <StyledWarningIcon
          sx={{
            fontSize: 300,
            bottom: -50,
            right: -50,
            color: '#ffcdd2'
          }}
        />

        <StyledErrorIcon />

        <StyledTypography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            color: '#d32f2f',
            mb: 2,
          }}
        >
          Fatal Error
        </StyledTypography>

        <Typography
          variant="h5"
          sx={{
            color: '#666',
            maxWidth: '600px',
            mb: 3,
            position: 'relative',
            zIndex: 1,
          }}
        >
          Something went terribly wrong and we couldn't recover
        </Typography>

        {error && (
          <Box
            sx={{
              backgroundColor: '#d32f2f',
              p: 3,
              borderRadius: 2,
              maxWidth: '100%',
              overflow: 'auto',
              animation: `${pulse} 2s infinite ease-in-out`,
              position: 'relative',
              zIndex: 1,
              boxShadow: '0 0 20px rgba(211, 47, 47, 0.5)',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'white',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {error.message || 'Unknown error occurred'}
            </Typography>
          </Box>
        )}

        {onReset && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<RefreshIcon />}
            onClick={onReset}
            sx={{
              mt: 4,
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              position: 'relative',
              zIndex: 1,
              '&:hover': {
                transform: 'scale(1.05)',
                transition: 'transform 0.2s ease-in-out',
                boxShadow: '0 0 20px rgba(25, 118, 210, 0.5)',
              },
            }}
          >
            Try Again
          </Button>
        )}
      </Box>
    </Container>
  );
};
