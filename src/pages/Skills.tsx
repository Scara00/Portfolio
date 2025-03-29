import React from "react";
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

const OrbitContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 6;
`;

const SkillIcon = styled(motion.div)`
  background: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: rgba(71, 99, 254, 1);
  z-index: 5;

  &:hover {
    box-shadow: 0 6px 12px rgba(71, 99, 254, 0.3);
    transform: scale(1.1);
  }
`;

const IconOrbit = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Define skills data
const skills = [
  {
    id: 1,
    name: "React",
    icon: aws,
    description: "Frontend library for building user interfaces",
  },
  {
    id: 2,
    name: "Node.js",
    icon: react,
    description: "JavaScript runtime for building server-side applications",
  },
  {
    id: 3,
    name: "JavaScript",
    icon: angular,
    description: "Programming language for web development",
  },
  {
    id: 4,
    name: "HTML5",
    icon: ts,
    description: "Markup language for the web",
  },
  {
    id: 5,
    name: "CSS3",
    icon: javascriptIcon,
    description: "Styling language for web pages",
  },
  {
    id: 6,
    name: "Git",
    icon: flutter,
    description: "Version control system",
  },
  {
    id: 7,
    name: "Figma",
    icon: electron,
    description: "Design tool for UI/UX",
  },
];

const Skills: React.FC = () => {
  const { isMobile, isTablet } = useDeviceType();

  // Calculate orbit sizes based on device - LARGER than text
  const orbitSize = isMobile ? 180 : isTablet ? 300 : 500;

  return (
    <>
      <TextName
        className="agera-mono"
        style={{ fontSize: isMobile ? "70px" : isTablet ? "150px" : "280px" }}>
        SKILLS
      </TextName>

      <OrbitContainer>
        {skills.map((skill, index) => {
          // Calculate position on the orbit
          const angle = (index / skills.length) * 360; // Convert to degrees
          const rotationDuration = 45; // Same as the main orbit

          return (
            <IconOrbit
              key={skill.id}
              initial={{ rotate: angle }}
              animate={{
                rotate: angle + 360, // Full rotation
              }}
              transition={{
                duration: rotationDuration,
                repeat: Infinity,
                ease: "linear",
              }}>
              <SkillIcon
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: orbitSize, // Position at the edge of the orbit
                  transition: { delay: index * 0.1 },
                }}
                whileHover={{ scale: 1.2 }}
                style={{
                  width: isMobile ? "50px" : "70px",
                  height: isMobile ? "50px" : "70px",
                }}>
                <img
                  alt={skill.name}
                  src={skill.icon}
                  height={isMobile ? 30 : 40}
                  width={isMobile ? 30 : 40}
                />
              </SkillIcon>
            </IconOrbit>
          );
        })}
      </OrbitContainer>
    </>
  );
};

export default Skills;
