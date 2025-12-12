import React from 'react';

import { IntlProvider } from 'react-intl-next';
import { graphql, RelayEnvironmentProvider, useLazyLoadQuery } from 'react-relay';
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils';

import RovoAgentSelector from '../src';
import type { AgentOption } from '../src/ui/rovo-agent-selector/types';

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
	const data = useLazyLoadQuery<any>(
		graphql`
			query selectedRovoAgentSelectorQuery($cloudId: String!) {
				# eslint-disable-next-line @atlassian/relay/must-colocate-fragment-spreads
				...rovoAgentSelector_AtlaskitRovoAgentSelector @arguments(cloudId: $cloudId)
			}
		`,
		{
			cloudId: 'mock-cloud-id',
		},
	);

	const selectedAgent: AgentOption = {
		label: 'Agent 0',
		value: 'agent-0',
		externalConfigReference: 'ref-0',
		identityAccountId: 'account-0',
		isForgeAgent: false,
	};

	return (
		<RovoAgentSelector
			testId="rovo-agent-selector"
			fragmentReference={data}
			cloudId="mock-cloud-id"
			selectedAgent={selectedAgent}
			isFeatureEnabled
		/>
	);
};

export default function Selected(): React.JSX.Element {
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
