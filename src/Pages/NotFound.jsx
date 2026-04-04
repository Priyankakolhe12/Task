import { Box, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Stack spacing={2} alignItems="center">
        <Typography variant="h1" color="error">
          404
        </Typography>
        <Typography variant="h5">Page Not Found</Typography>
      </Stack>
    </Box>
  );
};
