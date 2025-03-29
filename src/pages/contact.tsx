import React from "react";
import styled from "styled-components";
import useDeviceType from "../hooks/useDeviceType";

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

const Contact: React.FC = () => {
  const { isMobile, isTablet } = useDeviceType();

  return (
    <>
      <TextName
        className="agera-mono"
        style={{ fontSize: isMobile ? "70px" : isTablet ? "150px" : "280px" }}>
        LET'S KEEP IN TOUCH
      </TextName>
      {/* Add your contact content here */}
    </>
  );
};

export default Contact;
