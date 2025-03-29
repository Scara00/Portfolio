import React from "react";
import styled from "styled-components";
import HomePCA from "../assets/Home.png";
import dashboard from "../assets/MacBook Pro 16_ - 94.png";
import loginPCA from "../assets/LOGIN - LIGHT.png";
import useDeviceType from "../hooks/useDeviceType";

const TextName = styled.div<{ isMobile?: boolean }>`
  position: relative;
  color: rgba(71, 99, 254, 1);
  z-index: 4; /* Assicura che il testo sia sotto l'immagine */
  animation: backInDown 1s ease-in-out forwards;
  @keyframes backInDown {
    0% {
      transform: translateY(-100vh) scale(0.3);
      opacity: 0;
    }
    80% {
      transform: translateY(0) scale(0.7);
      opacity: 0.5;
    }
    100% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }
`;

const Image = styled.img`
  height: auto;
  position: absolute;
`;

const Crafted: React.FC = () => {
  const { isMobile, isTablet } = useDeviceType();

  return (
    <>
      <TextName
        className="agera-mono "
        style={{ fontSize: isMobile ? "70px" : isTablet ? "150px" : "280px" }}>
        CRAFTED
      </TextName>
      <Image
        src={dashboard}
        alt="Avatar"
        style={{
          maxWidth: isMobile ? "150px" : isTablet ? "200px" : "500px",
          transform: "translate(-80%, -80%) scale(1)",
          boxShadow: "-4px -4px 12px 0px rgba(0, 0, 0, 0.12)",
          borderRadius: "8px",
          top: "50%",
          left: "50%",
          zIndex: 1,
        }}
      />
      <Image
        src={loginPCA}
        alt="Avatar"
        style={{
          maxWidth: isMobile ? "150px" : isTablet ? "200px" : "500px",
          transform: "transform: translate(-40%, -40%) scale(1)",
          boxShadow: "-4px -4px 12px 0px rgba(0, 0, 0, 0.12)",
          top: "50%",
          left: "50%",
          borderRadius: "8px",
          zIndex: 2,
        }}
      />
      <Image
        src={HomePCA}
        alt="Avatar"
        style={{
          maxWidth: isMobile ? "150px" : isTablet ? "200px" : "500px",
          transform: "translate(-40%, -40%) scale(1)",
          boxShadow: "-4px -4px 12px 0px rgba(0, 0, 0, 0.12)",
          borderRadius: "8px",
          top: "50%",
          left: "50%",
          zIndex: 1,
        }}
      />
    </>
  );
};

export default Crafted;
