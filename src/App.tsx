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
    type: typeOptions[0].value,
    sort: sortOptions[0].value,
    direction: directionOptions[1].value
  })
  const [repositoryList, setRepositoryList] = useState<RepositoryProps[]>([])
  const endofPage = useRef<HTMLDivElement | null>(null)
  const observer = useRef<IntersectionObserver | null>(null)
  const paging = useRef<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error|null>(null)

  useEffect(() => {
   let controller: AbortController|null = null
    observer.current = new IntersectionObserver((entries) => {
      if (!paging.current) return
      if (!queryTerm) return
      if (entries[0].intersectionRatio <= 0) return

      setLoading(true)

      controller = new AbortController
      const signal = controller.signal

      const { type, sort, direction } = queryParams
      //abort when onMount
      fetch(`https://api.github.com/orgs/${queryTerm}/repos?page=${paging.current}&type=${type}&sort=${sort}&direction=${direction}`, {signal})
        .then((response) => {
          if (!response.ok) {
            switch (response.status) {
              case (404):
                throw new Error(
                  `${response.status} Not Found`
                )
              default:
                throw new Error(
                  `Error: The status is ${response.status}`
                )
            }
          }
          setError(null)
          return response.json()
        })
        .then((data) => {
          if (!data.length) {
            paging.current = 0
            throw new Error(
              `No more repositories`
            )
          }
          setRepositoryList((prev) => ([...prev, ...data]))
          paging.current += 1
          
      
        }).catch((err) => 
          setError(err)
        ).finally(() =>
          setLoading(false)
        )
    })
      endofPage.current && observer.current.observe(endofPage.current);
    return () => {
      endofPage.current && observer.current?.unobserve(endofPage.current);
      controller?.abort()
    };

  }, [queryParams])


  function handleSearch() {
    if(input === queryTerm) return
    setRepositoryList([])
    paging.current = 1
    window.location.href = `./?q=${input}`
  }

  function handleQueryParamsChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setRepositoryList([])
    paging.current = 1
    
    const { name, value } = e.target

    setQueryParams(prev => ({
      ...prev, [name]:value
    }))

  }
  //input change cause component re-render

  console.log('re-render')
  return (
    <div>
      <div style={{position: 'sticky',top: '0',padding: '10px', background: 'white'}}>
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
      </div>
      {repositoryList.map((repository) => (
        <div key={repository.id} style={{ height: "50px", background: "lightgray", margin: "5px" }}>
          {repository.full_name}
        </div>
      ))}
      {loading && <div>loading</div>}
      {error && <div>{error.message}</div>}
      <div ref={endofPage} style={{ height: "50px", background: "tomato", margin: "5px" }} ></div>
    </div>
  );
}

export default App;
