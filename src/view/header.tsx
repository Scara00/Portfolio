import React from "react";
import styled from "styled-components";

// Styled-components
const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 40px;
  color: white;
`;
const Circle = styled.div`
  height: 32px;
  width: 32px;
  border-radius: 50px;
  background-color: #4763fe;
`;

const ContainerLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

// Header Component
const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <ContainerLogo>
        <Circle></Circle>
        <div className="text-regular" color="#2d3041">
          cristian
        </div>
      </ContainerLogo>
    </HeaderContainer>
  );
};

export default Header;
