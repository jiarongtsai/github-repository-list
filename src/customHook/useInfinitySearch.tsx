import { useState, useEffect } from "react";
import { QueryParamsActionKind } from "../reducer";

export function useInfinitySearch({
  observer,
  state,
  dispatch,
  endofPage,
}: any) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [store, setStore] = useState<any>({});

  useEffect(() => {
    let controller: AbortController | null = null;
    observer.current = new IntersectionObserver((entries) => {
      const { queryTerm, type, sort, direction, page } = state;
      if (loading) return;
      if (!page) return;
      if (!queryTerm) return;
      if (entries[0].intersectionRatio <= 0) return;

      setLoading(true);
      setError(null);

      if (page === 1) {
        window.scrollTo(0, 0);
      }

      const searchCondition = `page=${page}&type=${type}&sort=${sort}&direction=${direction}`;

      if (store[searchCondition]) {
        dispatch({
          type: QueryParamsActionKind.LOAD_NEXT_PAGE,
          payload: { nextPageData: store[searchCondition] },
        });
        setLoading(false);
        return;
      }

      controller = new AbortController();
      const signal = controller.signal;

      fetch(
        `https://api.github.com/orgs/${queryTerm}/repos?${searchCondition}`,
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
            dispatch({
              type: QueryParamsActionKind.NO_MORE_PAGE,
            });
            throw new Error(`No more data`);
          }
          setStore((prev: {}) => ({ ...prev, [searchCondition]: data }));
          dispatch({
            type: QueryParamsActionKind.LOAD_NEXT_PAGE,
            payload: { nextPageData: data },
          });
        })
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    });

    endofPage.current && observer.current.observe(endofPage.current);
    return () => {
      endofPage.current && observer.current?.unobserve(endofPage.current);
      controller?.abort();
    };
  }, [state]);

  return { loading, error };
}
