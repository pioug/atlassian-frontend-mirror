import styled from 'styled-components';
import { hideControlsClassName } from '../classNames';

export interface ContentWrapperProps {
  controlsAreVisible: boolean;
}

const handleControlsVisibility = ({
  controlsAreVisible,
}: ContentWrapperProps) => `
  transition: opacity .3s;
  opacity: ${controlsAreVisible ? '1' : '0'};
`;

export const InactivityDetectorWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  overflow: visible;
  align-items: center;
  justify-content: center;
  position: relative;

  .${hideControlsClassName} {
    ${handleControlsVisibility};
  }
`;

InactivityDetectorWrapper.displayName = 'InactivityDetectorWrapper';
