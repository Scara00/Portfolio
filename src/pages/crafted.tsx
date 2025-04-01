import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import HomePCA from "../assets/Home.png";
import dettaglio from "../assets/dettaglio.png";
import dashboard2 from "../assets/dashboard.png";
import dob from "../assets/DOB.png";
import docupload from "../assets/Docupload.png";
import dashboard from "../assets/MacBook Pro 16_ - 94.png";
import loginPCA from "../assets/LOGIN - LIGHT.png";
import categorie from "../assets/categorie.png";
import doc from "../assets/doc.png";
import form from "../assets/form.png";
import inclusione from "../assets/inclusione.png";
import lista from "../assets/lista.png";
import scelta from "../assets/scelta.png";
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

// Indicators for pagination
const PaginationContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 20;
`;

// Touch surface for swipe detection with horizontal scroll
const SwipeSurface = styled.div<{ carouselActive: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: ${(props) => (props.carouselActive ? 15 : 10)};
  touch-action: pan-y; /* Allow vertical scrolling */
  overflow-x: auto; /* Enable horizontal scrolling */
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  scrollbar-width: none; /* Hide scrollbar Firefox */
  -ms-overflow-scrolling: touch; /* Enable momentum scrolling in iOS */
  &::-webkit-scrollbar {
    display: none; /* Hide scrollbar Chrome/Safari/Opera */
  }
`;

