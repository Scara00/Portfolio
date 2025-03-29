import React, { useEffect, useState } from "react";
import styled from "styled-components";
import useDeviceType from "../hooks/useDeviceType";
import { motion, AnimatePresence } from "framer-motion";
// Import your icons
import aws from "../assets/icons/aws-svgrepo-com.svg";
import angular from "../assets/icons/angular-svgrepo-com.svg";
import electron from "../assets/icons/electron-svgrepo-com.svg";
import flutter from "../assets/icons/flutter-svgrepo-com.svg";
import javascriptIcon from "../assets/icons/javascript-svgrepo-com.svg";
import react from "../assets/icons/react-svgrepo-com.svg";
import ts from "../assets/icons/typescript-official-svgrepo-com.svg";
import figma from "../assets/icons/figma-svgrepo-com.svg";
import ModalSkillView from "../view/modalSkillView";

const TextName = styled.div<{ isMobile?: boolean }>`
  position: relative;
  color: rgba(71, 99, 254, 1);
  z-index: 4;
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

const IconsContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 10;
`;

const BouncingIcon = styled(motion.div)`
  background: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: rgba(71, 99, 254, 1);
  z-index: 5;
  position: absolute;

  &:hover {
    box-shadow: 0 6px 12px rgba(71, 99, 254, 0.3);
  }
`;

// Modal Components
const Backdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled(motion.div)<{ isMobile: boolean }>`
  background: white;
  border-radius: ${(props) => (props.isMobile ? "0" : "12px")};
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  position: relative;
  width: ${(props) => (props.isMobile ? "100%" : "500px")};
  height: ${(props) => (props.isMobile ? "100%" : "auto")};
  max-width: 90%;
  max-height: ${(props) => (props.isMobile ? "100%" : "80vh")};
  overflow: auto;
  z-index: 30;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: rgba(71, 99, 254, 1);
`;

// Define skills data
const skills = [
  {
    id: 1,
    name: "AWS",
    icon: aws,
    description: "",

    percentageSkill: 20,
  },
  {
    id: 2,
    name: "React js",
    icon: react,
    description: "",

    percentageSkill: 60,
  },
  {
    id: 3,
    name: "Angular",
    icon: angular,
    description: "",

    percentageSkill: 90,
  },
  {
    id: 4,
    name: "Typescript",
    icon: ts,
    description: "",

    percentageSkill: 90,
  },
  {
    id: 5,
    name: "Javascript",
    icon: javascriptIcon,
    description: "",

    percentageSkill: 90,
  },
  {
    id: 6,
    name: "Flutter",
    icon: flutter,
    description: "",

    percentageSkill: 90,
  },
  {
    id: 7,
    name: "Electron",
    icon: electron,
    description: "",
    percentageSkill: 90,
  },
  {
    id: 8,
    name: "Figma",
    icon: figma,
    description: "",
    percentageSkill: 90,
  },
];

// Generate a random number between min and max
const random = (min: number, max: number) => Math.random() * (max - min) + min;

const Skills: React.FC = () => {
  const { isMobile, isTablet } = useDeviceType();
  const [containerSize, setContainerSize] = useState({
    width: 1000,
    height: 800,
  });
  const [bouncingIcons, setBouncingIcons] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      velocityX: number;
      velocityY: number;
      size: number;
      icon: string;
      name: string;
    }>
  >([]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<(typeof skills)[0] | null>(
    null
  );

  // Calculate icon size based on device
  const iconSize = isMobile ? 40 : isTablet ? 50 : 80;

  // Setup container dimensions and initial icon positions
  useEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, [iconSize]);

  const updateSize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    setContainerSize({ width, height });

    // Initialize icons with random positions and velocities
    const newBouncingIcons = skills.map((skill) => {
      return {
        id: skill.id,
        x: random(iconSize, width - iconSize),
        y: random(iconSize, height - iconSize),
        velocityX: random(-3, 3), // Moderate speed
        velocityY: random(-3, 3), // Moderate speed
        size: iconSize,
        icon: skill.icon,
        name: skill.name,
      };
    });

    setBouncingIcons(newBouncingIcons);
  };

  // Handle icon click - open modal
  const handleIconClick = (icon: (typeof bouncingIcons)[0]) => {
    setSelectedSkill(skills.find((skill) => skill.id === icon.id) || null);
    setShowModal(true);

    // Pause animation when modal is open
    // This could be implemented by checking showModal in the animate function
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedSkill(null);
  };

  // Animation loop for bouncing effect
  useEffect(() => {
    if (bouncingIcons.length === 0) return;

    const animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [bouncingIcons.length, containerSize]);

  const animate = () => {
    // Skip animation if modal is open
    if (showModal) {
      requestAnimationFrame(animate);
      return;
    }

    setBouncingIcons((prevIcons) => {
      return prevIcons.map((icon) => {
        let newX = icon.x + icon.velocityX;
        let newY = icon.y + icon.velocityY;
        let newVelocityX = icon.velocityX;
        let newVelocityY = icon.velocityY;

        // Bounce off right/left edges
        if (newX + icon.size > containerSize.width || newX < 0) {
          newVelocityX = -newVelocityX;
          newX = newX < 0 ? 0 : containerSize.width - icon.size;
        }

        // Bounce off bottom/top edges
        if (newY + icon.size > containerSize.height || newY < 0) {
          newVelocityY = -newVelocityY;
          newY = newY < 0 ? 0 : containerSize.height - icon.size;
        }

        return {
          ...icon,
          x: newX,
          y: newY,
          velocityX: newVelocityX,
          velocityY: newVelocityY,
        };
      });
    });

    requestAnimationFrame(animate);
  };

  return (
    <>
      <TextName
        className="agera-mono"
        style={{ fontSize: isMobile ? "70px" : isTablet ? "150px" : "280px" }}>
        SKILLS
      </TextName>

      <IconsContainer>
        {bouncingIcons.map((icon) => (
          <BouncingIcon
            key={icon.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: icon.x,
              y: icon.y,
            }}
            transition={{ type: "spring", damping: 10 }}
            whileHover={{ scale: 1.2, zIndex: 10 }}
            onClick={() => handleIconClick(icon)}
            style={{
              width: icon.size,
              height: icon.size,
              zIndex: 10,
              x: icon.x,
              y: icon.y,
            }}>
            <img
              alt={`skill-${icon.id}`}
              src={icon.icon}
              height={icon.size * 0.6}
              width={icon.size * 0.6}
            />
          </BouncingIcon>
        ))}
      </IconsContainer>

      {/* Modal with AnimatePresence for smooth enter/exit animations */}
      <AnimatePresence>
        {showModal && (
          <Backdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}>
            <ModalContent
              isMobile={isMobile}
              initial={{
                opacity: 0,
                scale: isMobile ? 1 : 0.8,
                y: isMobile ? "100%" : 0,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: isMobile ? 1 : 0.8,
                y: isMobile ? "100%" : 0,
              }}
              onClick={(e) => e.stopPropagation()}>
              <CloseButton onClick={closeModal}>×</CloseButton>
              <ModalSkillView
                title={selectedSkill?.name || ""}
                description={selectedSkill?.description || ""}
                percentageSkill={
                  selectedSkill?.percentageSkill || 0
                }></ModalSkillView>
            </ModalContent>
          </Backdrop>
        )}
      </AnimatePresence>
    </>
  );
};

export default Skills;
