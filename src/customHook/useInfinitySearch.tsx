import { useState, useEffect } from "react";

interface RepositoryProps {
  id: number;
  full_name: string;
  homepage?: string; //link
  name?: string; //use this as repository name
  description?: string;
  language?: string; //display as tag
  stargazers_count?: number;
}

export function useInfinitySearch({
  observer,
  paging,
  queryTerm,
  queryParams,
  endofPage,
}: any) {
  const [repositoryList, setRepositoryList] = useState<RepositoryProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [store, setStore] = useState<any>({});

  useEffect(() => {
    let controller: AbortController | null = null;
    observer.current = new IntersectionObserver((entries) => {
      if (loading) return;
      if (!paging.current) return;
      if (!queryTerm) return;
      if (entries[0].intersectionRatio <= 0) return;

      setLoading(true);
      setError(null);

      const { type, sort, direction } = queryParams;
      const searchCondition = `${type}_${sort}_${direction}_${paging.current}`;

      if (paging.current === 1) {
        window.scrollTo(0, 0);
      }

      if (store[searchCondition]) {
        setRepositoryList((prev) => [...prev, ...store[searchCondition]]);
        paging.current += 1;
        setLoading(false);
        return;
      }

      controller = new AbortController();
      const signal = controller.signal;

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
          setStore((prev: {}) => ({ ...prev, [searchCondition]: data }));
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

  return { repositoryList, loading, error };
}
