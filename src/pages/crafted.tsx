import React, { useState, useEffect } from "react";
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
  border-radius: 8px;
  box-shadow: -4px -4px 12px 0px rgba(0, 0, 0, 0.12);
`;

const Crafted: React.FC = () => {
  const { isMobile, isTablet } = useDeviceType();
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselActive, setCarouselActive] = useState(false);

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
  // Handle keyboard navigation
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    // Clean up event listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [carouselActive, images.length]);

  // Calculate image size based on device
  const getImageSize = (isActive: boolean) => {
    if (isMobile) {
      return isActive ? 300 : 200;
    } else if (isTablet) {
      return isActive ? 600 : 400;
    }
    return isActive ? 900 : 700;
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

  return (
    <>
      <TextName
        onClick={() => setCarouselActive(true)}
        onTap={() => setCarouselActive(true)}
        className="agera-mono"
        style={{
          fontSize: isMobile ? "70px" : isTablet ? "200px" : "280px",
          textAlign: "center",
        }}
        animate={{
          scale: carouselActive ? 0.9 : 1,
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
    </>
  );
};

export default Crafted;
