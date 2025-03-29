import React, { useEffect, useState } from "react";
import Home from "./home";
import TabNavigation from "../components/tabNavigation";
import styled from "styled-components";
import moment from "moment";
import { getPosition } from "../utils/function";
import Crafted from "./crafted";
import useDeviceType from "../hooks/useDeviceType";

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

const ContainerTextName = styled.div<{ isMobile?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  padding: ${(props) => (props.isMobile ? "32px 40px" : "32px 120px")};
`;
const ContainerTextPositionTime = styled.div<{ isMobile?: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  padding: ${(props) => (props.isMobile ? "32px 40px" : "32px 120px")};
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`;

const Portfolio: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>(
    moment().format("HH:mm:ss A")
  );
  const [location, setLocation] = useState<string>("Milan, IT");
  const [showCrafted, setShowCrafted] = useState<boolean>(false);
  const [scrollAttemptCount, setScrollAttemptCount] = useState<number>(0);
  const { isMobile } = useDeviceType();

  useEffect(() => {
    // Existing time logic
    moment.locale("it");
    const timer = setInterval(() => {
      setCurrentTime(moment().format("HH:mm:ss A"));
    }, 1000);
    fetchLocation();

    // Add wheel event listener to detect scroll attempts
    const handleWheel = (e: WheelEvent) => {
      // Positive deltaY means scrolling down
      if (e.deltaY > 0) {
        setScrollAttemptCount((prev) => prev + 1);
        // Switch to Crafted after certain number of scroll attempts
        if (scrollAttemptCount > 1 && !showCrafted) {
          setShowCrafted(true);
        }
      } else if (e.deltaY < 0) {
        // Scrolling up
        setScrollAttemptCount((prev) => prev - 1);
        // Switch back to Home when scrolling up
        if (scrollAttemptCount < 1 && showCrafted) {
          setShowCrafted(false);
        }
      }
    };

    window.addEventListener("wheel", handleWheel);

    // Clean up all event listeners
    return () => {
      clearInterval(timer);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [scrollAttemptCount, showCrafted]);

  // Existing fetchLocation function
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
      <ContainerTextName isMobile={isMobile}>
        <div className="chivo-mono">cristian/</div>
      </ContainerTextName>
      <ContainerTextPositionTime isMobile={isMobile}>
        <div className="chivo-mono">{location}</div>
        <div className="chivo-mono">{currentTime}</div>
      </ContainerTextPositionTime>

      {/* Toggle between Home and Crafted based on scroll */}
      {showCrafted ? <Crafted /> : <Home />}

      <TabNavigation></TabNavigation>
    </Container>
  );
};

export default Portfolio;
