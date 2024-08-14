/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/custom-theme-button';
import Heading from '@atlaskit/heading';
import { Box, Stack, Text } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import SuccessContainer from './SuccessContainer';

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
			<Heading size="xsmall">Thanks for your feedback</Heading>
			<Box paddingBlockStart="space.150">
				<Stack space="space.150">
					<Text as="p">Are you interested in participating in our research?</Text>
					<Text as="p">
						Sign up for the{' '}
						<a href="https://www.atlassian.com/research-group">Atlassian Research Group</a> and we
						may contact you in the future with research opportunities.
					</Text>
				</Stack>
			</Box>
			<div
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				css={css({
					marginTop: token('space.400', '32px'),
					display: 'flex',
					justifyContent: 'flex-end',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
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
