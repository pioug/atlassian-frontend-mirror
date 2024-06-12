import React from 'react';

import { Stack, Text } from '@atlaskit/primitives';

import { Code, CodeBlock } from '../src';

const exampleCodeBlock = `// src/packages/routes/[my-route]/resources/my-relay-resource/index.js - resource definition can be found here
import { createAri } from '@atlassian/jira-platform-ari';
import { createRelayResource } from '@atlassian/jira-relay-utils';
import QUERY, {type criticalDataQuery} from '@atlassian/jira-software-backlog/src/__generated__/criticalDataQuery.graphql';`;

export default function Component() {
	return (
		<Stack space="space.600">
			<Stack space="space.075">
				<Text weight="semibold">
					<Code>{`showLineNumbers={true}`}</Code> and <Code>{`shouldWrapLongLines={true}`}</Code>
				</Text>
				<CodeBlock
					testId="case1"
					text={exampleCodeBlock}
					showLineNumbers={true}
					shouldWrapLongLines={true}
				/>
			</Stack>
			<Stack space="space.075">
				<Text weight="semibold">
					<Code>{`showLineNumbers={true}`}</Code> and <Code>{`shouldWrapLongLines={true}`}</Code>{' '}
					and <Code>language="jsx"</Code>
				</Text>
				<CodeBlock
					testId="case2"
					language="jsx"
					text={exampleCodeBlock}
					showLineNumbers={true}
					shouldWrapLongLines={true}
				/>
			</Stack>
			<Stack space="space.075">
				<Text weight="semibold">
					<Code>{`showLineNumbers={true}`}</Code> and <Code>{`shouldWrapLongLines={false}`}</Code>
				</Text>
				<CodeBlock
					testId="case3"
					text={exampleCodeBlock}
					showLineNumbers={true}
					shouldWrapLongLines={false}
				/>
			</Stack>
			<Stack space="space.075">
				<Text weight="semibold">
					<Code>{`showLineNumbers={true}`}</Code> and <Code>{`shouldWrapLongLines={false}`}</Code>{' '}
					and <Code>language="jsx"</Code>
				</Text>
				<CodeBlock
					testId="case4"
					language="jsx"
					text={exampleCodeBlock}
					showLineNumbers={true}
					shouldWrapLongLines={false}
				/>
			</Stack>
			<Stack space="space.075">
				<Text weight="semibold">
					<Code>{`showLineNumbers={false}`}</Code> and <Code>{`shouldWrapLongLines={true}`}</Code>
				</Text>
				<CodeBlock
					testId="case5"
					text={exampleCodeBlock}
					showLineNumbers={false}
					shouldWrapLongLines={true}
				/>
			</Stack>
			<Stack space="space.075">
				<Text weight="semibold">
					<Code>{`showLineNumbers={false}`}</Code> and <Code>{`shouldWrapLongLines={true}`}</Code>{' '}
					and <Code>language="jsx"</Code>
				</Text>
				<CodeBlock
					testId="case6"
					language="jsx"
					text={exampleCodeBlock}
					showLineNumbers={false}
					shouldWrapLongLines={true}
				/>
			</Stack>
			<Stack space="space.075">
				<Text weight="semibold">
					<Code>{`showLineNumbers={false}`}</Code> and <Code>{`shouldWrapLongLines={false}`}</Code>
				</Text>
				<CodeBlock
					testId="case7"
					text={exampleCodeBlock}
					showLineNumbers={false}
					shouldWrapLongLines={false}
				/>
			</Stack>
			<Stack space="space.075">
				<Text weight="semibold">
					<Code>{`showLineNumbers={false}`}</Code> and <Code>{`shouldWrapLongLines={false}`}</Code>{' '}
					and <Code>language="jsx"</Code>
				</Text>
				<CodeBlock
					testId="case8"
					language="jsx"
					text={exampleCodeBlock}
					showLineNumbers={false}
					shouldWrapLongLines={false}
				/>
			</Stack>
		</Stack>
	);
}
