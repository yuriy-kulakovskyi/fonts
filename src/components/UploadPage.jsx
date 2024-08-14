import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, database } from '../firebaseConfig'; 
import { set, ref as dbRef, onValue } from 'firebase/database';

const FontUploader = ({
  inputValue
}) => {
  const [fontFile, setFontFile] = useState(null);
  const [fonts, setFonts] = useState([]);

  const handleUpload = async () => {
    if (fontFile) {
      const fontName = fontFile.name.split('.')[0];
      const fontRef = ref(storage, `fonts/${fontFile.name}`);
      
      await uploadBytes(fontRef, fontFile);
      const downloadURL = await getDownloadURL(fontRef);
  
      const newFontRef = dbRef(database, `fonts/${fontName}`);
      await set(newFontRef, {
        name: fontName,
        url: downloadURL,
      });
  
      setFontFile(null);
      fetchFonts();
    }
  };
  
  const deleteFont = async (font) => {
    const fontRef = dbRef(database, `fonts/${font.name}`);
    await set(fontRef, null);

    fetchFonts();
  }

  const fetchFonts = () => {
    const fontsRef = dbRef(database, 'fonts');
    onValue(fontsRef, (snapshot) => {
      const fontsData = snapshot.val();
      const fontsArray = fontsData ? Object.values(fontsData) : [];
      setFonts(fontsArray);
    });
  };

  useEffect(() => {
    fetchFonts();
  }, []);

  return (
    <div className='upload' style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Upload Fonts</h2>
      <input
        type="file"
        accept=".ttf,.otf,.woff,.woff2"
        onChange={(e) => setFontFile(e.target.files[0])}
      />
      <button onClick={handleUpload} style={{ margin: '10px 0' }}>
        Upload Font
      </button>

      <h2>Available Fonts</h2>

      {fonts.map((font, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <div className='font-wrapper' style={{ border: '1px solid #eee', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
            <h6 className='delete-font-text' style={{ fontWeight: 'bold' }} onClick={() => deleteFont(font)}>{font.name.toUpperCase()}</h6>
            <p style={{ fontFamily: font.name }}>{inputValue}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FontUploader;