import { useEffect, useState, useRef } from "react"
interface RepositoryProps {
  id: number;
  full_name: string;
}

interface queryParamsState{
  type: string,
  sort: string,
  direction: string
}

const typeOptions = [
  {value: 'all', text: 'All'},
  {value: 'public', text: 'Public'},
  {value: 'private', text: 'Private'},
  {value: 'forks', text: 'Forks'},
  {value: 'sources', text: 'Sources'},
  {value: 'member', text: 'Member'},
]

const sortOptions = [
  {value: 'created', text: 'Created'},
  {value: 'updated', text: 'Updated'},
  {value: 'pushed', text: 'Pushed'},
  {value: 'full_name', text: 'Full Name'},
]

const directionOptions = [
  {value: 'asc', text: 'Ascend'},
  {value: 'desc', text: 'Descend'},
]


function App() {
  const queryTerm = new URLSearchParams(window.location.search).get('q');
  const [input, setInput] = useState<string>(queryTerm || '')
  const [queryParams, setQueryParams] = useState<queryParamsState>({
    type: 'all',
    sort: 'created',
    direction: 'desc'
  })

  const [repositoryList, setRepositoryList] = useState<RepositoryProps[]>([])
  const endofPage = useRef<HTMLDivElement | null>(null)
  const observer = useRef<IntersectionObserver | null>(null)
  const paging = useRef<number>(1)


  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      
      if (!queryTerm) return
      if (entries[0].intersectionRatio <= 0) return

      const { type, sort, direction } = queryParams
      
      //abort when onMount
      fetch(`https://api.github.com/orgs/${queryTerm}/repos?page=${paging.current}&type=${type}&sort=${sort}&direction=${direction}`)
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

  }, [queryParams])


  function handleSearch() {
    if(input === queryTerm) return
    setRepositoryList([])
    paging.current = 1
    window.location.href = `./?q=${input}`
  }

  function handleQueryParamsChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const { name, value } = e.target
    setQueryParams(prev => ({
      ...prev, [name]:value
    }))
    setRepositoryList([])
    paging.current =1
  }
  //input change cause component re-render

  return (
    < >
      <div>Search Bar</div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {e.key === "Enter" && handleSearch()}}
      />
      <button onClick={handleSearch}>Search</button>
      <div>
          <label htmlFor="type-select">Type</label>
          <select id="type-select" name="type" value={queryParams.type} onChange={(e)=>handleQueryParamsChange(e)}>
            {typeOptions.map(({ value, text }) => <option key={value} value={value}>{text}</option>)}
          </select>
          <label>Sort</label>
          <select id="sort-select" name="sort" value={queryParams.sort} onChange={(e)=>handleQueryParamsChange(e)}>
            {sortOptions.map(({ value, text }) => <option key={value} value={value}>{text}</option>)}
          </select >
          <label>Direction</label>
          <select id="direction-select" name="direction" value={queryParams.direction} onChange={(e)=>handleQueryParamsChange(e)}>
            {directionOptions.map(({ value, text }) => <option key={value} value={value}>{text}</option>)}
          </select>
      </div>
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
