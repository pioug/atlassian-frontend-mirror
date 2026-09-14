import { css, type SerializedStyles } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

import { borderRadius } from '@atlaskit/media-ui/mixins';

import { rgba } from '../rgba';
import { generateResponsiveStyles } from './generateResponsiveStyles';
import { type StyledBarProps } from './types';

const height = 3;
const padding = 1;
const width = 95;

// %
const left = (100 - width) / 2;

/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
const getStyledBarStylesBasedOnProps = ({
	progress,
	breakpoint,
	positionBottom,
	showOnTop,
}: StyledBarProps) => `
${borderRadius}
overflow: hidden;
position: absolute;
width: ${width}%;
left: ${left}%;
background-color: ${rgba('#FFFFFF', 0.8)};
height: ${height + padding * 2}px;
padding: ${padding}px;
box-sizing: border-box;

::before {
  content: '';
  width: ${progress}%;
  height: 100%;
  background-color: #44546F;
  ${borderRadius}
  display: block;
}
${generateResponsiveStyles(breakpoint, positionBottom, showOnTop)}
`;

/* eslint-enable @atlaskit/design-system/ensure-design-token-usage */
export const styledBarStyles: {
	(props: StyledBarProps): SerializedStyles;
	displayName: string;
} = (props: StyledBarProps): SerializedStyles => {
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	return css(getStyledBarStylesBasedOnProps(props));
};

styledBarStyles.displayName = 'StyledProgressBar';
