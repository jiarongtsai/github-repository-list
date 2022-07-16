import { Box } from "@chakra-ui/react";

export const Navbar = ({ children }: any) => {
  return (
    <Box
      w="100vw"
      position="sticky"
      top="0"
      bg="white"
      shadow="md"
      style={{ zIndex: 10 }}
    >
      <Box p="4" maxW="960px" m="0 auto">
        {children}
      </Box>
    </Box>
  );
};
