import React from "react";
import styled from "styled-components";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import mail from "../assets/icons/mail.svg";
import threads from "../assets/icons/treaths.svg";
import github from "../assets/icons/github.svg";
import linkedin from "../assets/icons/linkedin.svg";
import useDeviceType from "../hooks/useDeviceType";

interface TabNavigationProps {
  activeSection?: number;
  setActiveSection?: (section: number) => void;
}

// Use separate container for animation wrapper
const AnimationWrapper = styled(motion.div)`
  position: fixed;
  left: 50%;
  z-index: 100;
`;

const TabContainer = styled(motion.div)<{
  isContactSection?: boolean;
  isMobile: boolean;
}>`
  display: flex;
  gap: ${(props) => {
    if (props.isMobile) return props.isContactSection ? "24px" : "16px";
    return props.isContactSection ? "64px" : "32px";
  }};
  padding: ${(props) => {
    if (props.isMobile) return props.isContactSection ? "24px" : "12px 24px";
    return props.isContactSection ? "64px" : "16px 32px";
  }};
  border-radius: 1000px;
  border: ${(props) =>
    props.isContactSection ? "none" : "1px solid rgba(188, 188, 188, 0.5)"};
  backdrop-filter: ${(props) =>
    props.isContactSection ? "blur(7px)" : "none"};
  background: ${(props) =>
    props.isContactSection
      ? "rgba(255, 255, 255, 0.15)"
      : "rgba(255, 255, 255, 0.50)"};
  box-shadow: ${(props) =>
    props.isContactSection ? "0 4px 4px rgba(31, 38, 135, 0.1)" : "none"};
`;

const IconContainer = styled(motion.a)<{
  isContactSection?: boolean;
  isMobile: boolean;
}>`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: scale(1.05)
      translateY(
        ${(props) => {
          if (props.isMobile) return props.isContactSection ? "-10px" : "-8px";
          return props.isContactSection ? "-15px" : "-12px";
        }}
      );
  }

  img {
    width: 24px;
    height: 24px;
    transition: all 0.3s ease;
  }
`;

const TabNavigation: React.FC<TabNavigationProps> = ({ activeSection = 0 }) => {
  // Use the existing device type hook
  const { isMobile } = useDeviceType();

  // Check if we're on the Contact section
  const isContactSection = activeSection === 3;

  // Email address
  const emailAddress = "cristian.scaratti00@gmail.com";

  // Fixed icon size
  const iconSize = isMobile
    ? isContactSection
      ? 24
      : 20
    : isContactSection
    ? 64
    : 24;

  return (
    <LayoutGroup>
      <AnimationWrapper
        initial={{
          bottom: "32px",
          top: "auto",
          transform: "translateX(-50%)",
        }}
        animate={
          isContactSection
            ? {
                bottom: "auto",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }
            : {
                bottom: isMobile ? "16px" : "32px",
                top: "auto",
                transform: "translateX(-50%)",
              }
        }
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}>
        <TabContainer
          isContactSection={isContactSection}
          isMobile={isMobile}
          layout
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            opacity: { duration: 0.2 },
            layout: { duration: 0.4, ease: "easeInOut" },
          }}>
          <AnimatePresence mode="sync">
            {[mail, linkedin, threads, github].map((icon, index) => (
              <IconContainer
                key={index}
                isContactSection={isContactSection}
                isMobile={isMobile}
                href={
                  index === 0
                    ? `mailto:${emailAddress}?subject=Contatto dal Portfolio`
                    : index === 1
                    ? "https://www.linkedin.com/in/cristian-scaratti-22120b157/"
                    : index === 2
                    ? "https://www.threads.net/@cristian_scaratti?igshid=NTc4MTIwNjQ2YQ=="
                    : "https://github.com/Scara00/Portfolio"
                }
                target={index !== 0 ? "_blank" : undefined}
                rel={index !== 0 ? "noopener noreferrer" : undefined}
                aria-label={
                  index === 0
                    ? "Email"
                    : index === 1
                    ? "LinkedIn"
                    : index === 2
                    ? "Threads"
                    : "GitHub"
                }
                layout
                animate={{
                  width: iconSize,
                  height: iconSize,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  delay: index * 0.05,
                }}>
                <motion.img
                  src={icon}
                  alt={
                    index === 0
                      ? "Email"
                      : index === 1
                      ? "LinkedIn"
                      : index === 2
                      ? "Threads"
                      : "GitHub"
                  }
                  animate={{
                    width: iconSize,
                    height: iconSize,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    delay: index * 0.05,
                  }}
                />
              </IconContainer>
            ))}
          </AnimatePresence>
        </TabContainer>
      </AnimationWrapper>
    </LayoutGroup>
  );
};

export default TabNavigation;
