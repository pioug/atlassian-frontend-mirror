import React from 'react';

import type { ADFEntity } from '@atlaskit/adf-utils/types';
import { copyHTMLToClipboard } from '@atlaskit/editor-common/clipboard';
import type { ExtensionManifest } from '@atlaskit/editor-common/extensions';
import {
	DOMSerializer,
	Fragment,
	Mark,
	type NodeType,
	type Schema,
} from '@atlaskit/editor-prosemirror/model';
import SmartLinkIcon from '@atlaskit/icon/core/smart-link';

import SyncedBlockLiveView from './components/SyncedBlockLiveView';
import { getPageId } from './constants';
import { getConfluencePageAri, getContentPropertyAri } from './utils/ari';
import { createContentProperty } from './utils/content-property';
import type { SyncedBlockAttributes } from './utils/synced-block';
import {
	SYNCED_BLOCK_EXTENSION_KEY,
	SYNCED_BLOCK_EXTENSION_TYPE,
	SYNCED_BLOCK_REFERENCE_KEY,
	SYNCED_BLOCK_REFERENCE_NODE,
	SYNCED_BLOCK_SOURCE_KEY,
	SYNCED_BLOCK_SOURCE_NODE,
	getDefaultSyncedBlockContent,
	isSyncedBlockAttributes,
	stringifySyncedBlockContentPropertyValue,
} from './utils/synced-block';

const getRandomId = (): string => {
	if (!globalThis.crypto || typeof globalThis.crypto.randomUUID !== 'function') {
		return new Date().toISOString();
	}
	return globalThis.crypto.randomUUID();
};

const copyToClipboard = (adf: ADFEntity, schema?: Schema) => {
	if (!schema) {
		throw new Error('copyToClipboard(): Schema is required.');
	}

	// Validate the given ADF
	const nodeType: NodeType | undefined = schema.nodes[adf.type];

	if (!nodeType) {
		throw new Error(`copyToClipboard(): Invalid ADF type '${adf.type}'.`);
	}

	const fragment = Fragment.fromJSON(schema, adf.content);
	const marks = (adf.marks || []).map((markEntity) => Mark.fromJSON(schema, markEntity));
	const newNode = nodeType?.createChecked(adf.attrs, fragment, marks);

	if (!newNode) {
		throw new Error('copyToClipboard(): Could not create a node for given ADFEntity.');
	}

	const domNode = DOMSerializer.fromSchema(schema).serializeNode(newNode);

	const div = document.createElement('div');
	div.appendChild(domNode);
	copyHTMLToClipboard(div);
};

// Remaining tasks
// - Better location for content sync implementation – currently done in SyncedBlockSource renderer which won't work in editor
// 		- Could implement an editor plugin to do this, if there's no native way to do it with extensions
// - Implement separate content property for storage of the metadata of a synced block, separate from the content
// 		- Update polling to use the metadata content property, then if metadata updated, fetch the content property
// - Investigate re-rendering of SyncedBlockReference in editor on every document change (is this just atlaskit behavior?)
// - On copy of the synced block, transform into a reference
// - Move implementation into Confluence and test in branch environment
// - Dealing with orphaned synced block content properties data
// - Getting current page id in editor context and the cloud id
// - Explore hiding the frame for the extension in the editor, currently using `__hideFrame: true` and commented code to enable
export const getSyncedBlockManifest = (schema?: Schema): ExtensionManifest => ({
	title: 'Synced Block',
	type: SYNCED_BLOCK_EXTENSION_TYPE,
	key: SYNCED_BLOCK_EXTENSION_KEY,
	description: 'Synced block spike',
	icons: {
		// Ignored via go/ees005
		// eslint-disable-next-line require-await
		'48': async () => () => <SmartLinkIcon label="Synced Block" size="medium" />,
	},
	modules: {
		quickInsert: [
			{
				key: 'quick-insert-synced-block-source',
				action: async (_api) => {
					const contentPropertyKey = `synced-block-` + getRandomId();

					const content = getDefaultSyncedBlockContent();

					const value = stringifySyncedBlockContentPropertyValue({
						adf: content,
					});

					const contentProperty = await createContentProperty({
						pageId: getPageId(),
						key: contentPropertyKey,
						value,
					});

					const attributes: SyncedBlockAttributes = {
						extensionType: SYNCED_BLOCK_EXTENSION_TYPE,
						extensionKey: SYNCED_BLOCK_SOURCE_KEY,
						parameters: {
							sourceDocumentAri: getConfluencePageAri(getPageId()),
							contentAri: getContentPropertyAri(contentProperty.id),
							contentPropertyKey,
						},
						localId: 'testId',
					};

					content.attrs = attributes;

					return content;
				},
			},
		],
		nodes: {
			[SYNCED_BLOCK_SOURCE_NODE]: {
				type: 'bodiedExtension',
				// Ignored via go/ees005
				// eslint-disable-next-line require-await
				render: async () => (props) => {
					if (!isSyncedBlockAttributes(props.node)) {
						return null;
					}

					const { sourceDocumentAri, contentAri } = props.node.parameters;

					return (
						<SyncedBlockLiveView sourceDocumentAri={sourceDocumentAri} contentAri={contentAri} />
					);
				},
				// @ts-expect-error
				__hideFrame: true,
			},
			[SYNCED_BLOCK_REFERENCE_NODE]: {
				type: 'extension',
				// Ignored via go/ees005
				// eslint-disable-next-line require-await
				render: async () => (props) => {
					if (!isSyncedBlockAttributes(props.node)) {
						return null;
					}

					const { sourceDocumentAri, contentAri } = props.node.parameters;

					return (
						<SyncedBlockLiveView sourceDocumentAri={sourceDocumentAri} contentAri={contentAri} />
					);
				},
				// @ts-expect-error
				__hideFrame: true,
			},
		},
		contextualToolbars: [
			{
				context: {
					type: 'extension',
					nodeType: 'bodiedExtension',
					extensionType: SYNCED_BLOCK_EXTENSION_TYPE,
					extensionKey: SYNCED_BLOCK_SOURCE_KEY,
				},
				toolbarItems: [
					{
						key: 'toolbar-item-key',
						label: 'Referenece',
						display: 'icon',
						tooltip: 'Copy reference to clipboard',
						// Ignored via go/ees005
						// eslint-disable-next-line require-await
						icon: async () => () => <SmartLinkIcon label="Synced Block" size="medium" />,
						// Ignored via go/ees005
						// eslint-disable-next-line require-await
						action: async (contextNode) => {
							try {
								copyToClipboard(
									{
										type: 'extension',
										attrs: {
											extensionType: SYNCED_BLOCK_EXTENSION_TYPE,
											extensionKey: SYNCED_BLOCK_REFERENCE_KEY,
											parameters: {
												sourceDocumentAri: contextNode.attrs?.parameters?.sourceDocumentAri,
												contentAri: contextNode.attrs?.parameters?.contentAri,
											},
											localId: 'testId',
										},
									},
									schema,
								);
							} catch (e) {}
						},
					},
				],
			},
		],
	},
});
