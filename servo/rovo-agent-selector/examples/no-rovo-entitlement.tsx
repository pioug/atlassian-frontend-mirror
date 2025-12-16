import React from 'react';

import { IntlProvider } from 'react-intl-next';
// eslint-disable-next-line @atlassian/relay/use-single-relay-environment
import { graphql, RelayEnvironmentProvider, useLazyLoadQuery } from 'react-relay';
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils';

import { RovoAgentSelector } from '../src';

import type { noRovoEntitlementRovoAgentSelectorQuery } from './__generated__/noRovoEntitlementRovoAgentSelectorQuery.graphql';

const generateMockAgentEdges = (count: number) => {
	const agents = Array.from({ length: count }, (_, i) => ({
		id: `agent-${i}`,
		name: `Agent ${i}`,
		externalConfigReference: `ref-${i}`,
		identityAccountId: `account-${i}`,
		creatorType: 'CUSTOMER' as const,
	}));

	return agents.map((node) => ({
		node,
		cursor: `cursor-${node.id}`,
	}));
};

const TestRenderer = () => {
	const data = useLazyLoadQuery<noRovoEntitlementRovoAgentSelectorQuery>(
		graphql`
			query noRovoEntitlementRovoAgentSelectorQuery($cloudId: ID!, $cloudIdString: String!) {
				# eslint-disable-next-line @atlassian/relay/must-colocate-fragment-spreads
				...rovoAgentSelector_AtlaskitRovoAgentSelector_fragmentReference
					@arguments(cloudId: $cloudId, cloudIdString: $cloudIdString)
			}
		`,
		{
			cloudId: 'mock-cloud-id',
			cloudIdString: 'mock-cloud-id',
		},
	);

	return (
		<RovoAgentSelector
			testId="rovo-agent-selector"
			fragmentReference={data}
			cloudId="mock-cloud-id"
			isFeatureEnabled
		/>
	);
};

export default function NoCreatePermission(): React.JSX.Element {
	const environment = createMockEnvironment();

	environment.mock.queueOperationResolver((operation) =>
		MockPayloadGenerator.generate(operation, {
			AgentStudioAgentsConnection: () => ({
				pageInfo: {
					hasNextPage: false,
					endCursor: null,
				},
				edges: generateMockAgentEdges(10),
			}),
			AtlassianStudioUserSiteContextOutput: () => ({
				userPermissions: {
					isAbleToCreateAgents: false,
				},
				isCustomAgentsAvailable: false,
			}),
		}),
	);

	return (
		<IntlProvider locale="en">
			<RelayEnvironmentProvider environment={environment}>
				<TestRenderer />
			</RelayEnvironmentProvider>
		</IntlProvider>
	);
}
