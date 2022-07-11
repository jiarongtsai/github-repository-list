import {useState} from "react"

export const Input = ({ queryTerm, reset }: any) => {

    const [input, setInput] = useState<string>(queryTerm || '')
  
    function handleSearch() {
      if(input === queryTerm) return
      window.location.href = `./?q=${input}`
      reset()
    }
  
    return (
      <>
      <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {e.key === "Enter" && handleSearch()}}
            />
      <button onClick={handleSearch}>Search</button>
      </>
    )
  }