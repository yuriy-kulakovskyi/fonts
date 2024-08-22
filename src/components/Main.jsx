import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';

const Main = ({ inputValue, fontStyles, selectedFonts, setSelectedFonts }) => {
  const selectedLanguage = 'All';
  const [unloadedFonts, setUnloadedFonts] = useState([]);
  const textRefs = useRef([]);

  useEffect(() => {
    const checkFonts = async () => {
      const unloaded = [];
      for (const fontName of Object.keys(fontStyles)) {
        try {
          const loaded = await document.fonts.load(`16px ${fontName}`);
          if (!loaded.length) {
            unloaded.push(fontName);
          }
        } catch (err) {
          unloaded.push(fontName);
        }
      }
      setUnloadedFonts(unloaded);
    };
    checkFonts();
  }, [fontStyles]);

  const handleFontToggle = (font) => {
    setSelectedFonts((prevSelectedFonts) =>
      prevSelectedFonts.includes(font)
        ? prevSelectedFonts.filter((f) => f !== font)
        : [...prevSelectedFonts, font]
    );
  };

  const groupedFonts = Object.keys(fontStyles).reduce((acc, fontName) => {
    if (!unloadedFonts.includes(fontName)) { // Виключення незавантажених шрифтів
      const baseName = fontName.split(/(?=[A-Z])/)[0];
      if (!acc[baseName]) {
        acc[baseName] = [];
      }
      acc[baseName].push(fontName);
    }
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

  const filterFontsByLanguage = (fonts) => {
    if (selectedLanguage === 'All') return fonts;
    return fonts.filter((font) => {
      const match = font.match(new RegExp(`\\b${selectedLanguage}\\b`, 'i'));
      return match && match[0].toLowerCase() === selectedLanguage.toLowerCase(); // Точна відповідність
    });
  };

  const filteredGroupedFonts = Object.keys(groupedFonts).reduce((acc, baseName) => {
    const filteredFonts = filterFontsByLanguage(groupedFonts[baseName]);
    if (filteredFonts.length > 0) {
      acc[baseName] = filteredFonts;
    }
    return acc;
  }, {});

  return (
    <main className="main">

      {Object.keys(filteredGroupedFonts).map((baseName, index) => (
        <div className="font-group" key={index}>
          <h5>{baseName}</h5>
          {filteredGroupedFonts[baseName].map((fontName, fontIndex) => (
            <div
              className={`font-wrapper ${selectedFonts.includes(fontName) ? 'selected' : ''}`}
              key={fontIndex}
              onClick={() => handleFontToggle(fontName)}
            >
              <h6>{fontName}</h6>
              {inputValue !== '' && (
                <div>
                  <button
                    onClick={() => handleCopyToClipboard(textRefs.current[fontIndex], fontName)}
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

      {unloadedFonts.length > 0 && (
        <div className="font-group">
          <h5>Unloaded Fonts</h5>
          {unloadedFonts.map((fontName, index) => (
            <div key={index} className="font-wrapper">
              <h6>{fontName}</h6>
              <p>This font could not be loaded.</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Main;
