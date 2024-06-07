/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/custom-theme-button';
import { N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

const styles = css({
	textAlign: 'right',
});
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
			css={css({
				display: 'flex',
				justifyContent: 'space-between',
				'& > * + *': {
					marginLeft: token('space.100', '8px'),
				},
				'& > *': {
					flex: 1,
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
			css={css({
				fontSize: '12px',
				fontWeight: 600,
				color: token('color.text.subtlest', N200),
				display: 'flex',
				marginTop: token('space.100', '8px'),
				marginBottom: token('space.300', '24px'),
				'& > span': {
					width: token('space.1000', '80px'),
				},
			})}
			aria-hidden
		>
			<span>Strongly disagree</span>
			<span
				css={css({
					textAlign: 'center',
					margin: '0 auto',
					padding: `0 ${token('space.600', '48px')}`,
				})}
			>
				Neutral
			</span>
			<span css={styles}>Strongly agree</span>
		</div>
	</div>
);
