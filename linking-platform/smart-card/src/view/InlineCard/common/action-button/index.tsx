/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ComponentPropsWithRef, forwardRef } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	button: {
		display: 'contents',
	},
	innerContainer: {
		display: 'inline',
		backgroundClip: 'padding-box',
		boxDecorationBreak: 'clone',
		fontWeight: token('font.weight.medium'),
		paddingLeft: token('space.075'),
		paddingTop: token('space.025'),
		paddingBottom: token('space.025'),
		paddingRight: token('space.075'),
		textAlign: 'initial',
		whiteSpace: 'break-spaces',
		wordBreak: 'break-word',
	},
	enabled: {
		color: token('color.text'),
		cursor: 'pointer',
		backgroundColor: token('color.background.neutral'),
		'&:hover': {
			backgroundColor: token('color.background.neutral.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.pressed'),
		},
	},
	disabled: {
		color: token('color.text.disabled'),
		cursor: 'not-allowed',
		backgroundColor: token('color.background.disabled'),
	},
});

type ActionButtonProps = ComponentPropsWithRef<typeof Pressable>;

/**
 * Action button has to be a span for the overflow to work correctly
 */
export const ActionButton = forwardRef(
	({ children, isDisabled, ...props }: ActionButtonProps, ref: ActionButtonProps['ref']) => {
		return (
			<Pressable
				{...props}
				isDisabled={isDisabled}
				ref={ref}
				// We need to reset Pressable fixed font size to allow inline card to inherit the font size
				// from parent component such as paragraph and heading
				style={{ font: `inherit` }}
				xcss={styles.button}
			>
				<span
					css={[styles.innerContainer, isDisabled ? styles.disabled : styles.enabled]}
					tabIndex={isDisabled ? undefined : 0}
				>
					{children}
				</span>
			</Pressable>
		);
	},
);
