import { useRef, useReducer } from "react";
import { Text, HStack, Flex } from "@chakra-ui/react";
import { useInfinitySearch } from "./customHook/useInfinitySearch";
import { QueryParamsActionKind, queryParamsReducer } from "./reducer";
import { RepositoryProps } from "./interface";
import { Navbar } from "./component/Navbar";
import { SearchInput } from "./component/Input";
import { Dropdown } from "./component/Dropdown";
import { Repository } from "./component/Repository";
import { options } from "./data/option";
import { generateValue } from "./utils";
import { Loader } from "./component/Loader";

function App() {
  const queryTerm = new URLSearchParams(window.location.search).get("q");
  const [state, dispatch] = useReducer(queryParamsReducer, {
    page: 1,
    queryTerm: queryTerm || "",
    currentResult: [],
    ...generateValue(options),
  });
  const endofPage = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const { error, loading } = useInfinitySearch({
    observer,
    state,
    dispatch,
    endofPage,
  });

  function handleQueryParamsChange(name: string, value: string) {
    dispatch({
      type: QueryParamsActionKind.CHANGE_PARAMS,
      payload: {
        name,
        value,
      },
    });
  }

  function handleReset() {
    dispatch({
      type: QueryParamsActionKind.RESET_PAGE,
    });
  }

  return (
    <>
      <Navbar>
        <SearchInput queryTerm={queryTerm} reset={handleReset} />
        <HStack>
          {options.map(({ term, list }) => (
            <Dropdown
              key={term}
              term={term}
              currentValue={state[term]}
              list={list}
              handleChange={handleQueryParamsChange}
            />
          ))}
        </HStack>
      </Navbar>
      <Flex justify="space-between" wrap="wrap" maxW="960px" mx="auto" p={4}>
        {state.currentResult.map((repository: RepositoryProps) => (
          <Repository key={repository.id} repository={repository} />
        ))}
      </Flex>
      {loading && <Loader />}
      {error && <Text textAlign="center">{error.message}</Text>}
      <div ref={endofPage} />
    </>
  );
}

export default App;
