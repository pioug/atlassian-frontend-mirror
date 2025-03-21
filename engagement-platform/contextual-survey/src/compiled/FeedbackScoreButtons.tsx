/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

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
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'& > * + *': {
		marginLeft: token('space.100', '8px'),
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
	marginTop: token('space.100', '8px'),
	marginBottom: token('space.300', '24px'),
	justifyContent: 'space-between',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'& > span': {
		width: token('space.1000', '80px'),
	},
});

export default ({ onChange, value }: Props) => (
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
			<Text color="color.text.subtlest" size="UNSAFE_small" weight="semibold" align="start">
				Strongly disagree
			</Text>
			<Text color="color.text.subtlest" size="UNSAFE_small" weight="semibold" align="center">
				Neutral
			</Text>
			<Text color="color.text.subtlest" size="UNSAFE_small" weight="semibold" align="end">
				Strongly agree
			</Text>
		</div>
	</div>
);
