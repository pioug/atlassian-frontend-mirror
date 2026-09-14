import { css, type SerializedStyles } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

import { token } from '@atlaskit/tokens';

const infoStyles = `white-space: nowrap;overflow: hidden;`;
const iconOverlapStyles = `padding-right: 10px;`;
import { type TitleBoxHeaderProps } from './types';

export const titleBoxHeaderStyles: {
	({ hasIconOverlap }: TitleBoxHeaderProps): SerializedStyles;
	displayName: string;
} = ({ hasIconOverlap }: TitleBoxHeaderProps): SerializedStyles =>
	css(
		{
			fontWeight: token('font.weight.semibold'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		infoStyles,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		hasIconOverlap && iconOverlapStyles,
	);

titleBoxHeaderStyles.displayName = 'FailedTitleBoxHeader';
