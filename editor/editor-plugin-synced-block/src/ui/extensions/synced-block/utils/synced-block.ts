import type { ADFEntity } from '@atlaskit/adf-utils/types';

export const SYNCED_BLOCK_EXTENSION_TYPE = 'com.atlassian.platform.extensions';
export const SYNCED_BLOCK_EXTENSION_KEY = 'synced-block';

export const SYNCED_BLOCK_SOURCE_NODE = 'source';
export const SYNCED_BLOCK_SOURCE_KEY = `${SYNCED_BLOCK_EXTENSION_KEY}:${SYNCED_BLOCK_SOURCE_NODE}`;

export const SYNCED_BLOCK_REFERENCE_NODE = 'reference';
export const SYNCED_BLOCK_REFERENCE_KEY = `${SYNCED_BLOCK_EXTENSION_KEY}:${SYNCED_BLOCK_REFERENCE_NODE}`;

export type SyncedBlockAttributes = {
	extensionKey: typeof SYNCED_BLOCK_SOURCE_KEY | typeof SYNCED_BLOCK_REFERENCE_KEY;
	extensionType: typeof SYNCED_BLOCK_EXTENSION_TYPE;
	localId: string;
	parameters: {
		contentAri: string;
		contentPropertyKey: string;
		sourceDocumentAri: string;
	};
};

export const isSyncedBlockAttributes = (
	attributes: unknown,
): attributes is SyncedBlockAttributes => {
	return (
		!!attributes &&
		typeof attributes === 'object' &&
		'extensionKey' in attributes &&
		(attributes.extensionKey === SYNCED_BLOCK_SOURCE_KEY ||
			attributes.extensionKey === SYNCED_BLOCK_REFERENCE_KEY)
	);
};

export type SyncedBlockContentPropertyValue = {
	adf: ADFEntity;
};

export const getDefaultSyncedBlockContent = (): ADFEntity => {
	const attributes: SyncedBlockAttributes = {
		extensionType: SYNCED_BLOCK_EXTENSION_TYPE,
		extensionKey: SYNCED_BLOCK_SOURCE_KEY,
		parameters: {
			sourceDocumentAri: '',
			contentAri: '',
			contentPropertyKey: '',
		},
		localId: '',
	};

	return {
		type: 'bodiedExtension',
		attrs: attributes,
		content: [
			{
				type: 'paragraph',
				content: [
					{
						type: 'text',
						text: 'This is a synced block. Please edit the source document to update the content.',
					},
				],
			},
		],
	};
};

export const parseSyncedBlockContentPropertyValue = (
	value: string | object,
): SyncedBlockContentPropertyValue => {
	try {
		if (typeof value === 'string') {
			return JSON.parse(value);
		}
		return value as SyncedBlockContentPropertyValue;
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('Failed to parse synced block content:', error);

		return {
			adf: getDefaultSyncedBlockContent(),
		};
	}
};

export const stringifySyncedBlockContentPropertyValue = (
	value: SyncedBlockContentPropertyValue,
): string => {
	try {
		return JSON.stringify(value);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('Failed to serialize synced block content:', error);

		return JSON.stringify({
			adf: getDefaultSyncedBlockContent(),
		});
	}
};
