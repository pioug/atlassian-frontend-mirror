/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { B300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

interface StageBarProps {
	testId?: string;
	percentageComplete: number;
}

const spacing = {
	comfortable: token('space.500', '40px'),
	cosy: token('space.200', '16px'),
	compact: token('space.050', '4px'),
};

const progressBarStyles = css({
	height: token('space.100', '8px'),
	position: 'absolute',
	backgroundColor: token('color.background.brand.bold', B300),
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
const ProgressBar = ({ percentageComplete, testId }: StageBarProps) => (
	<div
		data-testid={testId}
		style={{
			width: `calc(${percentageComplete}% + ${
				percentageComplete / 100
			} * calc(var(--ds--pt--sp, ${spacing.cosy}) + ${token('space.050', '4px')}))`,
		}}
		css={progressBarStyles}
	/>
);

export default ProgressBar;
