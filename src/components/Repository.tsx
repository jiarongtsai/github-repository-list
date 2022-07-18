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
import { RepositoryProps } from "../interfaces/interface";

export const Repository = (props: RepositoryProps) => {
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
        <LinkOverlay href={props.html_url}>{props.name}</LinkOverlay>
      </Heading>
      <Flex>
        {props.language && <Code>{props.language}</Code>}
        <Spacer />
        <Tag size="sm" colorScheme="blue">
          <TagLabel>{props.stargazers_count}</TagLabel>
          <TagRightIcon as={StarIcon} />
        </Tag>
      </Flex>
    </LinkBox>
  );
};
