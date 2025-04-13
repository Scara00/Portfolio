import React, { useEffect, useState } from "react";
import styled from "styled-components";
import useDeviceType from "../hooks/useDeviceType";
import { motion } from "framer-motion";
import { skillsMock } from "../utils/mock";

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

// Generate a random number between min and max
const random = (min: number, max: number) => Math.random() * (max - min) + min;

const Skills: React.FC = () => {
  const { isMobile, isTablet } = useDeviceType();
  const [containerSize, setContainerSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
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

  // Calculate icon size based on device
  const iconSize = isMobile ? 20 : isTablet ? 60 : 70;

  // Setup container dimensions and initial icon positions
  useEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, [iconSize]);

  const updateSize = () => {
    setContainerSize({ width: window.innerWidth, height: window.innerHeight });
    setBouncingIcons(newBouncingIcons);
  };

  // Initialize icons with random positions and velocities
  const newBouncingIcons = skillsMock.map((skill) => {
    return {
      id: skill.id,
      x: random(iconSize, window.innerWidth - iconSize),
      y: random(iconSize, window.innerHeight - iconSize),
      velocityX: isMobile ? random(-1, 2) : random(-3, 3), // Moderate speed
      velocityY: isMobile ? random(-1, 2) : random(-3, 3), // Moderate speed
      size: iconSize,
      icon: skill.icon,
      name: skill.name,
    };
  });

  // Animation loop for bouncing effect
  useEffect(() => {
    if (bouncingIcons.length === 0) return;

    const animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [bouncingIcons.length, containerSize]);

  const animate = () => {
    setBouncingIcons((prevIcons) => {
      // First, move all icons based on their velocity
      const movedIcons = prevIcons.map((icon) => {
        let newX = icon.x + icon.velocityX;
        let newY = icon.y + icon.velocityY;
        let newVelocityX = icon.velocityX;
        let newVelocityY = icon.velocityY;

        // Bounce off right/left edges
        if (newX + icon.size >= containerSize.width) {
          newVelocityX = -Math.abs(newVelocityX);
          newX = containerSize.width - icon.size;
        } else if (newX <= 0) {
          newVelocityX = Math.abs(newVelocityX);
          newX = 0;
        }

        // Bounce off bottom/top edges
        if (newY + icon.size >= containerSize.height) {
          newVelocityY = -Math.abs(newVelocityY);
          newY = containerSize.height - icon.size;
        } else if (newY <= 0) {
          newVelocityY = Math.abs(newVelocityY);
          newY = 0;
        }

        return {
          ...icon,
          x: newX,
          y: newY,
          velocityX: newVelocityX,
          velocityY: newVelocityY,
        };
      });

      // Then check for collisions between icons
      const collidedIcons = [...movedIcons];

      // Check each pair of icons for collision
      for (let i = 0; i < collidedIcons.length; i++) {
        for (let j = i + 1; j < collidedIcons.length; j++) {
          const icon1 = collidedIcons[i];
          const icon2 = collidedIcons[j];

          // Calculate centers
          const center1 = {
            x: icon1.x + icon1.size / 2,
            y: icon1.y + icon1.size / 2,
          };

          const center2 = {
            x: icon2.x + icon2.size / 2,
            y: icon2.y + icon2.size / 2,
          };

          // Calculate distance between centers
          const dx = center2.x - center1.x;
          const dy = center2.y - center1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Sum of radii
          const minDistance = (icon1.size + icon2.size) / 2;

          // Check if colliding
          if (distance < minDistance) {
            // Calculate collision angle
            const angle = Math.atan2(dy, dx);

            // Calculate velocity magnitudes before collision
            const mag1 = Math.sqrt(
              icon1.velocityX * icon1.velocityX +
                icon1.velocityY * icon1.velocityY
            );
            const mag2 = Math.sqrt(
              icon2.velocityX * icon2.velocityX +
                icon2.velocityY * icon2.velocityY
            );

            // Calculate direction angles
            const dir1 = Math.atan2(icon1.velocityY, icon1.velocityX);
            const dir2 = Math.atan2(icon2.velocityY, icon2.velocityX);

            // Calculate new velocity components
            // Using simplified physics for elastic collision
            const newVelX1 =
              mag2 * Math.cos(dir2 - angle) * Math.cos(angle) +
              mag1 * Math.sin(dir1 - angle) * Math.cos(angle + Math.PI / 2);
            const newVelY1 =
              mag2 * Math.cos(dir2 - angle) * Math.sin(angle) +
              mag1 * Math.sin(dir1 - angle) * Math.sin(angle + Math.PI / 2);

            const newVelX2 =
              mag1 * Math.cos(dir1 - angle) * Math.cos(angle) +
              mag2 * Math.sin(dir2 - angle) * Math.cos(angle + Math.PI / 2);
            const newVelY2 =
              mag1 * Math.cos(dir1 - angle) * Math.sin(angle) +
              mag2 * Math.sin(dir2 - angle) * Math.sin(angle + Math.PI / 2);

            // Prevent overlap by pushing icons apart
            const overlap = minDistance - distance;
            const pushX = overlap * Math.cos(angle) * 0.5; // Half the overlap distance
            const pushY = overlap * Math.sin(angle) * 0.5;

            collidedIcons[i] = {
              ...icon1,
              velocityX: newVelX1,
              velocityY: newVelY1,
              x: icon1.x - pushX, // Move icon1 away from icon2
              y: icon1.y - pushY,
            };

            collidedIcons[j] = {
              ...icon2,
              velocityX: newVelX2,
              velocityY: newVelY2,
              x: icon2.x + pushX, // Move icon2 away from icon1
              y: icon2.y + pushY,
            };
          }
        }
      }

      return collidedIcons;
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
