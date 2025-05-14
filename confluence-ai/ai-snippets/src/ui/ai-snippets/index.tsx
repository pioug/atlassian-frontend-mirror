/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css } from '@compiled/react';

import { cssMap, cx, jsx } from '@atlaskit/css';
import { Anchor, Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { PROGRESS_BAR_TEST_ID } from './constants';
import type { AiSnippetsProps, ProgressBarProps } from './types';

const styles = cssMap({
	container: {
		marginTop: token('space.200'),
		marginRight: token('space.200'),
		marginBottom: token('space.200'),
		marginLeft: token('space.200'),
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
	selected: {
		backgroundColor: token('color.background.selected'),
		borderColor: token('color.border.selected'),
		color: token('color.text.selected'),
		'&:hover': {
			backgroundColor: token('color.background.selected.hovered'),
		},
	},
	unselected: {
		borderColor: token('color.border'),
		'&:hover': {
			backgroundColor: token('color.background.neutral.hovered'),
		},
	},
	progressBarContainer: {
		marginTop: token('space.200'),
		marginLeft: 0,
		marginRight: 0,
		marginBottom: 0,
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
		color: token('color.text'),
	},
});

const progressBarStyles = css({
	marginLeft: token('space.100'),
});

// NOTE: You can still use raw `css` from `@compiled/react` if you need to.
// In this case, we use it because `borderRadius` doesn't match our interface.
const containerWithBorder = css({
	borderStyle: 'solid',
	borderWidth: token('border.width.outline'),
	borderRadius: '8px',
});

/**
 * NOTE: A progress bar is available through `@atlaskit/progress-bar`,
 * we create our own progress bar component here for the sake of example.
 *
 * Please use `@atlaskit/progress-bar` for accessibility compliance, this is not accessible.
 */
function ProgressBar({ value }: ProgressBarProps) {
	return (
		<Box
			backgroundColor="color.background.warning"
			xcss={cx(styles.container, styles.progressBarContainer)}
		>
			<label htmlFor="progress-bar">Progress:</label>
			<progress
				id="progress-bar"
				data-testid={PROGRESS_BAR_TEST_ID}
				max="100"
				value={value}
				css={progressBarStyles}
			/>
		</Box>
	);
}

export default function AiSnippets({ isSelected, testId, width }: AiSnippetsProps) {
	return (
		<div
			style={{ width }}
			css={[
				// NOTE: While `<Box>` is preferred for consistency, if you need complexity
				// that doesn't align with the types, using a raw `<div>` is acceptable,
				// just use `@atlaskit/css` where available
				styles.container,
				containerWithBorder,
				isSelected ? styles.selected : styles.unselected,
			]}
			data-testid={testId}
		>
			<Text as="p">
				Hello world! Usually you'll be using{' '}
				<Anchor href="https://atlassian.design/components">
					Atlassian Design System components
				</Anchor>{' '}
				and{' '}
				<Anchor href="https://atlassian.design/components/primitives">
					Atlassian Design System Primitives
				</Anchor>{' '}
				to build your UI.
			</Text>
			<Text as="p">
				In the rare case that you need a bespoke solution that you can't achieve Atlassian Design
				System, you can create a custom component like the ProgressBar below.
			</Text>
			<ProgressBar value={95} />
		</div>
	);
}
