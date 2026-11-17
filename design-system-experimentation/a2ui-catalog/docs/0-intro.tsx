import React from 'react';

import { md } from '@atlaskit/docs';
import Code from '@atlaskit/code/code';
import Heading from '@atlaskit/heading/heading';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

import CatalogJsonSection from './_catalog-json-section';

const _default_1: any = md`
${(
	<Stack space="space.300">
		<Stack space="space.100">
			<Heading size="large">A2UI catalog</Heading>
			<Text>
				Component definitions for agents that produce Atlassian A2UI v0.9 surfaces. Choose the
				catalog supported by your host: ADS contains the base components, while Agentic Jira extends
				ADS with workflow components.
			</Text>
			<Text>
				Install <Code>@atlaskit/a2ui-catalog</Code> in your agent service and load a prebuilt
				catalog JSON file. The Agent integration guide shows how to give your model the
				schemas and instructions it needs to emit A2UI. A compatible host renders the messages;
				this package supplies schemas, not a renderer.
			</Text>
		</Stack>
		<CatalogJsonSection />
	</Stack>
)}
`;
export default _default_1;
