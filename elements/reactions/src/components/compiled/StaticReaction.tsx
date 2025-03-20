/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	staticReaction: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'flex-start',
		minWidth: '36px',
		height: '24px',
		// backgroundColor: token('color.background.neutral.subtle'),
		color: token('color.text.subtle'),
		marginBlockStart: token('space.050'),
		marginInlineEnd: token('space.050'),
		paddingTop: token('space.0'),
		paddingRight: token('space.0'),
		paddingBottom: token('space.0'),
		paddingLeft: token('space.0'),
		overflow: 'hidden',
		border: 'none',
		borderRadius: token('border.radius'),
		'&:hover': {
			cursor: 'default',
		},
	},
});

type StaticReactionProps = {
	onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
	testId?: string;
	children?: React.ReactNode;
	dataAttributes?: { [key: string]: string };
};

export const StaticReaction = ({
	onMouseEnter,
	onFocus,
	children,
	testId,
	dataAttributes = {},
}: StaticReactionProps) => {
	return (
		<Box
			onMouseEnter={onMouseEnter}
			onFocus={onFocus}
			testId={testId}
			xcss={styles.staticReaction}
			backgroundColor="color.background.neutral.subtle"
			{...dataAttributes}
		>
			{children}
		</Box>
	);
};
