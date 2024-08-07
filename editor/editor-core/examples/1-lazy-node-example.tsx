import React, { useMemo, useRef, useState } from 'react';

import Button from '@atlaskit/button/new';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorCommand, NextEditorPlugin } from '@atlaskit/editor-common/types';
import { processRawValue } from '@atlaskit/editor-common/utils';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { useUniversalPreset } from '@atlaskit/editor-core/preset-universal';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import { DOMSerializer, type Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import { Selection } from '@atlaskit/editor-prosemirror/state';
import { ConfluenceCardClient } from '@atlaskit/editor-test-helpers/confluence-card-client';
import { ConfluenceCardProvider } from '@atlaskit/editor-test-helpers/confluence-card-provider';
import { getExampleExtensionProviders } from '@atlaskit/editor-test-helpers/example-helpers';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import Heading from '@atlaskit/heading';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { Flex, Inline, Stack, xcss } from '@atlaskit/primitives';

const LOCAL_STORAGE_DOC_KEY = 'lazy-node-example-content';
const smartCardClient = new ConfluenceCardClient('stg');

// ----------------------------------------------------------------------
/**
 * Custom plugin to replace custom node views with the `toDOM` method
 * This helps with debugging lazy node views
 */

// List of nodes to opt-in to compare with lazy node view (compare `toDOM` to
// custom node view implementation)
const optInNodes = [
	'mediaSingle',
	'media',
	'mediaInline',
	'mediaGroup',
	'table',
	'tableRow',
	'tableCell',
	'tableHeader',
	'taskItem',
	'embedCard',
	'blockCard',
	'extension',
	'bodiedExtension',
	'inlineExtension',
] as const;
type NodeViewType = Record<(typeof optInNodes)[number], typeof createToDOMNodeView>;

const nodeViews: NodeViewType = optInNodes.reduce((accumulator, currentValue) => {
	accumulator[currentValue] = createToDOMNodeView;
	return accumulator;
}, {} as NodeViewType);

const disableCustomNodesPlugin: NextEditorPlugin<
	'disableCustomNodes',
	{
		commands: {
			replaceDoc: (doc: JSONDocNode, otherSelection: Selection | undefined) => EditorCommand;
		};
	}
> = () => {
	return {
		name: 'disableCustomNodes',

		commands: {
			/**
			 * Custom command used to keep this editor in sync with the other one (without re-rendering)
			 */
			replaceDoc:
				(docNode, otherSelection) =>
				({ tr }) => {
					const value = processRawValue(tr.doc.type.schema, docNode);
					if (!value) {
						return null;
					}
					tr.replaceWith(0, tr.doc.nodeSize - 2, value);
					if (otherSelection) {
						tr.setSelection(Selection.near(tr.doc.resolve(otherSelection.from)));
					}
					return tr;
				},
		},

		pmPlugins() {
			return [
				{
					name: 'disableNodeViews',
					plugin: () =>
						new SafePlugin({
							props: {
								nodeViews,
							},
						}),
				},
			];
		},
	};
};

/**
 * Used to replace the custom node view with the `toDOM` method
 */
function createToDOMNodeView(node: PmNode) {
	if (node.type?.spec?.toDOM === undefined) {
		const dom = document.createElement('div');
		return {
			dom,
			contentDOM: dom,
		};
	}
	const fallback = DOMSerializer.renderSpec(document, node.type.spec.toDOM(node));
	return {
		dom: fallback.dom,
		contentDOM: fallback.contentDOM,
	};
}

// ----------------------------------------------------------------------
/**
 * Base preset to use
 */
const useBasePreset = () =>
	useUniversalPreset({
		props: {
			allowExtension: { allowBreakout: true, allowExtendFloatingToolbars: true },
			appearance: 'full-page',
			media: {
				allowMediaSingle: true,
				allowResizing: true,
				allowResizingInTables: true,
				provider: mediaProvider,
				allowAltTextOnImages: true,
				allowCaptions: true,
				enableDownloadButton: true,
				allowLinking: true,
				allowMediaInlineImages: true,
				featureFlags: {
					mediaInline: true,
				},
			},
			allowTables: {
				advanced: true,
				allowColumnSorting: true,
				stickyHeaders: true,
				allowCollapse: true,
				allowDistributeColumns: true,
			},
			allowTasksAndDecisions: true,
			linking: {
				smartLinks: {
					allowDatasource: true,
					allowBlockCards: true,
					allowEmbeds: true,
					provider: Promise.resolve(new ConfluenceCardProvider('stg')),
				},
			},
			featureFlags: {
				'safer-dispatched-transactions': true,
				'table-drag-and-drop': true,
				'table-preserve-width': true,
				'sticky-scrollbar': true,
				'table-duplicate-cell-colouring': true,
				'macro-interaction-updates': true,
			},
		},
	});

// ----------------------------------------------------------------------
/**
 * Example UI
 */

const mediaProvider = storyMediaProviderFactory();

const editorContainerRowStyles = xcss({
	maxWidth: '50%',
	padding: 'space.050',
});

const editorContainerColumnStyles = xcss({
	padding: 'space.050',
});

/**
 * Editor example that is used to compare an editor using lazy node views (ie. before the custom views have loaded)
 */
export default function LazyNodeComparison() {
	const universalPreset = useBasePreset();

	// Normal Editor Preset
	const { preset: normalEditorPreset, editorApi } = usePreset(() => {
		return universalPreset;
	}, [universalPreset]);

	// Lazy Node Editor Preset
	const { preset: lazyNodeEditorPreset, editorApi: lazyNodeEditorAPI } = usePreset(() => {
		return universalPreset.add(disableCustomNodesPlugin);
	}, [universalPreset]);

	// Direction to compare
	const [direction, setDirection] = useState<'row' | 'column'>('row');

	// To publish the document if you need to refresh the page
	const staticDoc = useRef<JSONDocNode | undefined>();
	const initialEditorValue = useMemo(() => {
		const initialValue = window.localStorage.getItem(LOCAL_STORAGE_DOC_KEY);
		if (initialValue) {
			try {
				return JSON.parse(initialValue);
			} catch {
				return undefined;
			}
		}
		return undefined;
	}, []);

	/**
	 * Used to update the document in the `onChange` method of the standard editor
	 */
	const onEditorChange = () => {
		editorApi?.core.actions.requestDocument((doc) => {
			staticDoc.current = doc;
			if (doc) {
				lazyNodeEditorAPI?.core?.actions.execute(
					lazyNodeEditorAPI?.disableCustomNodes.commands.replaceDoc(
						doc,
						editorApi?.selection?.sharedState.currentState()?.selection,
					),
				);
			}
		});
	};

	const Controls = () => (
		<Inline space="space.100">
			<Button
				onClick={() => {
					setDirection((prev) => (prev === 'row' ? 'column' : 'row'));
				}}
			>
				Set direction {direction === 'row' ? 'vertical' : 'horizontal'}
			</Button>
			<Button
				appearance="primary"
				onClick={() => {
					window.localStorage.setItem(LOCAL_STORAGE_DOC_KEY, JSON.stringify(staticDoc.current));
				}}
			>
				Publish
			</Button>
		</Inline>
	);

	return (
		<>
			<Controls />
			<Flex direction={direction}>
				<Stack
					space="space.200"
					grow="fill"
					xcss={direction === 'row' ? editorContainerRowStyles : editorContainerColumnStyles}
				>
					<Heading size="medium">Editor using lazy node fallback</Heading>

					<SmartCardProvider client={smartCardClient}>
						<ComposableEditor
							appearance="full-page"
							defaultValue={initialEditorValue}
							preset={lazyNodeEditorPreset}
							disabled={true}
							media={{ provider: mediaProvider }}
							linking={{
								smartLinks: {
									provider: Promise.resolve(new ConfluenceCardProvider('stg')),
								},
							}}
							extensionProviders={[getExampleExtensionProviders(undefined)]}
						/>
					</SmartCardProvider>
				</Stack>
				<Stack
					space="space.200"
					grow="fill"
					xcss={direction === 'row' ? editorContainerRowStyles : editorContainerColumnStyles}
				>
					<Heading size="medium">Standard Editor</Heading>
					<SmartCardProvider client={smartCardClient}>
						<ComposableEditor
							appearance="full-page"
							preset={normalEditorPreset}
							defaultValue={initialEditorValue}
							media={{ provider: mediaProvider }}
							linking={{
								smartLinks: {
									provider: Promise.resolve(new ConfluenceCardProvider('stg')),
								},
							}}
							extensionProviders={[getExampleExtensionProviders(undefined)]}
							onChange={onEditorChange}
						/>
					</SmartCardProvider>
				</Stack>
			</Flex>
		</>
	);
}
