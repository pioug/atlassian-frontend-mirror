/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { flexibleBlockCardStyle } from '../styled';
import { type FlexibleBlockCardProps } from '../types';

export const withFlexibleUIBlockCardStyle =
	(FlexibleBlockCardView: React.ComponentType<FlexibleBlockCardProps>) =>
	(props: FlexibleBlockCardProps) => {
		return (
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			<div css={flexibleBlockCardStyle}>
				<FlexibleBlockCardView {...props} />
			</div>
		);
	};
