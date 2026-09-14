import { css, type SerializedStyles } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

const infoStyles = `white-space: nowrap;overflow: hidden;`;
const iconOverlapStyles = `padding-right: 10px;`;
import { type TitleBoxFooterProps } from './types';

export const titleBoxFooterStyles: {
	({ hasIconOverlap }: TitleBoxFooterProps): SerializedStyles;
	displayName: string;
} = ({ hasIconOverlap }: TitleBoxFooterProps): SerializedStyles =>
	css(
		{
			textOverflow: 'ellipsis',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		infoStyles,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		hasIconOverlap && iconOverlapStyles,
	);

titleBoxFooterStyles.displayName = 'TitleBoxFooter';
