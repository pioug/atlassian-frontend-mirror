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
	scoreSubtext?: Array<string>;
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
	justifyContent: 'space-between',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'& > span': {
		width: '33%',
	},
});

export default ({ onChange, value, scoreSubtext }: Props): JSX.Element => (
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
			<Text color="color.text.subtlest" size="small" weight="regular" align="start">
				 {scoreSubtext ? scoreSubtext[0] : 'Not at all'}
			</Text>
			<Text color="color.text.subtlest" size="small" weight="regular" align="center">
				{scoreSubtext ? scoreSubtext[1] : 'Neutral'}
			</Text>
			<Text color="color.text.subtlest" size="small" weight="regular" align="end">
				{scoreSubtext ? scoreSubtext[2] : 'Very much'}
			</Text>
		</div>
	</div>
);
