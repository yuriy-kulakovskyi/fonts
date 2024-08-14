import { useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import download from 'downloadjs';

const ExportPage = ({ inputValue, selectedFonts, setSelectedFonts }) => {
  const textRefs = useRef([]);

  useEffect(() => {
    textRefs.current = textRefs.current.slice(0, selectedFonts.length);
  }, [selectedFonts]);

  const handleExport = async () => {
    for (let index = 0; index < textRefs.current.length; index++) {
      const ref = textRefs.current[index];
      if (ref) {
        try {
          const canvas = await html2canvas(ref, {
            useCORS: true,
            backgroundColor: null,
          });
          const dataUrl = canvas.toDataURL('image/png');
          download(dataUrl, `exported-text-${index + 1}.png`);
        } catch (err) {
          console.error('Failed to export image:', err);
        }
      }
    }
  };


  return (
    <div className="export-page">
      {selectedFonts.length !== 0 && <p
        style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '10px',
        }}
      >
        Chosen Fonts
      </p>}

      {selectedFonts.map((font, index) => (
        <>
          <div
            key={index}
            ref={(el) => (textRefs.current[index] = el)}
            className="text-preview"
            style={{ fontFamily: font, margin: '10px 0', padding: '10px', border: '1px solid transparent', color: "#000", textAlign: "center" }}
          >
            <span style={{ fontFamily: font, margin: '10px 0', padding: '10px', border: '1px solid transparent', color: "#000", textAlign: "center" }} id={'text' + index}>
              {inputValue || 'Enter your text'}
            </span>
          </div>
        </>
      ))}

      {selectedFonts.length !== 0 ? (
        <>
          <button onClick={handleExport}>
            {selectedFonts.length === 1
              ? "Export as Image"
              : "Export as Images"}
          </button>
        </>
      ) : (
        <p>Select any fonts</p>
      )}

      {selectedFonts.length !== 0 && <button
        onClick={() => {
          setSelectedFonts([]);
        }}
      >
        Unselect all
      </button>}
    </div>
  );
};

export default ExportPage;