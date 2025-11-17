/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ComponentPropsWithRef, forwardRef } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Pressable } from '@atlaskit/primitives/compiled';
import { expVal } from '@atlaskit/tmp-editor-statsig/expVal';
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
		wordBreak: 'break-all',
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

const experimentEnabledStyles = cssMap({
	control: {
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
	test1: {
		// This will be renamed to 'unauthorised' once the experiment gate can be cleaned up
		color: token('color.text.inverse'),
		cursor: 'pointer',
		backgroundColor: token('color.background.selected.bold'),
		'&:hover': {
			backgroundColor: token('color.background.selected.bold.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.selected.bold.pressed'),
		},
		borderTopRightRadius: token('radius.xsmall'),
		borderBottomRightRadius: token('radius.xsmall'),
		borderTopLeftRadius: token('radius.xsmall'),
		borderBottomLeftRadius: token('radius.xsmall'),
		// The following style rules are ignored by https://atlassian.slack.com/archives/C09A7MGD4R2/p1762172701565049?thread_ts=1761943025.332209&cid=C09A7MGD4R2
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		paddingTop: '1px' as any,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		paddingBottom: '1px' as any,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		marginRight: '1px' as any,
		fontWeight: token('font.weight.regular'),
	},
	test2: {
		color: token('color.text.inverse'),
		cursor: 'pointer',
		backgroundColor: token('color.background.accent.gray.bolder'),
		'&:hover': {
			backgroundColor: token('color.background.accent.gray.bolder.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.accent.gray.bolder.pressed'),
		},
		borderTopRightRadius: token('radius.xsmall'),
		borderBottomRightRadius: token('radius.xsmall'),
	},
});

type ActionButtonProps = ComponentPropsWithRef<typeof Pressable> & {
	viewType?: 'default' | 'unauthorised';
};

/**
 * Action button has to be a span for the overflow to work correctly
 */
export const ActionButton = forwardRef(
	(
		{ children, isDisabled, viewType = 'default', ...props }: ActionButtonProps,
		ref: ActionButtonProps['ref'],
	) => {
		const experimentValue =
			viewType === 'unauthorised'
				? expVal('platform_inline_smartcard_connect_button_exp', 'cohort', 'control')
				: 'control';

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
					css={[
						styles.innerContainer,
						isDisabled
							? styles.disabled
							: experimentValue !== 'control'
								? experimentEnabledStyles[experimentValue]
								: styles.enabled,
					]}
					tabIndex={isDisabled ? undefined : 0}
				>
					{children}
				</span>
			</Pressable>
		);
	},
);
