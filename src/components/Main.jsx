import React, { useRef } from 'react';
import html2canvas from 'html2canvas';

const Main = ({ inputValue, fontStyles, selectedFonts, setSelectedFonts }) => {
  const textRefs = useRef([]);

  const handleFontToggle = (font) => {
    setSelectedFonts((prevSelectedFonts) =>
      prevSelectedFonts.includes(font)
        ? prevSelectedFonts.filter((f) => f !== font)
        : [...prevSelectedFonts, font]
    );
  };

  const groupedFonts = Object.keys(fontStyles).reduce((acc, fontName) => {
    const baseName = fontName.split(/(?=[A-Z])/)[0];
    if (!acc[baseName]) {
      acc[baseName] = [];
    }
    acc[baseName].push(fontName);
    return acc;
  }, {});


  const handleCopyToClipboard = async (ref, fontName) => {
    try {
      await document.fonts.load(`16px ${fontName}`);

      if (ref) {
        const canvas = await html2canvas(ref, {
          useCORS: true,
          fontFace: {
            useFontFaceObserver: true,
          },
          backgroundColor: null
        });
        canvas.toBlob(async (blob) => {
          if (blob) {
            const item = new ClipboardItem({ 'image/png': blob });
            await navigator.clipboard.write([item]);
            alert('Copied to clipboard as PNG');
          }
        });
      }
    } catch (err) {
      console.error('Failed to copy image:', err);
    }
  };


  return (
    <main className="main">
      {Object.keys(groupedFonts).map((baseName, index) => (
        <div className="font-group" key={index}>
          <h5>{baseName}</h5>
          {groupedFonts[baseName].map((fontName, fontIndex) => (
            <div
              className={`font-wrapper ${selectedFonts.includes(fontName) ? 'selected' : ''
                }`}
              key={fontIndex}
              onClick={() => handleFontToggle(fontName)}
            >
              <h6>{fontName}</h6>
              {inputValue !== '' && (
                <div>
                  <button
                    onClick={() => handleCopyToClipboard(textRefs.current[fontIndex], "cursive")}
                  >
                    Copy
                  </button>
                </div>
              )}
              <div className='row'>
                <div
                  key={index}
                  ref={(el) => (textRefs.current[index] = el)}
                  className="image"
                  style={{ fontFamily: fontName, color: "#000", textAlign: "center" }}
                >
                  <span style={{ fontFamily: fontName, color: "#000", textAlign: "center" }} id={'text' + index}>
                    {inputValue}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </main>
  );
};

export default Main;