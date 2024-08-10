const Main = ({ inputValue, fontStyles, selectedFonts, setSelectedFonts }) => {

  const handleFontToggle = (font) => {
    setSelectedFonts((prevSelectedFonts) =>
      prevSelectedFonts.includes(font)
        ? prevSelectedFonts.filter((f) => f !== font)
        : [...prevSelectedFonts, font]
    );
  };

  const displayedFonts = Object.keys(fontStyles);

  return (
    <main className="main">
      {displayedFonts.map((folderName, index) => (
        <div className="font-group" key={index}>
          <h5>{folderName}</h5>
          {fontStyles[folderName].map((font, subIndex) => (
            <div
              className={`font-wrapper ${
                selectedFonts.includes(font.fontFamily) ? 'selected' : ''
              }`}
              key={subIndex}
              onClick={() => handleFontToggle(font.fontFamily)}
            >
              <h6>{font.fontFamily.split('-').pop()}</h6>
              <p style={{ fontFamily: font.fontFamily }}>{inputValue}</p>
            </div>
          ))}
        </div>
      ))}
    </main>
  );
};

export default Main;
