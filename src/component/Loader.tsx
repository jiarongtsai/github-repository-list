import { Box, Spinner } from "@chakra-ui/react";
export const Loader = () => {
  return (
    <Box maxW="960px" m="15px auto" textAlign="center">
      <Spinner />
    </Box>
  );
};
