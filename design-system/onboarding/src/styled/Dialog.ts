import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { multiply, divide } from '@atlaskit/theme/math';

export const FillScreen = styled.div<{ scrollDistance: number }>`
  height: 100%;
  left: 0;
  overflow-y: auto;
  position: absolute;
  top: ${p => p.scrollDistance}px;
  width: 100%;
`;

export const DialogBody = styled.div`
  flex: 1 1 auto;
  padding: ${multiply(gridSize, 2)}px ${multiply(gridSize, 3)}px ${gridSize}px;

  p:last-child,
  ul:last-child,
  ol:last-child {
    margin-bottom: 0;
  }
`;

// internal elements
export const Heading = styled.h4`
  color: inherit;
  font-size: 20px;
  font-style: inherit;
  font-weight: 500;
  letter-spacing: -0.008em;
  line-height: 1.2;
  margin-bottom: ${gridSize}px;
`;
export const Image = styled.img`
  height: auto;
  max-width: 100%;
`;

// actions
export const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 ${multiply(gridSize, 3)}px ${multiply(gridSize, 2)}px;
`;
export const ActionItems = styled.div`
  display: flex;
  margin: 0 -${divide(gridSize, 2)}px;
`;
export const ActionItem = styled.div`
  margin: 0 ${divide(gridSize, 2)}px;
`;
