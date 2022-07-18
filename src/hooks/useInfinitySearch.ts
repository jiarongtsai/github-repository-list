import { useState, useEffect } from "react";
interface storeState{
  [unknownKey: string]: []
}

export function useInfinitySearch({
  observer,
  endofPage,
  url,
  noMoreDataFunction,
  fetchingNewDataFunction
}: any) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [store, setStore] = useState<storeState>({});
 
  useEffect(() => {
    let controller: AbortController | null = null;
    observer.current = new IntersectionObserver((entries) => {
      if(!url) return
      if (loading) return;
      if (!entries[0].isIntersecting) return;
      setLoading(true);
      setError(null);

      if (store[url]) {
        fetchingNewDataFunction(store[url])
        setLoading(false);
        return;
      }

      controller = new AbortController();
      const signal = controller.signal;
      fetch(
       url, { signal }
      )
        .then((response) => {
          if (!response.ok) {
            switch (response.status) {
              case (404):
                throw new Error(`${response.status} not found`);
              default:
                throw new Error(`Error: The status is ${response.status}`);
            }
          }
          return response.json();
        })
        .then((data) => {
          if (!data.length) {
            noMoreDataFunction()
            throw new Error(`No more data`);
          }
          setStore((prev: {}) => ({ ...prev, [url]: data }));
          fetchingNewDataFunction(data)

        })
        .catch((err) => setError(err))
        .finally(() => setLoading(false))
    });

    endofPage.current && observer.current.observe(endofPage.current);
    return () => {
      endofPage.current && observer.current?.unobserve(endofPage.current);
      controller?.abort();
    };
  }, [url]);

  return { loading, error };
}
