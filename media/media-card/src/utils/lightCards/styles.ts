import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { center, borderRadius } from '@atlaskit/media-ui';
import { N20, N50 } from '@atlaskit/theme/colors';
import { type WrapperProps } from './types';

export const wrapperStyles = ({ dimensions }: WrapperProps) =>
	css(
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		center,
		{
			background: token('color.background.neutral', N20),
			color: token('color.icon', N50),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		borderRadius,
		{
			maxHeight: '100%',
			maxWidth: '100%',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			width: dimensions.width,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			height: dimensions.height,
		},
	);
