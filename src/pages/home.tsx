import React from "react";
import styled from "styled-components";
import avatar from "../assets/avatar.png";
import useDeviceType from "../hooks/useDeviceType";

const TextName = styled.div<{ isMobile?: boolean }>`
  position: relative;

  z-index: 1; /* Assicura che il testo sia sotto l'immagine */
  animation: backInLeft 2s ease-in-out forwards;
  @keyframes backInLeft {
    0% {
      transform: translateX(-100vw) scale(0.3);
      opacity: 0;
    }
    80% {
      transform: translateX(0) scale(0.7);
      opacity: 0.5;
    }
    100% {
      transform: translateX(0) scale(1);
      opacity: 1;
    }
  }
`;

const Image = styled.img`
  height: auto;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Centra correttamente l'immagine */
  z-index: 2; /* Assicura che l'immagine sia sopra il testo */
  animation: backInRight 2s ease-in-out forwards;

  @keyframes backInRight {
    0% {
      transform: translate(calc(50% + 100vw), -50%) scale(0.3);
      opacity: 0;
    }
    80% {
      transform: translate(-50%, -50%) scale(0.7);
      opacity: 0.5;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }
`;

const Home: React.FC = () => {
  const { isMobile, isTablet } = useDeviceType();

  return (
    <>
      <TextName
        className="agera-mono "
        style={{ fontSize: isMobile ? "70px" : isTablet ? "150px" : "280px" }}>
        CRISTIAN SCARATTI
      </TextName>
      <Image
        src={avatar}
        alt="Avatar"
        style={{ maxWidth: isMobile ? "100px" : isTablet ? "150px" : "400px" }}
      />
    </>
  );
};

export default Home;
