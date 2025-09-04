/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { Pressable } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	staticReaction: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'flex-start',
		minWidth: '36px',
		height: '24px',
		backgroundColor: token('color.background.neutral.subtle'),
		color: token('color.text.subtle'),
		marginBlockStart: token('space.050'),
		marginInlineEnd: token('space.050'),
		paddingTop: token('space.0'),
		paddingRight: token('space.0'),
		paddingBottom: token('space.0'),
		paddingLeft: token('space.0'),
		overflow: 'hidden',
		border: 'none',
		borderRadius: token('radius.small'),
		'&:hover': {
			cursor: 'default',
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},
	},
});

type StaticReactionProps = {
	children?: React.ReactNode;
	dataAttributes?: { [key: string]: string };
	onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
	onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	testId?: string;
};

export const StaticReaction = ({
	onMouseEnter,
	onFocus,
	children,
	testId,
	dataAttributes = {},
}: StaticReactionProps) => {
	return (
		<Pressable
			onMouseEnter={onMouseEnter}
			onFocus={onFocus}
			testId={testId}
			xcss={styles.staticReaction}
			{...dataAttributes}
		>
			{children}
		</Pressable>
	);
};
