import React, { useCallback, useMemo, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import Code from '@atlaskit/code/code';
import CodeBlock from '@atlaskit/code/code-block';
import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import Tab from '@atlaskit/tabs/tab';
import TabList from '@atlaskit/tabs/tab-list';
import TabPanel from '@atlaskit/tabs/tab-panel';
import Tabs from '@atlaskit/tabs/tabs';
import { token } from '@atlaskit/tokens';
import {
	buildCatalogJson,
	CATALOG_DEFINITIONS,
	type CatalogDefinition,
} from '@atlaskit/a2ui-catalog/catalog-json';

type CopyStatus = 'idle' | 'copied' | 'failed';

const styles = cssMap({
	tabPanel: {
		paddingBlockStart: token('space.200'),
		width: '100%',
	},
	jsonScroller: {
		maxHeight: '480px',
		overflowY: 'auto',
		borderRadius: token('radius.small'),
	},
});

function CatalogJsonPanel({ definition }: { definition: CatalogDefinition }): React.JSX.Element {
	// Built with the same function as the checked-in `catalog.json`; the drift
	// test in `@atlaskit/a2ui-catalog` keeps the two identical.
	const json = useMemo(() => JSON.stringify(buildCatalogJson(definition), null, 2), [definition]);
	const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

	const onCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(json);
			setCopyStatus('copied');
		} catch {
			setCopyStatus('failed');
		}
	}, [json]);

	return (
		<Box xcss={styles.tabPanel}>
			<Stack space="space.150">
				<Text>{definition.description}</Text>
				<Text>
					Catalog ID: <Code>{definition.catalogId}</Code> ·{' '}
					{definition.components.length} components
				</Text>
				<Inline space="space.100" alignBlock="center">
					<Button appearance="primary" onClick={onCopy}>
						Copy JSON
					</Button>
					<Box role="status">
						{copyStatus === 'copied' && <Text color="color.text.subtle">Copied to clipboard.</Text>}
						{copyStatus === 'failed' && (
							<Text color="color.text.danger">
								Couldn’t copy. Select the JSON below and copy it manually.
							</Text>
						)}
					</Box>
				</Inline>
				<Box xcss={styles.jsonScroller} role="region" aria-label={`${definition.title} JSON`} tabIndex={0}>
					<CodeBlock
						language="json"
						text={json}
						label={`${definition.title} JSON`}
						shouldShowLineNumbers={false}
					/>
				</Box>
			</Stack>
		</Box>
	);
}

/** Copyable catalog JSON for agent builders, one tab per public catalog. */
export default function CatalogJsonSection(): React.JSX.Element {
	const publicCatalogs = CATALOG_DEFINITIONS.filter(({ isPrivate }) => !isPrivate);

	return (
		<Stack space="space.100">
			<Heading size="medium">Catalog JSON reference</Heading>
			<Text>
				Load a versioned catalog from <Code>@atlaskit/a2ui-catalog</Code> in your agent service
				and provide its schemas and instructions to your model. The Agent integration guide
				shows installation, prompt setup, and A2UI messages. Use the previews below to inspect
				or copy a catalog while developing.
			</Text>
			<Text>
				The JSON is generated from the catalog’s Zod schemas and is self-contained JSON Schema
				(draft 2019-09). Client-side functions such as <Code>openUrl</Code> aren’t included yet.
			</Text>
			<Tabs id="a2ui-catalog-json">
				<TabList>
					{publicCatalogs.map((definition) => (
						<Tab key={definition.catalogId}>{definition.title}</Tab>
					))}
				</TabList>
				{publicCatalogs.map((definition) => (
					<TabPanel key={definition.catalogId}>
						<CatalogJsonPanel definition={definition} />
					</TabPanel>
				))}
			</Tabs>
		</Stack>
	);
}
