import React, { useState } from "react";
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
  border-radius: 32px;
  box-shadow: -4px -4px 12px 0px rgba(0, 0, 0, 0.12);
  top: 50%;
  left: 50%;
`;

const Crafted: React.FC = () => {
  const { isMobile, isTablet } = useDeviceType();
  const [carouselActive, setCarouselActive] = useState(false);

  const images = [
    { src: loginPCA, alt: "login" },
    { src: dettaglio, alt: "dettaglio" },
    { src: dashboard2, alt: "dashboard" },
    { src: dob, alt: "dob" },
    { src: docupload, alt: "docupload" },
    { src: HomePCA, alt: "home" },
    { src: dashboard, alt: "dashboard-1" },
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

          zIndex: carouselActive ? 2 : 4,
        }}
        transition={{
          duration: 0.5,
        }}>
        CRAFTED MOBILE
      </TextName>

      <AnimatePresence>
        {!carouselActive && <>{getInitialStackedImages()}</>}
      </AnimatePresence>
    </>
  );
};

export default Crafted;
