/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useCallback, useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import Link from '@atlaskit/link';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import SuccessContainer from './SuccessContainer';

interface Props {
	onAnswer: (answer: boolean) => Promise<void>;
}

type PendingAnswer = 'yes' | 'no';

type Optional<T> = T | null;

const buttonContainerStyles = css({
	marginTop: token('space.400', '32px'),
	display: 'flex',
	justifyContent: 'flex-end',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'& > * + *': {
		marginLeft: token('space.100', '8px'),
	},
});

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
						<Link href="https://www.atlassian.com/research-group" target="_blank">
							Atlassian Research Group
						</Link>{' '}
						and we may contact you in the future with research opportunities.
					</Text>
				</Stack>
			</Box>
			<div css={buttonContainerStyles}>
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
