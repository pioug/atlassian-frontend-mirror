import styled, { keyframes } from 'styled-components';
import { maxWidth, maxWidthUnitless } from '../constants';

interface RemoveProps {
  isRemoved: boolean;
  isRemoving: boolean;
}

const removeAnimation = keyframes`
  0% {
    animation-timing-function: cubic-bezier(0.23830050393398, 0, 0.25586732616931, 0.79011192334632);
    max-width: ${maxWidth};
  }
  20% {
    animation-timing-function: cubic-bezier(0.21787238302442, 0.98324004924648, 0.58694150667646, 1);
    max-width: ${maxWidthUnitless * 0.8}px;
  }
  100% { max-width: 0; }
`;

export default styled.div<RemoveProps>`
  box-sizing: border-box;
  display: inline-block;

  ${({ isRemoving }) =>
    isRemoving
      ? `animation: ${removeAnimation} 250ms forwards; will-change: width;`
      : null}

  ${({ isRemoved }) => (isRemoved ? 'width: 0; visibility: hidden;' : null)};
`;
