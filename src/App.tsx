import { useRef, useReducer } from "react";
import { options } from "./data/option";
import { generateValue } from "./utils";
import { Input } from "./component/Input";
import { Dropdown } from "./component/Dropdown";
import { Repository } from "./component/Repository";
import { useInfinitySearch } from "./customHook/useInfinitySearch";

// An enum with all the types of actions to use in our reducer
enum QueryParamsActionKind {
  RESET_PAGE = "RESET_PAGE",
  LOAD_NEXT_PAGE = "LOAD_NEXT_PAGE",
  NO_MORE_PAGE = "NO_MORE_PAGE",
  CHANGE_PARAMS = "CHANGE_PARAMS",
}

// An interface for our actions

type PayloadAction = {
  type: string;
  payload: {
    name: string;
    value: string;
  };
};
type NoPayloadAction = { type: string };

type QueryParamsAction = PayloadAction | NoPayloadAction;

// An interface for our state
interface QueryParamsState {
  [key: string]: any;
  page: number;
  queryTerm: string;
  type: string;
  sort: string;
  direction: string;
}

function queryParamsReducer(
  state: QueryParamsState,
  action: QueryParamsAction
) {
  switch (action.type) {
    case QueryParamsActionKind.CHANGE_PARAMS:
      const payloadAction = (action as PayloadAction).payload;
      return {
        ...state,
        page: 1,
        [payloadAction.name]: payloadAction.value,
      };
    case QueryParamsActionKind.RESET_PAGE:
      return {
        ...state,
        page: 1,
      };
    case QueryParamsActionKind.LOAD_NEXT_PAGE:
      return {
        ...state,
        page: state.page++,
      };
    case QueryParamsActionKind.NO_MORE_PAGE:
      return {
        ...state,
        page: 0,
      };
    default:
      return state;
  }
}

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
      {repositoryList.map((repository: any) => (
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
