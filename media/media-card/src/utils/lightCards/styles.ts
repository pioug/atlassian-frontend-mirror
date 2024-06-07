import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { center, borderRadius } from '@atlaskit/media-ui';
import { N20, N50 } from '@atlaskit/theme/colors';
import { type WrapperProps } from './types';

export const wrapperStyles = ({ dimensions }: WrapperProps) =>
	css(
		center,
		{
			background: token('color.background.neutral', N20),
			color: token('color.icon', N50),
		},
		borderRadius,
		{
			maxHeight: '100%',
			maxWidth: '100%',
			width: dimensions.width,
			height: dimensions.height,
		},
	);
