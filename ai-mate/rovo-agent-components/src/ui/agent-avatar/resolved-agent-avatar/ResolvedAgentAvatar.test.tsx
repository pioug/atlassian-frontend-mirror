import React from 'react';

import { IntlProvider } from 'react-intl';
import { RelayEnvironmentProvider } from 'react-relay';
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils';
import type { MockEnvironment } from 'relay-test-utils';

import { Text } from '@atlaskit/primitives/compiled';
import { act } from '@atlassian/testing-library/act';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { ResolvedAgentAvatar } from './ResolvedAgentAvatar';

const IDENTITY_ACCOUNT_ARI = 'ari:cloud:identity::user/712020:8d6e9209-f36c-4be0-8477-1fe88ea1bd22';
const FALLBACK_TESTID = 'resolved-agent-avatar-fallback';
const fallback = (
	<Text as="span" testId={FALLBACK_TESTID}>
		fallback
	</Text>
);

const renderAvatar = (
	agentIdentityAccountId?: string | null,
	environment: MockEnvironment = createMockEnvironment(),
) =>
	render(
		<RelayEnvironmentProvider environment={environment}>
			<IntlProvider locale="en">
				<ResolvedAgentAvatar
					agentIdentityAccountId={agentIdentityAccountId}
					fallback={fallback}
					size="small"
				/>
			</IntlProvider>
		</RelayEnvironmentProvider>,
	);

describe('ResolvedAgentAvatar', () => {
	beforeEach(() => {
		expect.hasAssertions();
	});

	it('renders the fallback when there is no account id at all', () => {
		renderAvatar(undefined);

		expect(screen.getByTestId(FALLBACK_TESTID)).toBeInTheDocument();
	});

	it('renders the fallback when the account id ARI cannot be parsed', () => {
		renderAvatar('not-an-ari');

		expect(screen.getByTestId(FALLBACK_TESTID)).toBeInTheDocument();
	});

	it('renders the real account picture once the fetch resolves', async () => {
		const environment = createMockEnvironment();
		renderAvatar(IDENTITY_ACCOUNT_ARI, environment);

		await act(async () => {
			environment.mock.resolveMostRecentOperation((op) => MockPayloadGenerator.generate(op));
		});

		expect(screen.getByRole('img')).toBeInTheDocument();
		expect(screen.queryByTestId(FALLBACK_TESTID)).not.toBeInTheDocument();
	});

	it('renders the fallback when the fetch errors', async () => {
		const environment = createMockEnvironment();
		renderAvatar(IDENTITY_ACCOUNT_ARI, environment);

		await act(async () => {
			environment.mock.rejectMostRecentOperation(new Error('network error'));
		});

		expect(screen.getByTestId(FALLBACK_TESTID)).toBeInTheDocument();
	});
});
