/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';
import type { Meta } from '@storybook/react';
import { IntlProvider } from 'react-intl-next';
// eslint-disable-next-line @atlassian/relay/use-single-relay-environment
import { graphql, RelayEnvironmentProvider, useLazyLoadQuery } from 'react-relay';
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils';

import { RovoAgentSelector } from '../src';

import type { storiesRovoAgentSelectorQuery } from './__generated__/storiesRovoAgentSelectorQuery.graphql';

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
	const data = useLazyLoadQuery<storiesRovoAgentSelectorQuery>(
		graphql`
			query storiesRovoAgentSelectorQuery($cloudId: ID!, $cloudIdString: String!) {
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

function BasicTemplateComponent() {
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

export const Story = () => {
	return <BasicTemplateComponent />;
};

// Define the meta object
const meta: Meta = {
	component: RovoAgentSelector,
};

export default meta;
