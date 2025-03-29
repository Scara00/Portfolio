import React, { useEffect, useState } from "react";

interface SvgModifierProps {
  svgPath: string; // Percorso dell'SVG
  newColor: string; // Nuovo colore da sostituire a #2194EB
}

const SvgModifier: React.FC<SvgModifierProps> = ({ svgPath, newColor }) => {
  const [modifiedSvg, setModifiedSvg] = useState<string>("");

  useEffect(() => {
    fetchAndModifySvg();
  }, [svgPath, newColor]);

  // Carica l'SVG dal percorso e sostituisci il colore
  const fetchAndModifySvg = async () => {
    try {
      const response = await fetch(svgPath);
      console.log(response);
      if (!response.ok) {
        throw new Error(`Impossibile caricare l'SVG: ${response.statusText}`);
      }
      const svgContent = await response.text();
      console.log(svgContent);
      const updatedSvg = svgContent.replace(/#717171/g, newColor);
      setModifiedSvg(updatedSvg);
    } catch (error) {
      console.error("Errore durante il caricamento dell'SVG:", error);
    }
  };

  return <div dangerouslySetInnerHTML={{ __html: modifiedSvg }} />;
};

export default SvgModifier;
