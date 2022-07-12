export const Dropdown = ({term, currentValue, list, handleChange}:any) => {
    return (
        <span style={{ marginRight: '5px',marginTop: '5px', display: 'inline-block'}}>
            <label htmlFor={`${term}-select`}>{term}</label>
            <select id={`${term}-select`} name={term} value={currentValue} onChange={(e)=>handleChange(e)}>
                {list.map(({ value, text }:any) => <option key={value} value={value}>{text}</option>)}
            </select>
        </span>
    )
}