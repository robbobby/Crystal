import { Box, CircularProgress, Typography } from "@mui/material";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const pulse = keyframes`
  0% {
    transform: scale(0.95);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.5;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const RotatingBox = styled(Box)`
  animation: ${pulse} 2s ease-in-out infinite;
`;

const LoadingText = styled(Typography)`
  animation: ${fadeIn} 1s ease-in-out infinite alternate;
`;

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  message?: string;
  showMessage?: boolean;
}

export const LoadingSpinner = ({
  size = "medium",
  message = "Loading...",
  showMessage = true,
}: LoadingSpinnerProps) => {
  // Define sizes for different variants
  const sizes = {
    small: {
      container: 100,
      outer: 50,
      middle: 40,
      inner: 30,
    },
    medium: {
      container: 150,
      outer: 75,
      middle: 60,
      inner: 45,
    },
    large: {
      container: 200,
      outer: 100,
      middle: 80,
      inner: 60,
    },
  };

  const currentSize = sizes[size];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        padding: 2,
      }}
    >
      <RotatingBox
        sx={{
          position: "relative",
          width: currentSize.container,
          height: currentSize.container,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress
          size={currentSize.outer}
          thickness={2}
          sx={{
            position: "absolute",
            color: "primary.main",
          }}
        />
        <CircularProgress
          size={currentSize.middle}
          thickness={3}
          sx={{
            position: "absolute",
            color: "secondary.main",
            animation: "spin 3s linear infinite",
            "@keyframes spin": {
              "0%": {
                transform: "rotate(0deg)",
              },
              "100%": {
                transform: "rotate(-360deg)",
              },
            },
          }}
        />
        <CircularProgress
          size={currentSize.inner}
          thickness={4}
          sx={{
            position: "absolute",
            color: "success.main",
          }}
        />
      </RotatingBox>
      {showMessage && (
        <LoadingText
          variant={
            size === "small" ? "body2" : size === "medium" ? "body1" : "h6"
          }
          sx={{
            color: "text.primary",
          }}
        >
          {message}
        </LoadingText>
      )}
    </Box>
  );
};
