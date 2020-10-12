import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  to {
    opacity: 1;
  }
`;

export const FadeIn = styled.div`
  animation: ${fadeIn} 500ms ease forwards;
  opacity: 0;
`;
