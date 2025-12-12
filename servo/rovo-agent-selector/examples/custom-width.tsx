import React from 'react';

import { IntlProvider } from 'react-intl-next';
import { graphql, RelayEnvironmentProvider, useLazyLoadQuery } from 'react-relay';
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';

import RovoAgentSelector from '../src';

const containerStyles = cssMap({
	container: {
		width: '400px',
	},
});

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
			query customWidthRovoAgentSelectorQuery($cloudId: String!) {
				# eslint-disable-next-line @atlassian/relay/must-colocate-fragment-spreads
				...rovoAgentSelector_AtlaskitRovoAgentSelector @arguments(cloudId: $cloudId)
			}
		`,
		{
			cloudId: 'mock-cloud-id',
		},
	);

	return (
		<Box xcss={containerStyles.container}>
			<RovoAgentSelector testId="rovo-agent-selector" fragmentReference={data} cloudId="mock-cloud-id" isFeatureEnabled />
		</Box>
	);
};

export default function CustomWidth(): React.JSX.Element {
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
