/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { FC, HTMLAttributes, ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';

const focusRing = `inset 0 0 0 2px ${token('color.border.focused')}`;

interface OverflowContainerProps {
	isSingleLine?: boolean;
	chilren?: ReactNode;
}

const overflowContainerStyles = css({
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

const focusRingStyles = css({
	'&:focus-within': {
		boxShadow: focusRing,
	},
});

/**
 * __Overflow container__
 */
const OverflowContainer: FC<OverflowContainerProps & HTMLAttributes<HTMLSpanElement>> = ({
	isSingleLine,
	...props
}) => {
	const shouldShowFocusRing = isSingleLine && fg('platform_dst_table_tree_single_line_focus_ring');

	return (
		<span
			css={[isSingleLine && overflowContainerStyles, shouldShowFocusRing && focusRingStyles]}
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			{...props}
		/>
	);
};

export default OverflowContainer;
