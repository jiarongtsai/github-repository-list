import { useEffect, useState, useRef } from "react";
import { options } from "../data/option";
import { generateValue } from "../utils";
import { useInfinitySearch } from "../customHook/useInfinitySearch";
interface queryParamsProps {
  [key: string]: string;
  type: string;
  sort: string;
  direction: string;
}
export function Testing() {
  const [page, setPage] = useState(0);
  const paging = useRef<number>(1);
  const endofPage = useRef<HTMLDivElement | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);
  const queryTerm = "google";
  const [queryParams, setQueryParams] = useState<queryParamsProps>(
    generateValue(options)
  );

  const { repositoryList, error, isLoading }: any = useInfinitySearch({
    observer,
    paging,
    queryTerm,
    queryParams,
    endofPage,
  });

  return (
    <>
      <div>hello</div>
      <div>{page}</div>
      {repositoryList.map((item: any) => (
        <div
          key={item.id}
          style={{ height: "50px", background: "gray", margin: "5px" }}
        >
          {item.name}
        </div>
      ))}
      <div
        ref={endofPage}
        style={{ height: "50px", background: "red", margin: "5px" }}
      />
    </>
  );
}
