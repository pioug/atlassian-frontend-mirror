import { token } from '@atlaskit/tokens';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { transition } from '../styles';
import { N90A } from '@atlaskit/theme/colors';

export const blanketClassName = 'media-card-blanket';

export const fixedBlanketStyles: string = `background-color: ${token('color.blanket', N90A)};`;

export const blanketStyles = (isFixed?: boolean) =>
	css(
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		transition(),
		{
			position: 'absolute',
			width: '100%',
			height: '100%',
			maxHeight: '100%',
			maxWidth: '100%',
			left: 0,
			top: 0,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		isFixed ? fixedBlanketStyles : '',
	);

blanketStyles.displayName = 'Blanket';
