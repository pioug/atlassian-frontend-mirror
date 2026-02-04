/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { Checkbox } from '@atlaskit/checkbox';
import { Code } from '@atlaskit/code';
import { cssMap, jsx } from '@atlaskit/css';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	list: {
		paddingTop: token('space.0'),
		paddingRight: token('space.0'),
		paddingBottom: token('space.0'),
		paddingLeft: token('space.0'),
	},
	definitionList: { paddingInlineStart: token('space.0') },
	definitionListItem: {
		marginTop: token('space.0'),
		marginRight: token('space.0'),
		marginBottom: token('space.0'),
		marginLeft: token('space.0'),
	},
});

const Term = ({ children }: { children: ReactNode }) => (
	<Box as="dt" xcss={styles.definitionListItem}>
		{children}:
	</Box>
);

const Definition = ({ children }: { children: ReactNode }) => (
	<Box as="dd" xcss={styles.definitionListItem}>
		{children}.
	</Box>
);

export default function Example(): JSX.Element {
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
				<Inline as="ul" xcss={styles.list} space="space.100">
					<Box as="li">Jira</Box>
					<Box as="li">Confluence</Box>
					<Box as="li">BitBucket</Box>
					<Box as="li">Trello</Box>
				</Inline>
			</Box>
			<Box>
				<Code>Inline</Code> rendering as <Code>ol</Code>:
				<Inline as="ol" xcss={styles.list} space="space.100">
					<Box as="li">Jira</Box>
					<Box as="li">Confluence</Box>
					<Box as="li">BitBucket</Box>
					<Box as="li">Trello</Box>
				</Inline>
			</Box>
			<Box>
				<Code>Inline</Code> rendering as <Code>dl</Code>:
				<Inline as="dl" space="space.100" xcss={styles.definitionList}>
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
