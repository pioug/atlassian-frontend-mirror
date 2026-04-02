/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

interface StageBarProps {
	testId?: string;
	percentageComplete: number;
}

const spacing = {
	comfortable: token('space.500'),
	cosy: token('space.200'),
	compact: token('space.050'),
};

const progressBarStyles = css({
	height: token('space.100'),
	position: 'absolute',
	backgroundColor: token('color.background.brand.bold'),
	borderEndEndRadius: token('radius.full', '8px'),
	borderStartEndRadius: token('radius.full', '8px'),
	insetInlineStart: '50%',
	transform: `translate(0, calc(-1 * ${token('space.250')}))`,
	transition: `width var(--ds--pt--ts) var(--ds--pt--te)`,
	transitionDelay: `var(--ds--pt--td)`,
});

/**
 * __Progress bar__
 *
 * A progress bar describes the horizontal tracking bar that traverses each individual step.
 *
 */
const ProgressBar: ({ percentageComplete, testId }: StageBarProps) => JSX.Element = ({
	percentageComplete,
	testId,
}: StageBarProps) => (
	<div
		data-testid={testId}
		style={{
			width: `calc(${percentageComplete}% + ${
				percentageComplete / 100
			} * calc(var(--ds--pt--sp, ${spacing.cosy}) + ${token('space.050')}))`,
		}}
		css={progressBarStyles}
	/>
);

export default ProgressBar;
