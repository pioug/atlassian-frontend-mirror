import React from 'react';

import { IntlProvider } from 'react-intl-next';
// eslint-disable-next-line @atlassian/relay/use-single-relay-environment
import { graphql, RelayEnvironmentProvider, useLazyLoadQuery } from 'react-relay';
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils';

import { RovoAgentSelector } from '../src';
import { generateMockAgentEdges } from '../src/common/utils/generate-mock-agent-edges';

import type { basicRovoAgentSelectorQuery } from './__generated__/basicRovoAgentSelectorQuery.graphql';

const TestRenderer = () => {
	const data = useLazyLoadQuery<basicRovoAgentSelectorQuery>(
		graphql`
			query basicRovoAgentSelectorQuery($cloudId: ID!, $cloudIdString: String!) {
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

export default function Basic(): React.JSX.Element {
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
					isAbleToCreateAgents: true,
				},
				isCustomAgentsAvailable: true,
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
