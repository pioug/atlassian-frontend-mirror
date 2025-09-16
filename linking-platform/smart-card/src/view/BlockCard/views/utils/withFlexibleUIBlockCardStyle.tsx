/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { type FlexibleBlockCardProps } from '../types';

const flexibleBlockCardStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > div': {
		borderRadius: token('radius.large', '8px'),
		border: `${token('border.width')} solid ${token('color.border', N40)}`,
	},
});

export const withFlexibleUIBlockCardStyle =
	(FlexibleBlockCardView: React.ComponentType<FlexibleBlockCardProps>) =>
	(props: FlexibleBlockCardProps) => {
		return (
			<div css={flexibleBlockCardStyle}>
				<FlexibleBlockCardView {...props} />
			</div>
		);
	};
