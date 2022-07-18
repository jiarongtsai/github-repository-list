import { useState } from "react";
import { HStack, Input, IconButton } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

interface SearchInputProps {
  queryTerm: string | null;
  reset: () => void;
}

export const SearchInput = ({ queryTerm, reset }: SearchInputProps) => {
  const [input, setInput] = useState<string>(queryTerm || "");

  function handleSearch() {
    if (input === queryTerm) return;
    if (!input) return;
    window.location.href = `./?q=${input}`;
    reset();
  }

  return (
    <HStack spacing={2}>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          e.key === "Enter" && handleSearch();
        }}
        placeholder="Enter a company"
        variant="filled"
      />
      <IconButton
        onClick={handleSearch}
        aria-label="Search database"
        icon={<SearchIcon />}
        colorScheme="blue"
      />
    </HStack>
  );
};
