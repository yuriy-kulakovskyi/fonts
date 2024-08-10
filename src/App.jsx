import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';
import Input from './components/Input';
import Main from './components/Main';
import ExportPage from './components/ExportPage';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [fontStyles, setFontStyles] = useState({});
  const [selectedFonts, setSelectedFonts] = useState([]);

  function importAll(r) {
    let fonts = {};
    r.keys().forEach((item) => {
      const folderName = item.replace('./', '').split('/')[0];
      if (!fonts[folderName]) {
        fonts[folderName] = [];
      }
      fonts[folderName].push({ path: item, url: r(item) });
    });
    return fonts;
  }

  useEffect(() => {
    const fonts = importAll(require.context('../public/assets/fonts', true, /\.(ttf|otf|woff|woff2)$/));

    const dynamicStyles = {};

    Object.keys(fonts).forEach((folderName) => {
      dynamicStyles[folderName] = fonts[folderName].map((font) => {
        const fontName = font.path.split('/').pop().split('.')[0];

        const fontStyle = `
          @font-face {
            font-family: '${fontName}';
            src: url(${font.url}) format('truetype');
          }
        `;

        return {
          fontFamily: fontName,
          style: fontStyle,
        };
      });

      const styleSheet = document.createElement('style');
      styleSheet.type = 'text/css';
      styleSheet.innerText = dynamicStyles[folderName].map(f => f.style).join('\n');
      document.head.appendChild(styleSheet);
    });

    setFontStyles(dynamicStyles);
  }, []);

  return (
    <Router>
      <nav className='nav'>
        <Link to="/">Home</Link>
        <Link to="/export">Export</Link>
      </nav>
      <Routes>
        <Route
          path="/"
          element={
            <div className="App">
              <Input
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <Main
                inputValue={inputValue}
                fontStyles={fontStyles}
                selectedFonts={selectedFonts}
                setSelectedFonts={setSelectedFonts}
              />
            </div>
          }
        />
        <Route
          path="/export"
          element={
            <ExportPage inputValue={inputValue} selectedFonts={selectedFonts} setSelectedFonts={setSelectedFonts} />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;