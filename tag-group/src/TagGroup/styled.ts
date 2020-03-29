import styled from 'styled-components';

export const Container = styled.div<{ justify: 'start' | 'end' }>`
  display: flex;
  flex-wrap: wrap;
  justify-content: ${({ justify }) => `flex-${justify}`};
  width: 100%;
`;
