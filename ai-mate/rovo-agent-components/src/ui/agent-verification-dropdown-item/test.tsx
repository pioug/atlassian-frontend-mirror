import React from 'react';

import { IntlProvider } from 'react-intl-next';
import { graphql, RelayEnvironmentProvider, useLazyLoadQuery } from 'react-relay';
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils';

import { FlagsProvider } from '@atlaskit/flag';
import { act, render, screen, userEvent } from '@atlassian/testing-library';

import type { testAgentVerificationDropdownItemQuery } from './__generated__/testAgentVerificationDropdownItemQuery.graphql';

import { AgentVerificationDropdownItem } from './index';

type RenderProps = {
	isAbleToGovernAgents?: boolean;
	isVerified?: boolean;
	onClick?: () => void;
	testId?: string;
};

const TestWrapper = (props: RenderProps) => {
	const data = useLazyLoadQuery<testAgentVerificationDropdownItemQuery>(
		graphql`
			query testAgentVerificationDropdownItemQuery @relay_test_operation {
				agentStudio_agentById(id: "test-agent-id") @required(action: THROW) {
					... on AgentStudioAssistant {
						...agentVerificationDropdownItem_AtlaskitRovoAgentComponents_agentRef
					}
				}
				atlassianStudio_userSiteContext(cloudId: "test-cloud-id") {
					... on AtlassianStudioUserSiteContextOutput {
						userPermissions {
							...agentVerificationDropdownItem_AtlaskitRovoAgentComponents_userPermissionsRef
						}
					}
				}
			}
		`,
		{},
	);

	return (
		<div role="menu">
			<AgentVerificationDropdownItem
				agentId="test-agent-id"
				agentRef={data.agentStudio_agentById}
				userPermissionsRef={data.atlassianStudio_userSiteContext?.userPermissions ?? null}
				onClick={props.onClick}
				testId={props.testId}
			/>
		</div>
	);
};

const renderComponent = (props: RenderProps = {}) => {
	const environment = createMockEnvironment();

	environment.mock.queueOperationResolver((operation) =>
		MockPayloadGenerator.generate(operation, {
			AgentStudioAssistant: () => ({
				isVerified: props.isVerified ?? false,
			}),
			AtlassianStudioUserSiteContextOutput: () => ({
				userPermissions: {
					isAbleToGovernAgents: props.isAbleToGovernAgents ?? false,
				},
			}),
		}),
	);

	const result = render(
		<RelayEnvironmentProvider environment={environment}>
			<IntlProvider locale="en">
				<FlagsProvider>
					<TestWrapper {...props} />
				</FlagsProvider>
			</IntlProvider>
		</RelayEnvironmentProvider>,
	);

	return { ...result, environment };
};

describe('AgentVerificationDropdownItem', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should not render when isAbleToGovernAgents is false', () => {
		renderComponent({ isAbleToGovernAgents: false, isVerified: false });

		expect(screen.queryByRole('menuitem', { name: 'Verify agent' })).toBeNull();
		expect(screen.queryByRole('menuitem', { name: 'Unverify agent' })).toBeNull();
	});

	it('should show "Verify agent" when agent is not verified', () => {
		renderComponent({ isAbleToGovernAgents: true, isVerified: false });

		expect(screen.getByRole('menuitem', { name: 'Verify agent' })).toBeVisible();
		expect(screen.queryByRole('menuitem', { name: 'Unverify agent' })).toBeNull();
	});

	it('should show "Unverify agent" when agent is verified', () => {
		renderComponent({ isAbleToGovernAgents: true, isVerified: true });

		expect(screen.getByRole('menuitem', { name: 'Unverify agent' })).toBeVisible();
		expect(screen.queryByRole('menuitem', { name: 'Verify agent' })).toBeNull();
	});

	it('should call mutation with verified=true when clicking verify agent', async () => {
		const user = userEvent.setup();
		const { environment } = renderComponent({
			isAbleToGovernAgents: true,
			isVerified: false,
		});

		await user.click(screen.getByRole('menuitem', { name: 'Verify agent' }));

		const mutation = environment.mock.getMostRecentOperation();
		expect(mutation.request.node.operation.name).toBe(
			'agentVerificationDropdownItem_AtlaskitRovoAgentComponents_updateAgentVerificationMutation',
		);
		expect(mutation.request.variables).toEqual({
			id: 'test-agent-id',
			verified: true,
		});
	});

	it('should call mutation with verified=false when clicking unverify agent', async () => {
		const user = userEvent.setup();
		const { environment } = renderComponent({
			isAbleToGovernAgents: true,
			isVerified: true,
		});

		await user.click(screen.getByRole('menuitem', { name: 'Unverify agent' }));

		const mutation = environment.mock.getMostRecentOperation();
		expect(mutation.request.node.operation.name).toBe(
			'agentVerificationDropdownItem_AtlaskitRovoAgentComponents_updateAgentVerificationMutation',
		);
		expect(mutation.request.variables).toEqual({
			id: 'test-agent-id',
			verified: false,
		});
	});

	it('should show success flag when mutation succeeds', async () => {
		const user = userEvent.setup();
		const { environment } = renderComponent({
			isAbleToGovernAgents: true,
			isVerified: false,
		});

		await user.click(screen.getByRole('menuitem', { name: 'Verify agent' }));

		act(() => {
			environment.mock.resolveMostRecentOperation((operation) =>
				MockPayloadGenerator.generate(operation, {
					AgentStudioUpdateAgentVerificationPayload: () => ({
						success: true,
						errors: null,
						agent: {
							id: 'test-agent-id',
							isVerified: true,
						},
					}),
				}),
			);
		});

		expect(await screen.findByRole('alert')).toHaveTextContent(/Agent verified/);
	});

	it('should show error flag when mutation fails with errors', async () => {
		const user = userEvent.setup();
		const { environment } = renderComponent({
			isAbleToGovernAgents: true,
			isVerified: false,
		});

		await user.click(screen.getByRole('menuitem', { name: 'Verify agent' }));

		act(() => {
			environment.mock.rejectMostRecentOperation(new Error('Test error message'));
		});

		expect(await screen.findByRole('alert')).toHaveTextContent(/Failed to verify agent/);
	});

	it('should be accessible', async () => {
		const { container } = renderComponent({
			isAbleToGovernAgents: true,
			isVerified: false,
		});

		await expect(container).toBeAccessible();
	});
});
