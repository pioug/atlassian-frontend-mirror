/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/custom-theme-button';
import { Text } from '@atlaskit/primitives';
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

export default ({ onChange, value }: Props) => (
	<div>
		<div
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={css({
				display: 'flex',
				justifyContent: 'space-between',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
				'& > * + *': {
					marginLeft: token('space.100', '8px'),
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
				'& > *': {
					flex: 1,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
					'& > button': {
						justifyContent: 'center',
					},
				},
			})}
		>
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
		<div
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={css({
				display: 'flex',
				marginTop: token('space.100', '8px'),
				marginBottom: token('space.300', '24px'),
				justifyContent: 'space-between',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
				'& > span': {
					width: token('space.1000', '80px'),
				},
			})}
			aria-hidden
		>
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
