import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
`;

export const ContentsContainer = styled.div`
  pointer-events: none;
  opacity: ${(p: { contentsOpacity: number }) => p.contentsOpacity};
`;

export const SpinnerContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
