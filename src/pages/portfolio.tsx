import React, { useEffect, useState } from "react";
import Home from "./home";
import TabNavigation from "../components/tabNavigation";
import styled from "styled-components";
import moment from "moment";
import { getPosition } from "../utils/function";
import Crafted from "./crafted";
import useDeviceType from "../hooks/useDeviceType";
import { AnimatePresence, motion } from "framer-motion";
import About from "./skills2";
import Contact from "./contact";

const Container = styled.div`
  height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  gap: 24px;
  overflow: hidden;

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
  // Replace boolean with numeric index (0-3) for four sections
  const [activeSection, setActiveSection] = useState<number>(0);
  const { isMobile } = useDeviceType();

  // Track touch start position
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  // Helper function to get section title
  const getSectionTitle = (index: number): string => {
    switch (index) {
      case 0:
        return "HOME";
      case 1:
        return "CRAFTED";
      case 2:
        return "SKILLS";
      case 3:
        return "CONTACT";
      default:
        return "HOME";
    }
  };

  useEffect(() => {
    // Existing time logic
    moment.locale("it");
    const timer = setInterval(() => {
      setCurrentTime(moment().format("HH:mm:ss A"));
    }, 1000);
    fetchLocation();

    // Add all event listeners
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("keydown", handleKeyDown);

    // Clean up all event listeners
    return () => {
      clearInterval(timer);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [touchStartY, activeSection]);

  // Fetch location function
  const fetchLocation = async () => {
    try {
      const position = await getPosition();
      setLocation(position);
    } catch (error) {
      console.error("Error getting position:", error);
    }
  };

  // Updated scroll wheel detection for multiple sections
  const handleWheel = (e: WheelEvent) => {
    // Prevent default scrolling behavior
    e.preventDefault();

    // If scrolling down, go to next section
    if (e.deltaY > 0) {
      setActiveSection((prev) => (prev < 3 ? prev + 1 : prev));
    }
    // If scrolling up, go to previous section
    else if (e.deltaY < 0) {
      setActiveSection((prev) => (prev > 0 ? prev - 1 : prev));
    }
  };

  // Touch events for mobile
  const handleTouchStart = (e: TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartY === null) return;

    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;

    // If swipe up, go to next section
    if (diff > 50) {
      setActiveSection((prev) => (prev < 3 ? prev + 1 : prev));
    }
    // If swipe down, go to previous section
    else if (diff < -50) {
      setActiveSection((prev) => (prev > 0 ? prev - 1 : prev));
    }

    setTouchStartY(null);
  };

  // Updated keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    // Navigate down
    if (e.key === "ArrowDown" || e.key === "PageDown") {
      setActiveSection((prev) => (prev < 3 ? prev + 1 : prev));
    }
    // Navigate up
    else if (e.key === "ArrowUp" || e.key === "PageUp") {
      setActiveSection((prev) => (prev > 0 ? prev - 1 : prev));
    }
    // Direct navigation with number keys
    else if (e.key === "1") {
      setActiveSection(0);
    } else if (e.key === "2") {
      setActiveSection(1);
    } else if (e.key === "3") {
      setActiveSection(2);
    } else if (e.key === "4") {
      setActiveSection(3);
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 0:
        return (
          <motion.div
            key="home"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}>
            <Home />
          </motion.div>
        );
      case 1:
        return (
          <motion.div
            key="crafted"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.5 }}>
            <Crafted />
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="about"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.5 }}>
            <About />
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="contact"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.5 }}>
            <Contact />
          </motion.div>
        );
      default:
        return <Home />;
    }
  };

  return (
    <Container>
      <ContainerTextName isMobile={isMobile}>
        <div className="chivo-mono">
          cristian/{getSectionTitle(activeSection).toLowerCase()}
        </div>
      </ContainerTextName>
      <ContainerTextPositionTime isMobile={isMobile}>
        <div className="chivo-mono">{location}</div>
        <div className="chivo-mono">{currentTime}</div>
      </ContainerTextPositionTime>

      <AnimatePresence mode="popLayout">
        {renderActiveSection()}
      </AnimatePresence>

      <TabNavigation />
    </Container>
  );
};

export default Portfolio;
