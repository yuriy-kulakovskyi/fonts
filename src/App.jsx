import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { database } from './firebaseConfig';
import { ref as dbRef, onValue } from 'firebase/database';

import './App.css';

import Input from './components/Input';
import Main from './components/Main';
import ExportPage from './components/ExportPage';
import FontUploader from './components/UploadPage';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [fontStyles, setFontStyles] = useState({});
  const [selectedFonts, setSelectedFonts] = useState([]);
  const [fonts, setFonts] = useState([]);

  const fetchFonts = () => {
    const fontsRef = dbRef(database, 'fonts/');
    onValue(fontsRef, (snapshot) => {
      const fontsData = snapshot.val();
      const fontsArray = fontsData ? Object.values(fontsData) : [];
      setFonts(fontsArray);
    });
  };

  useEffect(() => {
    fetchFonts();
  }, []);

  useEffect(() => {
    const dynamicStyles = {};
  
    fonts.forEach((font) => {
      const fontName = font.name;
      const fontUrl = font.url;
  
      const fileExtension = fontUrl.split('.').pop().split('?')[0];
      let format = '';
  
      switch (fileExtension) {
        case 'ttf':
          format = 'truetype';
          break;
        case "TTF":
          format = 'truetype';
          break;
        case 'otf':
          format = 'opentype';
          break;
        case 'woff':
          format = 'woff';
          break;
        case 'woff2':
          format = 'woff2';
          break;
        default:
          console.error('Unsupported font format:', fileExtension);
          return; 
      }
  
      const fontStyle = `
        @font-face {
          font-family: '${fontName}';
          src: url(${fontUrl}) format('${format}');
        }
      `;
  
      dynamicStyles[fontName] = {
        fontFamily: fontName,
        style: fontStyle,
      };
  
      const styleSheet = document.createElement('style');
      styleSheet.type = 'text/css';
      styleSheet.innerText = fontStyle;
      document.head.appendChild(styleSheet);
    });
  
    setFontStyles(dynamicStyles);
  }, [fonts]);  

  return (
    <Router>
      <nav className='nav'>
        <div>
          <Link to="/">Home</Link>
          <Link to="/export">Export</Link>
          <Link to="/upload">Upload</Link>
        </div>

        <Input
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
      </nav>
      <Routes>
        <Route
          path="/"
          element={
            <div className="App">
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
            <ExportPage 
              inputValue={inputValue} 
              selectedFonts={selectedFonts} 
              setSelectedFonts={setSelectedFonts} 
            />
          }
        />
        <Route
          path="/upload"
          element={
          <FontUploader
            inputValue={inputValue}
          />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;