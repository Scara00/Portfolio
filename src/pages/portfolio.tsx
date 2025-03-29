import React, { useEffect, useState } from "react";
import Home from "./home";
import TabNavigation from "../components/tabNavigation";
import styled from "styled-components";
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

const Portfolio: React.FC = () => {
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
    <Container>
      <ContainerTextName>
        <div className="chivo-mono">cristian/</div>
      </ContainerTextName>
      <ContainerTextPositionTime>
        <div className="chivo-mono">{location}</div>
        <div className="chivo-mono">{currentTime}</div>
      </ContainerTextPositionTime>
      <Home></Home>
      <TabNavigation></TabNavigation>
    </Container>
  );
};

export default Portfolio;
