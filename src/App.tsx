import { useRef, useReducer } from "react";
import { Text, HStack, Flex } from "@chakra-ui/react";
import { useInfinitySearch } from "./hooks/useInfinitySearch";
import {
  QueryParamsActionKind,
  queryParamsReducer,
} from "./reducer/queryParamsReducer";
import { RepositoryProps } from "./interfaces/interface";
import { Navbar } from "./components/Navbar";
import { SearchInput } from "./components/Input";
import { Dropdown } from "./components/Dropdown";
import { Repository } from "./components/Repository";
import { Loader } from "./components/Loader";
import { options } from "./data/option";
import { generateValue } from "./utils";

function App() {
  const queryTerm = new URLSearchParams(window.location.search).get("q");
  const [state, dispatch] = useReducer(queryParamsReducer, {
    page: 1,
    currentResult: [],
    ...generateValue(options),
  });
  const endofPage = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const { error, loading } = useInfinitySearch({
    observer,
    endofPage,
    url:
      queryTerm &&
      state.page &&
      `https://api.github.com/orgs/${queryTerm}/repos?page=${state.page}&type=${state.type}&sort=${state.sort}&direction=${state.direction}`,
    noMoreDataFunction: () =>
      dispatch({
        type: QueryParamsActionKind.NO_MORE_PAGE,
      }),
    fetchingNewDataFunction: (data: []) =>
      dispatch({
        type: QueryParamsActionKind.LOAD_NEXT_PAGE,
        payload: { nextPageData: data },
      }),
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
      <Flex wrap="wrap" maxW="960px" mx="auto" p={4}>
        {state.currentResult.map((repository: RepositoryProps) => (
          <Repository key={repository.id} {...repository} />
        ))}
      </Flex>
      {loading && <Loader />}
      {error && <Text textAlign="center">{error.message}</Text>}
      <div ref={endofPage} />
    </>
  );
}

export default App;
