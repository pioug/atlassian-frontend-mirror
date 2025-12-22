import React from 'react';

import { IntlProvider } from 'react-intl-next';
// eslint-disable-next-line @atlassian/relay/use-single-relay-environment
import { graphql, RelayEnvironmentProvider, useLazyLoadQuery } from 'react-relay';
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils';

import { RovoAgentSelector } from '../src';
import { generateMockAgentEdges } from '../src/common/utils/generate-mock-agent-edges';
import type { AgentOption } from '../src/ui/rovo-agent-selector/types';

import type { selectedRovoAgentSelectorQuery } from './__generated__/selectedRovoAgentSelectorQuery.graphql';

const TestRenderer = () => {
	const data = useLazyLoadQuery<selectedRovoAgentSelectorQuery>(
		graphql`
			query selectedRovoAgentSelectorQuery($cloudIdString: String!) {
				# eslint-disable-next-line @atlassian/relay/must-colocate-fragment-spreads
				...rovoAgentSelector_AtlaskitRovoAgentSelector @arguments(cloudIdString: $cloudIdString)
			}
		`,
		{
			cloudIdString: 'mock-cloud-id',
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
