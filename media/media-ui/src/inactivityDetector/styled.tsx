import styled from '@emotion/styled';
import { hideControlsClassName } from '../classNames';

export interface ContentWrapperProps {
	controlsAreVisible: boolean;
}

const handleControlsVisibility = ({ controlsAreVisible }: ContentWrapperProps) => `
  transition: opacity .3s;
  opacity: ${controlsAreVisible ? '1' : '0'};
`;

// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
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
