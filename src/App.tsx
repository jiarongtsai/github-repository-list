import { useRef, useReducer } from "react";
import { useInfinitySearch } from "./customHook/useInfinitySearch";
import { QueryParamsActionKind, queryParamsReducer } from "./reducer";
import { RepositoryProps } from "./interface";
import { Input } from "./component/Input";
import { Dropdown } from "./component/Dropdown";
import { Repository } from "./component/Repository";
import { options } from "./data/option";
import { generateValue } from "./utils";

function App() {
  const queryTerm = new URLSearchParams(window.location.search).get("q");
  const [state, dispatch] = useReducer(queryParamsReducer, {
    page: 1,
    queryTerm: queryTerm || "",
    ...generateValue(options),
  });
  const endofPage = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const { repositoryList, setRepositoryList, error, loading }: any =
    useInfinitySearch({
      observer,
      state,
      dispatch,
      endofPage,
    });

  function reset() {
    setRepositoryList([]);
    dispatch({
      type: QueryParamsActionKind.RESET_PAGE,
    });
  }

  function handleQueryParamsChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setRepositoryList([]);
    const { name, value } = e.target;

    dispatch({
      type: QueryParamsActionKind.CHANGE_PARAMS,
      payload: {
        name,
        value,
      },
    });
  }

  console.log("re-render");

  return (
    <>
      <div
        style={{
          position: "sticky",
          top: "0",
          padding: "10px",
          background: "white",
        }}
      >
        <div>Search Bar</div>
        <Input queryTerm={queryTerm} reset={reset} />
        <div>
          {options.map(({ term, list }) => (
            <Dropdown
              key={term}
              term={term}
              currentValue={state[term]}
              list={list}
              handleChange={handleQueryParamsChange}
            />
          ))}
        </div>
      </div>
      {repositoryList.map((repository: RepositoryProps) => (
        <Repository key={repository.id} text={repository.full_name} />
      ))}
      {loading && <div>loading</div>}
      {error && <div>{error.message}</div>}
      <div
        ref={endofPage}
        style={{ height: "50px", background: "tomato", margin: "5px" }}
      />
    </>
  );
}

export default App;
