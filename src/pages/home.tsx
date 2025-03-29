import React, { useEffect, useState } from "react";
import styled from "styled-components";
import avatar from "../assets/avatar.png";
import TabNavigation from "../components/tabNavigation";
import moment from "moment";
import { getPosition } from "../utils/function";

const Container = styled.div`
  height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  gap: 24px;

  background: radial-gradient(
    circle,
    rgba(221, 226, 255, 1) 26%,
    rgba(255, 255, 255, 1) 100%
  );
`;
const ContainerTextName = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  padding: 32px 120px;
`;
const ContainerTextPositionTime = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 32px 120px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`;

const TextName = styled.div`
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
  max-width: 400px; /* Controllo larghezza massima dell'immagine */
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
  const [currentTime, setCurrentTime] = useState<string>(
    moment().format("HH:mm:ss A")
  ); // Get current time
  const [location, setLocation] = useState<string>("Milan, IT"); // Default value

  useEffect(() => {
    // Imposta la lingua italiana
    moment.locale("it");
    // Aggiorna l'orario ogni secondo
    const timer = setInterval(() => {
      setCurrentTime(moment().format("HH:mm:ss A"));
    }, 1000);
    fetchLocation();
    // Pulisci il timer quando il componente viene smontato
    return () => {
      clearInterval(timer);
    };
  }, []);

  // Ottieni la posizione
  const fetchLocation = async () => {
    try {
      const position = await getPosition();
      setLocation(position);
    } catch (error) {
      console.error("Error getting position:", error);
    }
  };

  return (
    <>
      <Container>
        <ContainerTextName>
          <div className="chivo-mono">cristian/</div>
        </ContainerTextName>
        <ContainerTextPositionTime>
          <div className="chivo-mono">{location}</div>
          <div className="chivo-mono">{currentTime}</div>
        </ContainerTextPositionTime>

        <TextName className="agera-mono ">CRISTIAN SCARATTI</TextName>
        <Image src={avatar} alt="Avatar" />
      </Container>
      <TabNavigation></TabNavigation>
    </>
  );
};

export default Home;
