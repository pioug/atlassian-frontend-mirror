/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { type FlexibleBlockCardProps } from '../types';

import { withFlexibleUIBlockCardStyleOld } from './withFlexibleUIBlockCardStyleOld';

const flexibleBlockCardStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > div': {
		borderRadius: token('border.radius.200', '8px'),
		border: `1px solid ${token('color.border', N40)}`,
	},
});

export const withFlexibleUIBlockCardStyleNew =
	(FlexibleBlockCardView: React.ComponentType<FlexibleBlockCardProps>) =>
	(props: FlexibleBlockCardProps) => {
		return (
			<div css={flexibleBlockCardStyle}>
				<FlexibleBlockCardView {...props} />
			</div>
		);
	};

export const withFlexibleUIBlockCardStyle =
	(FlexibleBlockCardView: React.ComponentType<FlexibleBlockCardProps>) =>
	(props: FlexibleBlockCardProps) => {
		if (fg('bandicoots-compiled-migration-smartcard')) {
			return withFlexibleUIBlockCardStyleNew(FlexibleBlockCardView)(props);
		} else {
			return withFlexibleUIBlockCardStyleOld(FlexibleBlockCardView)(props);
		}
	};
