import { useEffect, useState, useRef } from "react";
import { useFetch } from "../customHook/useFetch";

export function Testing() {
  const [page, setPage] = useState(0);

  const endofPage = useRef<HTMLDivElement | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);

  const { response, error, isLoading }: any = useFetch(
    `https://api.openbrewerydb.org/breweries?page=${page}`
  );

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio <= 0) return;
      setPage((prev) => prev + 1);
    });
    endofPage.current && observer.current.observe(endofPage.current);

    return () => {
      endofPage.current && observer.current?.unobserve(endofPage.current);
    };
  }, []);

  return (
    <>
      <div>hello</div>
      <div>{page}</div>
      {response?.map((item: any) => (
        <div
          key={item.id}
          style={{ height: "50px", background: "gray", margin: "5px" }}
        >
          {item.name}
        </div>
      ))}
      <div>{page}</div>
      <button onClick={() => setPage((prev) => prev + 1)}>Add</button>

      <div
        ref={endofPage}
        style={{ height: "50px", background: "red", margin: "5px" }}
      />
    </>
  );
}
