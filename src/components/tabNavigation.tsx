import styled from "styled-components";
import mail from "../assets/mail.svg";
import threads from "../assets/treaths.svg";
import github from "../assets/github.svg";
import linkedin from "../assets/linkedin.svg";

const Container = styled.div`
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 32px;
  border-radius: 1000px;
  gap: 32px;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid #bcbcbc;
  z-index: 1000;
`;

// Aggiornato a un elemento <a> invece di <img> per le icone
const IconContainer = styled.a`
  height: 24px;
  width: 24px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.05) translateY(-12px);
  }

  img {
    height: 24px;
    width: 24px;
  }
`;

const TabNavigation = () => {
  // Inserisci qui il tuo indirizzo email
  const emailAddress = "cristian.scaratti00@gmail.com";

  return (
    <Container>
      <IconContainer
        href={`mailto:${emailAddress}?subject=Contatto dal Portfolio`}
        aria-label="Email">
        <img src={mail} alt="Email" />
      </IconContainer>

      <IconContainer
        href="https://www.linkedin.com/in/cristian-scaratti-22120b157/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn">
        <img src={linkedin} alt="LinkedIn" />
      </IconContainer>

      <IconContainer
        href="https://www.threads.net/@cristian_scaratti?igshid=NTc4MTIwNjQ2YQ=="
        target="_blank"
        rel="noopener noreferrer"
        aria-label="threads">
        <img src={threads} alt="Threads" />
      </IconContainer>

      <IconContainer
        href="https://github.com/yourusername"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub">
        <img src={github} alt="GitHub" />
      </IconContainer>
    </Container>
  );
};

export default TabNavigation;
