import {
  Box,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
interface optionProps {
  value: string;
  text: string;
}

export const Dropdown = ({ term, currentValue, list, handleChange }: any) => {
  return (
    <>
      <Box>
        <Text pt={3} pl={[1, 3]} fontSize="xs">
          {term.toUpperCase()}
        </Text>
        <Menu>
          <MenuButton
            px={[1, 4]}
            h="36px"
            minW={{ base: "none", md: "131px" }}
            textAlign="left"
            as={Button}
            rightIcon={<ChevronDownIcon />}
          >
            {currentValue}
          </MenuButton>
          <MenuList>
            {list.map(({ value, text }: optionProps) => (
              <MenuItem
                key={value}
                value={value}
                onClick={() => {
                  handleChange(term, value);
                }}
              >
                {text}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Box>
    </>
  );
};
