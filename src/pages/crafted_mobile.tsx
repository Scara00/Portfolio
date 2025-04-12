import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import HomePCA from "../assets/Creazione Assemblea - step 1.png";
import dettaglio from "../assets/Creazione Assemblea - step 2.png";
import dashboard2 from "../assets/Creazione Assemblea - step 3.png";
import dob from "../assets/login_app.png";
import docupload from "../assets/Prototype Home.png";
import dashboard from "../assets/Prototype Profile list items.png";
import loginPCA from "../assets/Safari Mobile • Dark Mode OFF-1.png";
import categorie from "../assets/Safari Mobile • Dark Mode OFF.png";
import useDeviceType from "../hooks/useDeviceType";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

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
  const [carouselActive, setCarouselActive] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const images = [
    { src: docupload, alt: "docupload" },
    { src: dashboard2, alt: "dashboard" },
    { src: dettaglio, alt: "dettaglio" },
    { src: dob, alt: "dob" },

    { src: HomePCA, alt: "home" },
    { src: dashboard, alt: "dashboard-1" },
    { src: loginPCA, alt: "login" },
    { src: categorie, alt: "categorie" },
  ];

  const getInitialStackedImages = () => {
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
        onClick={() => setCarouselActive(true)}
      />
    ));
  };

  const getInitialPosition = (index: number) => {
    if (index === 0) {
      return {
        maxWidth: isMobile ? "150px" : isTablet ? "250px" : "300px",
        transform: "translate(-80%, -50%)",
        zIndex: 1,
      };
    } else if (index === 1) {
      return {
        maxWidth: isMobile ? "150px" : isTablet ? "250px" : "300px",
        transform: "translate(-50%, -50%)",
        zIndex: 2,
      };
    } else {
      return {
        maxWidth: isMobile ? "150px" : isTablet ? "250px" : "300px",
        transform: "translate(-20%, -50%)",
        zIndex: 3,
      };
    }
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!carouselActive) return;

    e.preventDefault();

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    const threshold = 20;

    scrollTimeoutRef.current = setTimeout(() => {
      if (
        Math.abs(e.deltaX) > Math.abs(e.deltaY) &&
        Math.abs(e.deltaX) > threshold
      ) {
        if (e.deltaX > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      } else if (Math.abs(e.deltaY) > threshold) {
        if (e.deltaY > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }, 100);
  };

  const handleDragEnd = (
    e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = isMobile ? 50 : 100;

    if (info.offset.x < -threshold) {
      handleNext();
    } else if (info.offset.x > threshold) {
      handlePrev();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!carouselActive) {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        setCarouselActive(true);
      }
      return;
    }

    if (e.key === "ArrowRight") {
      handleNext();
    } else if (e.key === "ArrowLeft") {
      handlePrev();
    } else if (e.key === "Escape") {
      setCarouselActive(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [carouselActive, images.length]);

  const getImageSize = (isActive: boolean) => {
    if (isMobile) {
      return isActive ? 200 : 80;
    } else if (isTablet) {
      return isActive ? 500 : 300;
    }
    return isActive ? 800 : 500;
  };

  const getImageProps = (index: number) => {
    const position = index - activeIndex;

    const normalizedPosition =
      position < -1
        ? position + images.length
        : position > 1
        ? position - images.length
        : position;

    const xOffset =
      normalizedPosition * (isMobile ? 120 : isTablet ? 600 : 850);

    const isActive = position === 0;
    const zIndex = isActive ? 10 : 6;
    const opacity = isActive ? 1 : 0.8;
    const scale = isActive ? 1 : 0.85;

    return {
      x: xOffset,
      opacity,
      zIndex,
      scale,
      maxWidth: getImageSize(isActive),
    };
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
          scale: carouselActive ? 0.8 : 1,
          zIndex: carouselActive ? 0 : 4,
        }}
        transition={{
          duration: 0.5,
        }}>
        CRAFTED MOBILE
      </TextName>

      <AnimatePresence>
        {!carouselActive && <>{getInitialStackedImages()}</>}
      </AnimatePresence>

      <CarouselContainer
        ref={carouselRef}
        initial={{ opacity: 0 }}
        animate={{
          opacity: carouselActive ? 1 : 0,
          zIndex: carouselActive ? 5 : -1,
          transition: { duration: 0.5 },
        }}
        onWheel={handleWheel}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.5}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
        onDragEnd={handleDragEnd}>
        <AnimatePresence initial={false}>
          {images.map((image, index) => {
            const position = index - activeIndex;

            let normalizedPosition = position;
            if (position < -1) normalizedPosition += images.length;
            if (position > 1) normalizedPosition -= images.length;

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
                        zIndex: 2,
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
