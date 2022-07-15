import { useState, useRef } from "react";
import { options } from "./data/option";
import { generateValue } from "./utils";
import { Input } from "./component/Input";
import { Dropdown } from "./component/Dropdown";
import { Repository } from "./component/Repository";
import { useInfinitySearch } from "./customHook/useInfinitySearch";
interface queryParamsProps {
  [key: string]: string;
  type: string;
  sort: string;
  direction: string;
}

function App() {
  const queryTerm = new URLSearchParams(window.location.search).get("q");

  const [queryParams, setQueryParams] = useState<queryParamsProps>(
    generateValue(options)
  );
  // const [repositoryList, setRepositoryList] = useState<RepositoryProps[]>([]);
  const endofPage = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const paging = useRef<number>(1);

  const { repositoryList, setRepositoryList, error, loading }: any =
    useInfinitySearch({
      observer,
      paging,
      queryTerm,
      queryParams,
      endofPage,
    });

  function reset() {
    setRepositoryList([]);
    paging.current = 1;
  }

  function handleQueryParamsChange(e: React.ChangeEvent<HTMLSelectElement>) {
    reset();
    const { name, value } = e.target;
    setQueryParams((prev: queryParamsProps) => ({
      ...prev,
      [name]: value,
    }));
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
              currentValue={queryParams[term]}
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
