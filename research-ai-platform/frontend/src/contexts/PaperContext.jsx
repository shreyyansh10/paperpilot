import { createContext, useState, useContext } from 'react';

const PaperContext = createContext(null);

export function PaperProvider({ children }) {
  const [paper, setPaperState] = useState({
    paperId: null,
    filename: null,
    totalWords: null,
    totalChunks: null,
  });

  const setPaper = ({ paperId, filename, totalWords, totalChunks }) => {
    setPaperState({ paperId, filename, totalWords, totalChunks });
  };

  return (
    <PaperContext.Provider value={{ ...paper, setPaper }}>
      {children}
    </PaperContext.Provider>
  );
}

export const usePaper = () => useContext(PaperContext);

export default PaperContext;