const Crafted: React.FC = () => {
  const { isMobile, isTablet } = useDeviceType();
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselActive, setCarouselActive] = useState(false);
  // Changed type to number for compatibility - will store the timeout ID
  const scrollTimeoutRef = useRef<number | null>(null);
  const lastScrollXRef = useRef<number>(0);

  // Touch handling
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchStartTimeRef = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 50; // Minimum swipe distance in pixels
  const SWIPE_TIMEOUT = 300; // Maximum time for swipe in milliseconds
  const SCROLL_DELAY = 150; // Delay after scroll stops to trigger image change

  // Ref for the swipe surface element
  const swipeSurfaceRef = useRef<HTMLDivElement>(null);

  // Array of images for the carousel
  const images = [
    { src: loginPCA, alt: "login" },
    { src: dettaglio, alt: "dettaglio" },
    { src: dashboard2, alt: "dashboard" },
    { src: dob, alt: "dob" },
    { src: docupload, alt: "docupload" },
    { src: HomePCA, alt: "home" },
    { src: dashboard, alt: "dashboard-1" },
    { src: categorie, alt: "categorie" },
    { src: doc, alt: "doc" },
    { src: form, alt: "form" },
    { src: inclusione, alt: "inclusione" },
    { src: lista, alt: "lista" },
    { src: scelta, alt: "scelta" },
  ];

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

  // Handle scroll events for horizontal scrolling
  useEffect(() => {
    const swipeSurface = swipeSurfaceRef.current;
    if (!swipeSurface) return;

    swipeSurface.addEventListener("scroll", handleScroll);

    return () => {
      swipeSurface.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [carouselActive, images.length]);

  // Calculate image size based on device
  const getImageSize = (isActive: boolean) => {
    if (isMobile) {
      return isActive ? 150 : 100;
    } else if (isTablet) {
      return isActive ? 600 : 400;
    }
    return isActive ? 900 : 500;
  };

  const handleScroll = () => {
    if (!carouselActive) {
      // Activate carousel on first horizontal scroll
      setCarouselActive(true);
      return;
    }

    const currentScrollX = swipeSurface.scrollLeft;

    // Clear previous timeout
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    // Set a timeout to detect when scrolling stops
    scrollTimeoutRef.current = window.setTimeout(() => {
      // Determine scroll direction
      if (Math.abs(currentScrollX - lastScrollXRef.current) > 10) {
        const scrollRight = currentScrollX > lastScrollXRef.current;

        // Update image index based on scroll direction
        if (scrollRight) {
          // Scrolled right, show previous image
          setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        } else {
          // Scrolled left, show next image
          setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }
      }

      // Reset scroll position (with a small delay to avoid visual glitches)
      setTimeout(() => {
        if (swipeSurface) {
          swipeSurface.scrollTo({
            left: 0,
            behavior: "auto",
          });
        }
        lastScrollXRef.current = 0;
      }, 50);
    }, SCROLL_DELAY);

    lastScrollXRef.current = currentScrollX;
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    touchStartTimeRef.current = Date.now();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Handle touch move if needed
    if (
      touchStartXRef.current !== null &&
      touchStartYRef.current !== null &&
      Math.abs(e.touches[0].clientX - touchStartXRef.current) >
        Math.abs(e.touches[0].clientY - touchStartYRef.current) * 2
    ) {
      // If horizontal movement is significantly more than vertical
      // We could add additional logic here if needed
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (
      touchStartXRef.current === null ||
      touchStartYRef.current === null ||
      touchStartTimeRef.current === null
    ) {
      return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const touchTime = Date.now() - touchStartTimeRef.current;
    const touchDiffX = touchStartXRef.current - touchEndX;
    const touchDiffY = Math.abs(touchStartYRef.current - touchEndY);

    // Only handle as swipe if more horizontal than vertical and meets thresholds
    if (
      touchDiffY < 50 &&
      touchTime < SWIPE_TIMEOUT &&
      Math.abs(touchDiffX) > SWIPE_THRESHOLD
    ) {
      if (!carouselActive) {
        // Activate carousel on first swipe
        setCarouselActive(true);
      } else {
        // Navigate through carousel based on swipe direction
        if (touchDiffX > 0) {
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
    touchStartYRef.current = null;
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
      normalizedPosition * (isMobile ? 120 : isTablet ? 600 : 850);

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

  // Get the initial stacked images (now supports more than 3)
  const getInitialStackedImages = () => {
    // We'll show a maximum of 3 images initially in the stack
    const initialImages = images.slice(0, Math.min(3, images.length));

    return initialImages.map((image, index) => (
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
    ));
  };

  // Initial diagonal positions for the stacked images
  const getInitialPosition = (index: number) => {
    // First image: more to top-left
    if (index === 0) {
      return {
        maxWidth: isMobile ? "150px" : isTablet ? "450px" : "550px",
        transform: "translate(-70%, -70%)",
        zIndex: 1,
      };
    }
    // Second image: middle
    else if (index === 1) {
      return {
        maxWidth: isMobile ? "150px" : isTablet ? "450px" : "550px",
        transform: "translate(-50%, -50%)",
        zIndex: 2,
      };
    }
    // Third image: more to bottom-right
    else {
      return {
        maxWidth: isMobile ? "150px" : isTablet ? "450px" : "550px",
        transform: "translate(-30%, -30%)",
        zIndex: 3,
      };
    }
  };

  // Handle pagination dot click
  const handleDotClick = (index: number) => {
    if (carouselActive) {
      setActiveIndex(index);
    } else {
      setCarouselActive(true);
      setActiveIndex(index);
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
        {!carouselActive && <>{getInitialStackedImages()}</>}
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
          {images.map((image, index) => {
            // Calculate position relative to active image
            const position = index - activeIndex;

            // Handle wraparound
            let normalizedPosition = position;
            if (position < -1) normalizedPosition += images.length;
            if (position > 1) normalizedPosition -= images.length;

            // Only render the active image and immediate neighbors
            const shouldRender =
              normalizedPosition === 0 ||
              normalizedPosition === 1 ||
              normalizedPosition === -1;

            if (!shouldRender) return null;

            return (
              <CarouselItem
                key={`carousel-${image.alt}`}
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
            );
          })}
        </AnimatePresence>
      </CarouselContainer>

      {/* Surface for horizontal scrolling and touch events */}
      <SwipeSurface
        ref={swipeSurfaceRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        carouselActive={carouselActive}
      />
    </>
  );
};

export default Crafted;
