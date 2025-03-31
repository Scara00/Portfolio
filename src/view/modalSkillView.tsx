import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

// Types for the component props
interface ModalSkillViewProps {
  title: string;
  description: string;
  percentageSkill: number;
}

// Skill level color constants
const SKILL_COLORS = {
  HIGH: "rgba(71, 99, 254, 1)", // Blue for high skill (>70%)
  MEDIUM: "rgba(255, 153, 0, 1)", // Orange for medium skill (40-70%)
  LOW: "rgba(255, 61, 61, 1)", // Red for low skill (<40%)
  EMPTY: "#e0e0e0", // Gray for empty dots
};

// Styled components for the modal content
const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  height: 100%;
`;

const Title = styled.h2`
  font-size: 28px;
  margin: 0;
  color: #000;
  font-weight: 600;
  text-align: left;
`;

const Description = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  margin: 0;
`;

const SkillLevelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
`;

const SkillLevelLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #555;
`;

const DotsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 0;
`;

const Dot = styled(motion.div)<{ color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  box-shadow: ${(props) =>
    props.color !== SKILL_COLORS.EMPTY
      ? `0 2px 4px ${props.color.replace("1)", "0.3)")}`
      : "none"};
`;

// Get color based on skill percentage
const getSkillColor = (percentage: number) => {
  if (percentage > 70) return SKILL_COLORS.HIGH;
  if (percentage >= 40) return SKILL_COLORS.MEDIUM;
  return SKILL_COLORS.LOW;
};

// The skill modal view component
const ModalSkillView: React.FC<ModalSkillViewProps> = ({
  title,
  description,
  percentageSkill,
}) => {
  // Calculate how many dots should be filled based on percentage
  const totalDots = 10;
  const filledDots = Math.round((percentageSkill / 100) * totalDots);

  // Get appropriate color based on the skill percentage
  const skillColor = getSkillColor(percentageSkill);

  return (
    <Container>
      <Title>{title}</Title>

      <Description>{description}</Description>

      <SkillLevelContainer>
        <SkillLevelLabel>
          <span>Proficiency</span>
          <span style={{ color: skillColor }}>{percentageSkill}%</span>
        </SkillLevelLabel>

        <DotsContainer>
          {[...Array(totalDots)].map((_, index) => (
            <Dot
              key={index}
              color={index < filledDots ? skillColor : SKILL_COLORS.EMPTY}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: index * 0.1,
                duration: 0.3,
                type: "spring",
                stiffness: 300,
              }}
            />
          ))}
        </DotsContainer>
      </SkillLevelContainer>
    </Container>
  );
};

export default ModalSkillView;
