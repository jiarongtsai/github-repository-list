import { useEffect, useState, useRef } from "react";
import { options } from "./data/option";
import { Input } from "./component/Input";
import { Dropdown } from "./component/Dropdown";
import { Repository } from "./component/Repository";
import { generateValue } from "./utils";
interface RepositoryProps {
  id: number;
  full_name: string;
}
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
  const [repositoryList, setRepositoryList] = useState<RepositoryProps[]>([]);
  const endofPage = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const paging = useRef<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let controller: AbortController | null = null;
    observer.current = new IntersectionObserver((entries) => {
      if (!paging.current) return;
      if (!queryTerm) return;
      if (entries[0].intersectionRatio <= 0) return;

      setLoading(true);
      setError(null);

      controller = new AbortController();
      const signal = controller.signal;

      const { type, sort, direction } = queryParams;
      fetch(
        `https://api.github.com/orgs/${queryTerm}/repos?page=${paging.current}&type=${type}&sort=${sort}&direction=${direction}`,
        { signal }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error: The status is ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (!data.length) {
            paging.current = 0;
            throw new Error(`No more data`);
          }
          setRepositoryList((prev) => [...prev, ...data]);
          paging.current += 1;
        })
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    });
    endofPage.current && observer.current.observe(endofPage.current);
    return () => {
      endofPage.current && observer.current?.unobserve(endofPage.current);
      controller?.abort();
    };
  }, [queryParams]);

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
      {repositoryList.map((repository) => (
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
