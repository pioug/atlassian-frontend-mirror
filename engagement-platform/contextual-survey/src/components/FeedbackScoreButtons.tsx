/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/default/button';
import { Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip/Tooltip';

interface Props {
	onChange: (value: number) => void;
	value: number | undefined;
}

const tooltipMessage = [
	'Strongly disagree',
	'Disagree',
	'Slightly disagree',
	'Neutral',
	'Slightly agree',
	'Agree',
	'Strongly agree',
];

const buttonWrapperStyles = css({
	display: 'flex',
	justifyContent: 'space-between',
	// Only the subject is guarded, so an open inline tooltip popover can't gain the sibling margin
	// while the button after it still matches `*` and keeps its own margin. Deliberately avoids the
	// positional `nth-child(... of ...)` form here: this is a `@compiled` sheet, and Compiled's
	// dev-mode SSR analyzer logs a console error for that pseudo-class, which fails every Gemini VR
	// test that renders the survey (eg post-office message templates).
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'& > * + :not(:where([popover], dialog))': {
		marginLeft: token('space.100'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'& > *': {
		flex: 1,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > button': {
			justifyContent: 'center',
		},
	},
});

const descriptionWrapperStyles = css({
	display: 'flex',
	marginTop: token('space.100'),
	marginBottom: token('space.300'),
	justifyContent: 'space-between',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'& > span': {
		width: token('space.1000'),
	},
});

export default ({ onChange, value }: Props): React.JSX.Element => (
	<div>
		<div css={buttonWrapperStyles}>
			{Array.from({ length: 7 }, (_, i) => {
				const score = i + 1;
				const isSelected: boolean = value === score;

				return (
					<Tooltip content={tooltipMessage[i]} key={score} hideTooltipOnClick>
						<Button
							onClick={() => onChange(score)}
							isSelected={isSelected}
							aria-pressed={isSelected}
							aria-describedby="contextualSurveyStatement"
							aria-label={tooltipMessage[i]}
							shouldFitContainer
						>
							{score}
						</Button>
					</Tooltip>
				);
			})}
		</div>
		<div css={descriptionWrapperStyles} aria-hidden>
			<Text color="color.text.subtlest" size="small" weight="semibold" align="start">
				Strongly disagree
			</Text>
			<Text color="color.text.subtlest" size="small" weight="semibold" align="center">
				Neutral
			</Text>
			<Text color="color.text.subtlest" size="small" weight="semibold" align="end">
				Strongly agree
			</Text>
		</div>
	</div>
);
