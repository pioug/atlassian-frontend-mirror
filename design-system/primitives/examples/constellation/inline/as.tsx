import React, { type ReactNode } from 'react';

import { Checkbox } from '@atlaskit/checkbox';
import { Code } from '@atlaskit/code';
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';

const listStyles = xcss({ padding: 'space.0' });
// Disabling the typography rule because this is a valid use case
// to ensure the semantics of the list are preserved in Safari.
// eslint-disable-next-line @atlaskit/design-system/use-latest-xcss-syntax-typography
const listItemStyles = xcss({ '::marker': { fontSize: 0 } });
const definitionListStyles = xcss({ paddingInlineStart: 'space.0' });
const definitionListItemStyles = xcss({ margin: 'space.0' });

const InlineListItem = ({ children }: { children: ReactNode }) => (
	<Box as="li" xcss={listItemStyles}>
		{children}
	</Box>
);

const Term = ({ children }: { children: ReactNode }) => (
	<Box as="dt" xcss={definitionListItemStyles}>
		{children}:
	</Box>
);

const Definition = ({ children }: { children: ReactNode }) => (
	<Box as="dd" xcss={definitionListItemStyles}>
		{children}.
	</Box>
);

export default function Example() {
	return (
		<Stack space="space.200">
			<Box>
				<Code>Inline</Code> rendering as <Code>div</Code>:
				<Inline space="space.200">
					<Checkbox label="Option 1" />
					<Checkbox label="Option 2" />
					<Checkbox label="Option 3" />
					<Checkbox label="Option 4" />
				</Inline>
			</Box>
			<Box>
				<Code>Inline</Code> rendering as <Code>span</Code>:
				<Inline as="span" space="space.200">
					<Checkbox label="Option 1" />
					<Checkbox label="Option 2" />
					<Checkbox label="Option 3" />
					<Checkbox label="Option 4" />
				</Inline>
			</Box>
			<Box>
				<Code>Inline</Code> rendering as <Code>ul</Code>:
				<Inline as="ul" xcss={listStyles} separator="·" space="space.100">
					<InlineListItem>Jira</InlineListItem>
					<InlineListItem>Confluence</InlineListItem>
					<InlineListItem>BitBucket</InlineListItem>
					<InlineListItem>Trello</InlineListItem>
				</Inline>
			</Box>
			<Box>
				<Code>Inline</Code> rendering as <Code>ol</Code>:
				<Inline as="ol" xcss={listStyles} separator="·" space="space.100">
					<InlineListItem>Jira</InlineListItem>
					<InlineListItem>Confluence</InlineListItem>
					<InlineListItem>BitBucket</InlineListItem>
					<InlineListItem>Trello</InlineListItem>
				</Inline>
			</Box>
			<Box>
				<Code>Inline</Code> rendering as <Code>dl</Code>:
				<Inline as="dl" space="space.100" xcss={definitionListStyles}>
					<Term>JSW</Term>
					<Definition>Jira Software</Definition>
					<Term>JSM</Term>
					<Definition>Jira Service Management</Definition>
					<Term>BBC</Term>
					<Definition>BitBucket Cloud</Definition>
				</Inline>
			</Box>
		</Stack>
	);
}
