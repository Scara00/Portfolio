import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import HomePCA from "../assets/Home.png";
import dashboard from "../assets/MacBook Pro 16_ - 94.png";
import loginPCA from "../assets/LOGIN - LIGHT.png";
import useDeviceType from "../hooks/useDeviceType";
import { motion, AnimatePresence } from "framer-motion";

const TextName = styled(motion.div)<{ isMobile?: boolean }>`
  position: relative;
  color: rgba(71, 99, 254, 1);
  z-index: 4; /* Text above the initial diagonal images */
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

const InitialImage = styled(motion.img)`
  height: auto;
  position: absolute;
  border-radius: 8px;
  box-shadow: -4px -4px 12px 0px rgba(0, 0, 0, 0.12);
  top: 50%;
  left: 50%;
`;

const CarouselContainer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5; /* Carousel above everything when active */
`;

const CarouselItem = styled(motion.div)`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform;
`;

const StyledImage = styled(motion.img)`
  height: auto;
  border-radius: 12px;
  box-shadow: -4px -4px 12px 0px rgba(0, 0, 0, 0.12);
`;

// Invisible touch surface for swipe detection
const SwipeSurface = styled.div<{ carouselActive: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: ${(props) => (props.carouselActive ? 4 : -1)};
  touch-action: pan-y; /* Allow vertical scrolling */
`;

const Crafted: React.FC = () => {
  const { isMobile, isTablet } = useDeviceType();
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselActive, setCarouselActive] = useState(false);

  // Touch handling
  const touchStartXRef = useRef<number | null>(null);
  const touchStartTimeRef = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 50; // Minimum swipe distance in pixels
  const SWIPE_TIMEOUT = 300; // Maximum time for swipe in milliseconds

  // Array of images for the carousel
  const images = [
    { src: dashboard, alt: "Dashboard" },
    { src: loginPCA, alt: "Login" },
    { src: HomePCA, alt: "Home" },
  ];

  // Calculate image size based on device
  const getImageSize = (isActive: boolean) => {
    if (isMobile) {
      return isActive ? 150 : 100;
    } else if (isTablet) {
      return isActive ? 300 : 200;
    }
    return isActive ? 500 : 350;
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Activate carousel on first arrow press if not already active
      if (!carouselActive) {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          setCarouselActive(true);
        }
        return;
      }

      // Navigate through carousel
      if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Clean up event listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [carouselActive, images.length]);

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartTimeRef.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartTimeRef.current === null) {
      return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const touchTime = Date.now() - touchStartTimeRef.current;
    const touchDiff = touchStartXRef.current - touchEndX;

    // Check if the touch was a swipe (fast enough and long enough distance)
    if (touchTime < SWIPE_TIMEOUT && Math.abs(touchDiff) > SWIPE_THRESHOLD) {
      if (!carouselActive) {
        // Activate carousel on first swipe
        setCarouselActive(true);
      } else {
        // Navigate through carousel based on swipe direction
        if (touchDiff > 0) {
          // Swipe left - go to next
          setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        } else {
          // Swipe right - go to previous
          setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        }
      }
    }

    // Reset touch refs
    touchStartXRef.current = null;
    touchStartTimeRef.current = null;
  };

  // Calculate positions for each image based on active index
  const getImageProps = (index: number) => {
    // Calculate position relative to active image (-1, 0, 1)
    const position = index - activeIndex;

    // Handle wraparound (e.g., last image appears on left of first image)
    const normalizedPosition =
      position < -1
        ? position + images.length
        : position > 1
        ? position - images.length
        : position;

    // Calculate X offset based on position
    const xOffset =
      normalizedPosition * (isMobile ? 120 : isTablet ? 250 : 400);

    // Active item is centered, larger, fully opaque, in front
    // Other items are offset left/right, smaller, semi-transparent, behind
    const isActive = position === 0;
    const zIndex = isActive ? 10 : 5;
    const opacity = isActive ? 1 : 0.6;
    const scale = isActive ? 1 : 0.85;

    return {
      x: xOffset,
      opacity,
      zIndex,
      scale,
      maxWidth: getImageSize(isActive),
    };
  };

  // Initial diagonal positions for the stacked images
  const getInitialPosition = (index: number) => {
    // First image: more to top-left
    if (index === 0) {
      return {
        maxWidth: isMobile ? "150px" : isTablet ? "300px" : "600px",
        transform: "translate(-80%, -80%)",
        zIndex: 1,
      };
    }
    // Second image: middle
    else if (index === 1) {
      return {
        maxWidth: isMobile ? "150px" : isTablet ? "300px" : "600px",
        transform: "translate(-40%, -40%)",
        zIndex: 2,
      };
    }
    // Third image: more to bottom-right
    else {
      return {
        maxWidth: isMobile ? "150px" : isTablet ? "300px" : "600px",
        transform: "translate(-20%, -20%)",
        zIndex: 3,
      };
    }
  };

  return (
    <>
      <TextName
        className="agera-mono"
        style={{
          fontSize: isMobile ? "70px" : isTablet ? "200px" : "280px",
          textAlign: "center",
        }}
        animate={{
          scale: carouselActive ? 0.9 : 1,
          opacity: carouselActive ? 0.7 : 1,
          filter: carouselActive ? "blur(2px)" : "none",
          zIndex: carouselActive ? 2 : 4,
        }}
        transition={{
          duration: 0.5,
        }}>
        CRAFTED
      </TextName>

      {/* Initial diagonal images when carousel is not active */}
      <AnimatePresence>
        {!carouselActive && (
          <>
            {images.map((image, index) => (
              <InitialImage
                key={`initial-${image.alt}`}
                src={image.src}
                alt={image.alt}
                style={{
                  ...getInitialPosition(index),
                }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.3 },
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Carousel that appears when activated */}
      <CarouselContainer
        initial={{ opacity: 0 }}
        animate={{
          opacity: carouselActive ? 1 : 0,
          zIndex: carouselActive ? 5 : -1,
          transition: { duration: 0.5 },
        }}>
        <AnimatePresence initial={false}>
          {images.map((image, index) => (
            <CarouselItem
              key={image.alt}
              initial={false}
              animate={
                carouselActive
                  ? getImageProps(index)
                  : {
                      opacity: 0,
                      x: 0,
                      scale: 0.5,
                      zIndex: -1,
                    }
              }
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                opacity: { duration: 0.3 },
              }}>
              <StyledImage
                src={image.src}
                alt={image.alt}
                style={{
                  maxWidth: getImageSize(index === activeIndex),
                }}
                whileHover={carouselActive ? { scale: 1.05 } : undefined}
              />
            </CarouselItem>
          ))}
        </AnimatePresence>
      </CarouselContainer>

      {/* Invisible surface to detect touch events */}
      <SwipeSurface
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        carouselActive={carouselActive}
      />
    </>
  );
};

export default Crafted;
