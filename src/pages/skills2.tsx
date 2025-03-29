import React, { useEffect, useState } from "react";
import styled from "styled-components";
import useDeviceType from "../hooks/useDeviceType";
import { motion } from "framer-motion";
// Import your icons
import aws from "../assets/icons/aws-svgrepo-com.svg";
import angular from "../assets/icons/angular-svgrepo-com.svg";
import electron from "../assets/icons/electron-svgrepo-com.svg";
import flutter from "../assets/icons/flutter-svgrepo-com.svg";
import javascriptIcon from "../assets/icons/javascript-svgrepo-com.svg";
import react from "../assets/icons/react-svgrepo-com.svg";
import ts from "../assets/icons/typescript-official-svgrepo-com.svg";

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

// Define skills data
const skills = [
  { id: 1, name: "React", icon: aws },
  { id: 2, name: "Node.js", icon: react },
  { id: 3, name: "JavaScript", icon: angular },
  { id: 4, name: "HTML5", icon: ts },
  { id: 5, name: "CSS3", icon: javascriptIcon },
  { id: 6, name: "Git", icon: flutter },
  { id: 7, name: "Figma", icon: electron },
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
    }>
  >([]);

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
        velocityX: random(-2, 2),
        velocityY: random(-2, 2),
        size: iconSize,
        icon: skill.icon,
      };
    });

    setBouncingIcons(newBouncingIcons);
  };

  // Animation loop for bouncing effect
  useEffect(() => {
    if (bouncingIcons.length === 0) return;

    const animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [bouncingIcons.length, containerSize]);

  const animate = () => {
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
    </>
  );
};

export default Skills;
