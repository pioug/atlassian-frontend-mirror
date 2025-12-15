import React from 'react';

import { IntlProvider } from 'react-intl-next';
// eslint-disable-next-line @atlassian/relay/use-single-relay-environment
import { graphql, RelayEnvironmentProvider, useLazyLoadQuery } from 'react-relay';
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';

import { RovoAgentSelector } from '../src';
import { generateMockAgentEdges } from '../src/common/utils/generate-mock-agent-edges';

import type { customWidthRovoAgentSelectorQuery } from './__generated__/customWidthRovoAgentSelectorQuery.graphql';

const containerStyles = cssMap({
	container: {
		width: '400px',
	},
});

const TestRenderer = () => {
	const data = useLazyLoadQuery<customWidthRovoAgentSelectorQuery>(
		graphql`
			query customWidthRovoAgentSelectorQuery($cloudId: ID!, $cloudIdString: String!) {
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
		<Box xcss={containerStyles.container}>
			<RovoAgentSelector
				testId="rovo-agent-selector"
				fragmentReference={data}
				cloudId="mock-cloud-id"
				isFeatureEnabled
			/>
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
			AtlassianStudioUserSiteContextOutput: () => ({
				userPermissions: {
					isAbleToCreateAgents: true,
				},
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
