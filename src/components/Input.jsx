const Input = ({
  inputValue,
  setInputValue
}) => {
  return (
    <div
      className="input-wrapper"
    >
      <input 
        type="text"
        placeholder="Enter text..."
        className="input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  );
}
 
export default Input;