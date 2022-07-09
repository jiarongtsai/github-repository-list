import { useEffect, useState } from "react"
import { SearchBar } from "./component/SearchBar"
import { RepositoryList } from "./component/RepositoryList"

interface RepositoryProps {
  id: number;
  full_name: string;
}

function App() {
  const [keyword, setKeyword] = useState<string>('google')
  const [repositoryList, setRepositoryList] = useState<RepositoryProps[]>([])
  const [fetching, setFetching] = useState<boolean>(true)

  useEffect(() => {
    if (!keyword) return
    if (!fetching) return
    fetch(`https://api.github.com/orgs/${keyword}/repos`)
      .then((response) => response.json())
      .then((data) => {
        setRepositoryList(data)
        setFetching(false)
      })
      //handle error
  }, [keyword, fetching])
  
  return (
    < >
      <div>Search Bar</div>
      <input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <button onClick={()=>setFetching(true)}>Search</button>
      {repositoryList&&repositoryList.map((repository) => (
        <div key={repository.id} style={{ height: "50px", background: "lightgray", margin: "5px" }}>
          {repository.full_name}
        </div>
      ))}
    </>
  );
}

export default App;
