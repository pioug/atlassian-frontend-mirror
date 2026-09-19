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

const BARE_ACCOUNT_ID = '712020:8d6e9209-f36c-4be0-8477-1fe88ea1bd22';
const IDENTITY_ACCOUNT_ARI = `ari:cloud:identity::user/${BARE_ACCOUNT_ID}`;
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

const renderAvatarWithoutFallback = (
	agentIdentityAccountId?: string | null,
	environment: MockEnvironment = createMockEnvironment(),
) =>
	render(
		<RelayEnvironmentProvider environment={environment}>
			<IntlProvider locale="en">
				<ResolvedAgentAvatar
					agentIdentityAccountId={agentIdentityAccountId}
					agentName="Research Agent"
					size="small"
				/>
			</IntlProvider>
		</RelayEnvironmentProvider>,
	);

const renderAvatarWithBorder = (environment: MockEnvironment = createMockEnvironment()) =>
	render(
		<RelayEnvironmentProvider environment={environment}>
			<IntlProvider locale="en">
				<ResolvedAgentAvatar
					agentIdentityAccountId={IDENTITY_ACCOUNT_ARI}
					fallback={fallback}
					showBorder
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

	it('renders the fallback when the account id is empty', () => {
		renderAvatar('   ');

		expect(screen.getByTestId(FALLBACK_TESTID)).toBeInTheDocument();
	});

	it('renders the real account picture once the fetch resolves', async () => {
		const environment = createMockEnvironment();
		renderAvatar(IDENTITY_ACCOUNT_ARI, environment);

		expect(environment.mock.getMostRecentOperation().request.variables.accountId).toBe(
			BARE_ACCOUNT_ID,
		);

		await act(async () => {
			environment.mock.resolveMostRecentOperation((op) => MockPayloadGenerator.generate(op));
		});

		expect(screen.getByRole('img')).toBeInTheDocument();
		expect(screen.queryByTestId(FALLBACK_TESTID)).not.toBeInTheDocument();
	});

	it('fetches using a bare account id, without requiring the ARI wrapper', async () => {
		const environment = createMockEnvironment();
		renderAvatar(BARE_ACCOUNT_ID, environment);

		expect(environment.mock.getMostRecentOperation().request.variables.accountId).toBe(
			BARE_ACCOUNT_ID,
		);

		await act(async () => {
			environment.mock.resolveMostRecentOperation((op) => MockPayloadGenerator.generate(op));
		});

		expect(screen.getByRole('img')).toBeInTheDocument();
		expect(screen.queryByTestId(FALLBACK_TESTID)).not.toBeInTheDocument();
	});

	it('does not wrap the resolved avatar with a background by default', async () => {
		const environment = createMockEnvironment();
		renderAvatar(IDENTITY_ACCOUNT_ARI, environment);

		await act(async () => {
			environment.mock.resolveMostRecentOperation((op) => MockPayloadGenerator.generate(op));
		});

		expect(screen.queryByTestId('resolved-agent-avatar-border')).not.toBeInTheDocument();
	});

	it('renders the picture without Avatar’s own hexagon border ring by default', async () => {
		const environment = createMockEnvironment();
		const { container } = renderAvatar(IDENTITY_ACCOUNT_ARI, environment);

		await act(async () => {
			environment.mock.resolveMostRecentOperation((op) => MockPayloadGenerator.generate(op));
		});

		const hexagonContainer = container.querySelector('[style*="--avatar-box-shadow"]');
		expect(hexagonContainer).toHaveStyle({ '--avatar-box-shadow': '0 0 0 2px transparent' });
	});

	it('wraps the resolved avatar with a background when showBorder is set', async () => {
		const environment = createMockEnvironment();
		renderAvatarWithBorder(environment);

		await act(async () => {
			environment.mock.resolveMostRecentOperation((op) => MockPayloadGenerator.generate(op));
		});

		expect(screen.getByTestId('resolved-agent-avatar-border')).toBeInTheDocument();
	});

	it('renders the fallback when the fetch errors', async () => {
		const environment = createMockEnvironment();
		renderAvatar(IDENTITY_ACCOUNT_ARI, environment);

		await act(async () => {
			environment.mock.rejectMostRecentOperation(new Error('network error'));
		});

		expect(screen.getByTestId(FALLBACK_TESTID)).toBeInTheDocument();
	});

	it('renders a generic hexagon avatar built from the name when there is no id to resolve and no fallback is supplied', () => {
		renderAvatarWithoutFallback(undefined);

		expect(screen.getByRole('img')).toHaveAccessibleName('Research Agent');
	});

	it('renders the same generic avatar fallback when the fetch errors and no fallback is supplied', async () => {
		const environment = createMockEnvironment();
		renderAvatarWithoutFallback(IDENTITY_ACCOUNT_ARI, environment);

		await act(async () => {
			environment.mock.rejectMostRecentOperation(new Error('network error'));
		});

		expect(screen.getByRole('img')).toHaveAccessibleName('Research Agent');
	});
});
