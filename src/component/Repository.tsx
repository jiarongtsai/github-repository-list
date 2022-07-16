import {
  Flex,
  LinkBox,
  LinkOverlay,
  Heading,
  Tag,
  TagLabel,
  TagRightIcon,
  Spacer,
  Code,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

export const Repository = ({ repository }: any) => {
  return (
    <LinkBox
      w="280px"
      minH="100px"
      flexGrow={1}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p="3"
      borderWidth="1px"
      rounded="md"
      m={2}
    >
      <Heading size="md" my="1">
        <LinkOverlay href={repository.html_url}>{repository.name}</LinkOverlay>
      </Heading>
      <Flex>
        {repository.language && <Code>{repository.language}</Code>}
        <Spacer />
        <Tag size="sm" colorScheme="blue">
          <TagLabel>{repository.stargazers_count}</TagLabel>
          <TagRightIcon as={StarIcon} />
        </Tag>
      </Flex>
    </LinkBox>
  );
};
