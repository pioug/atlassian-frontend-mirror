// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { borderRadius } from '@atlaskit/theme/constants';
import { getDimensionsWithDefault } from '../utils/lightCards/getDimensionsWithDefault';
import { type InlinePlayerWrapperProps } from './types';
import {
	getSelectionStyles,
	SelectionStyle,
	hideNativeBrowserTextSelectionStyles,
} from '@atlaskit/editor-shared-styles/selection';

/*
 * Used to display the blue border around a selected card without
 * shrinking the image OR growing the card size
 */
const getSelectedBorderStyle = ({ selected }: { selected?: boolean }) => `
    ${selected ? hideNativeBrowserTextSelectionStyles : ''}

    &::after {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      box-sizing: border-box;
      pointer-events: none;
      ${borderRadius}
      ${selected ? getSelectionStyles([SelectionStyle.Border]) : ''}
    }
  `;

export const inlinePlayerClassName = 'media-card-inline-player';

export const inlinePlayerWrapperStyles = ({
	dimensions,
	selected,
}: // eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
InlinePlayerWrapperProps) => css`
	width: ${getDimensionsWithDefault(dimensions).width || '100%'};
	height: ${getDimensionsWithDefault(dimensions).height || 'auto'};
	overflow: hidden;
	border-radius: ${borderRadius()}px;
	position: relative;
	max-width: 100%;
	max-height: 100%;

	${getSelectedBorderStyle(selected)}

	video {
		width: 100%;
		height: 100%;
	}
`;

inlinePlayerWrapperStyles.displayName = 'InlinePlayerWrapper';
