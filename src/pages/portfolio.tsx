import React, { useEffect, useState, useRef } from "react";
import Home from "./home";
import TabNavigation from "../components/tabNavigation";
import styled from "styled-components";
import moment from "moment";
import { getPosition } from "../utils/function";
import Crafted from "./crafted";
import useDeviceType from "../hooks/useDeviceType";
import { AnimatePresence, motion } from "framer-motion";

import Contact from "./contact";
import Skills from "./Skills";

const Container = styled.div`
  height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  gap: 24px;
  overflow: hidden;
  overscroll-behavior: none; /* Prevent pull-to-refresh */
  touch-action: none; /* Disable browser handling of all panning and zooming gestures */

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
const ContainerTextInfo = styled.div<{ isMobile?: boolean }>`
  position: absolute;
  bottom: ${(props) => (props.isMobile ? "10%" : "0")};
  right: ${(props) => (props.isMobile ? "50%" : "0")};
  transform: ${(props) => (props.isMobile ? "translateX(50%)" : "none")};
  padding: ${(props) => (props.isMobile ? "10px 0px" : "50px 120px")};
  text-align: center;
`;

const Portfolio: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>(
    moment().format("HH:mm:ss A")
  );
  const [location, setLocation] = useState<string>("Milan, IT");
  const [activeSection, setActiveSection] = useState<number>(0);
  const { isMobile, isDesktop } = useDeviceType();

  // Track touch start position
  const touchStartYRef = useRef<number | null>(null);

  // Refs for scroll handling
  const lastScrollTimeRef = useRef<number>(0);
  const scrollAccumulatorRef = useRef<number>(0);
  const activeSectionRef = useRef<number>(0); // Keep a ref to track current section
  const isTransitioningRef = useRef<boolean>(false);
  const SCROLL_DELAY = 1000; // Increased to prevent accidental triggers
  const SCROLL_THRESHOLD = 50; // Increased threshold for more deliberate scrolling

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

  // Update ref when activeSection state changes
  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    fetchLocation();

    // Existing time logic
    moment.locale("it");
    const timer = setInterval(() => {
      setCurrentTime(moment().format("HH:mm:ss A"));
    }, 1000);

    // Function to handle wheel events with proper binding
    const wheelHandler = (e: WheelEvent) => handleWheel(e);
    const touchStartHandler = (e: TouchEvent) => handleTouchStart(e);
    const touchEndHandler = (e: TouchEvent) => handleTouchEnd(e);
    const keyDownHandler = (e: KeyboardEvent) => handleKeyDown(e);

    // Add all event listeners
    window.addEventListener("wheel", wheelHandler, { passive: false });
    window.addEventListener("touchstart", touchStartHandler, {
      passive: false,
    });
    window.addEventListener("touchend", touchEndHandler);
    window.addEventListener("keydown", keyDownHandler);

    // Prevent body scrolling
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden"; // Also for html element

    // Clean up all event listeners
    return () => {
      clearInterval(timer);
      window.removeEventListener("wheel", wheelHandler);
      window.removeEventListener("touchstart", touchStartHandler);
      window.removeEventListener("touchend", touchEndHandler);
      window.removeEventListener("keydown", keyDownHandler);

      // Restore body scrolling
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []); // Empty dependency array to run only once

  // Fetch location function
  const fetchLocation = async () => {
    try {
      const position = await getPosition();
      setLocation(position);
    } catch (error) {
      console.error("Error getting position:", error);
    }
  };

  // Function to safely change sections with debouncing
  const changeSection = (direction: number) => {
    const now = Date.now();

    // Check if we're in a transition or haven't waited long enough
    if (
      isTransitioningRef.current ||
      now - lastScrollTimeRef.current < SCROLL_DELAY
    ) {
      // Reset accumulator if we're not changing section to prevent buildup
      scrollAccumulatorRef.current = 0;
      return;
    }

    const currentSection = activeSectionRef.current;
    let newSection = currentSection + direction;

    // Ensure we stay within bounds
    if (newSection < 0) newSection = 0;
    if (newSection > 3) newSection = 3;

    // Only change if different
    if (newSection !== currentSection) {
      isTransitioningRef.current = true;
      setActiveSection(newSection);
      lastScrollTimeRef.current = now;

      // Reset accumulator after changing section
      scrollAccumulatorRef.current = 0;

      // Clear transition lock after animation completes
      setTimeout(() => {
        isTransitioningRef.current = false;
      }, SCROLL_DELAY);
    } else {
      // Reset accumulator even if we didn't change section
      scrollAccumulatorRef.current = 0;
    }
  };

  // Wheel event handler with better delta filtering
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();

    // Filter out extremely small deltas (probably from inertial scrolling or trackpads)
    const absY = Math.abs(e.deltaY);

    // Ignore very small movements that might be noise or inertial scrolling
    if (absY < 1) return;

    // For very large deltas (typical of mousewheel), normalize them
    const normalizedDelta = Math.min(absY, 100) * (e.deltaY < 0 ? -1 : 1);

    // Accumulate scroll deltas
    scrollAccumulatorRef.current += normalizedDelta;

    // Check if accumulated scroll is enough to trigger a section change
    if (Math.abs(scrollAccumulatorRef.current) > SCROLL_THRESHOLD) {
      const direction = scrollAccumulatorRef.current > 0 ? 1 : -1;
      changeSection(direction);
      // Reset accumulator after attempting a section change
      scrollAccumulatorRef.current = 0;
    }
  };

  // Touch events for mobile
  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault(); // Prevent default to avoid any browser handling
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartYRef.current === null) return;

    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartYRef.current - touchEndY;

    // Determine swipe direction if it exceeds threshold
    if (Math.abs(diff) > SCROLL_THRESHOLD) {
      const direction = diff > 0 ? 1 : -1;
      changeSection(direction);
    }

    touchStartYRef.current = null;
  };

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    let direction = 0;

    // Determine direction based on key
    if (e.key === "ArrowDown" || e.key === "PageDown") {
      direction = 1;
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      direction = -1;
    }

    if (direction !== 0) {
      changeSection(direction);
    }
    // Direct navigation with number keys
    else if (e.key >= "1" && e.key <= "4") {
      const targetSection = parseInt(e.key) - 1;
      if (targetSection !== activeSectionRef.current) {
        const now = Date.now();
        if (
          now - lastScrollTimeRef.current >= SCROLL_DELAY &&
          !isTransitioningRef.current
        ) {
          isTransitioningRef.current = true;
          setActiveSection(targetSection);
          lastScrollTimeRef.current = now;

          setTimeout(() => {
            isTransitioningRef.current = false;
          }, SCROLL_DELAY);
        }
      }
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 0:
        return (
          <motion.div
            key="home"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.4 }}>
            <Home />
          </motion.div>
        );
      case 1:
        return (
          <motion.div
            key="crafted"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.4 }}>
            <Crafted />
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="skills"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.4 }}>
            <Skills />
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="contact"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.4 }}>
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
      {activeSection === 0 && isDesktop && (
        <ContainerTextInfo isMobile={isMobile}>
          <div
            className="chivo-mono"
            style={{ fontSize: isMobile ? "12px" : "16px" }}>
            Usa le frecce ↑, ↓ per navigare il portfolio.
          </div>
        </ContainerTextInfo>
      )}
      {activeSection === 1 && isDesktop && (
        <ContainerTextInfo isMobile={isMobile}>
          <div
            className="chivo-mono"
            style={{ fontSize: isMobile ? "12px" : "16px" }}>
            Usa la freccia → per vedere alcuni miei lavori.
          </div>
        </ContainerTextInfo>
      )}

      <AnimatePresence mode="wait">{renderActiveSection()}</AnimatePresence>

      <TabNavigation activeSection={activeSection} />
    </Container>
  );
};

export default Portfolio;
