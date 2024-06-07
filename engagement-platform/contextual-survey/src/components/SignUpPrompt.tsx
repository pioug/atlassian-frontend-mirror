/** @jsx jsx */
import { useCallback, useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/custom-theme-button';
import { fontFallback } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import SuccessContainer from './SuccessContainer';

const styles = css({
	font: token('font.heading.xsmall', fontFallback.heading.xsmall),
	margin: 0,
});
interface Props {
	onAnswer: (answer: boolean) => Promise<void>;
}

type PendingAnswer = 'yes' | 'no';

type Optional<T> = T | null;

export default ({ onAnswer }: Props) => {
	const [pending, setPending] = useState<Optional<PendingAnswer>>(null);
	const answeredWith = useCallback(
		async (answer: boolean) => {
			setPending(answer ? 'yes' : 'no');
			await onAnswer(answer);
		},
		[setPending, onAnswer],
	);

	const isDisabled: boolean = Boolean(pending);

	return (
		<SuccessContainer>
			<h1 css={styles}>Thanks for your feedback</h1>
			<p>Are you interested in participating in our research?</p>
			<p>
				Sign up for the{' '}
				<a href="https://www.atlassian.com/research-group">Atlassian Research Group</a> and we may
				contact you in the future with research opportunities.
			</p>

			<div
				css={css({
					marginTop: token('space.400', '32px'),
					display: 'flex',
					justifyContent: 'flex-end',
					'& > * + *': {
						marginLeft: token('space.100', '8px'),
					},
				})}
			>
				<Button
					appearance="subtle"
					onClick={() => answeredWith(false)}
					isDisabled={isDisabled}
					isLoading={pending === 'no'}
				>
					No, thanks
				</Button>
				<Button
					appearance="primary"
					onClick={() => answeredWith(true)}
					isDisabled={isDisabled}
					isLoading={pending === 'yes'}
				>
					Yes, sign me up
				</Button>
			</div>
		</SuccessContainer>
	);
};
