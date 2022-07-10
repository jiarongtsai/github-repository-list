import { useEffect, useState, useRef } from "react"
interface RepositoryProps {
  id: number;
  full_name: string;
}


function App() {
  const queryTerm = new URLSearchParams(window.location.search).get('q');
  
  const [input, setInput] = useState<string>(queryTerm || '')
  const [repositoryList, setRepositoryList] = useState<RepositoryProps[]>([])
  const endofPage = useRef<HTMLDivElement | null>(null)
  const observer = useRef<IntersectionObserver | null>(null)
  const paging = useRef<number>(1)


  useEffect(() => {
    
    observer.current = new IntersectionObserver((entries) => {
      if (!queryTerm) return
      if (entries[0].intersectionRatio <= 0) return

      fetch(`https://api.github.com/orgs/${queryTerm}/repos?page=${paging.current}`)
        //handle queryTerm error
      .then((response) => response.json())
      .then((data) => {
        //handle end of page
        setRepositoryList((prev) => ([...prev, ...data]))
        paging.current += 1
     
      })
    })
      endofPage.current && observer.current.observe(endofPage.current);
    return () => {
        endofPage.current && observer.current?.unobserve(endofPage.current);
      };

  }, [])

  function handleSearch() {
    setRepositoryList([])
    paging.current = 1
    window.location.href = `./?q=${input}`
  }
  
  return (
    < >
      <div>Search Bar</div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {e.key === "Enter" && handleSearch()}}
      />
      <button onClick={handleSearch}>Search</button>
    
      {repositoryList.map((repository) => (
        <div key={repository.id} style={{ height: "50px", background: "lightgray", margin: "5px" }}>
          {repository.full_name}
        </div>
      ))}
      <div ref={endofPage} style={{ height: "50px", background: "tomato", margin: "5px" }} ></div>
    </>
  );
}

export default App;
