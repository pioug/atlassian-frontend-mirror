import { useMemo } from 'react';

import type { ADFEntity } from '@atlaskit/adf-utils/types';

import type { ADFFetchProvider, ADFWriteProvider, SyncBlockData } from '../common/types';
import { getLocalIdFromAri, getPageIdFromAri, resourceIdFromSourceAndLocalId } from '../utils/ari';
import {
	getContentProperty,
	createContentProperty,
	updateContentProperty,
} from '../utils/contentProperty';

/**
 * Configuration for Content API providers
 */
interface ContentAPIConfig {
	cloudId: string;
	contentPropertyKey: string;
}

const getContentPropertyKey = (contentPropertyKey: string, localId: string) => {
	return contentPropertyKey + '-' + localId;
};

export type SyncedBlockContentPropertyValue = {
	content?: ADFEntity;
};

const parseSyncedBlockContentPropertyValue = (
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
			content: undefined,
		};
	}
};

/**
 * ADFFetchProvider implementation that fetches synced block data from Confluence Content API
 */
class ConfluenceADFFetchProvider implements ADFFetchProvider {
	constructor(private config: ContentAPIConfig) {}

	async fetchData(resourceId: string): Promise<SyncBlockData> {
		const pageId = getPageIdFromAri(resourceId);
		const localId = getLocalIdFromAri(resourceId);
		const key = getContentPropertyKey(this.config.contentPropertyKey, localId);
		const options = {
			pageId,
			key,
			cloudId: this.config.cloudId,
		};
		const contentProperty = await getContentProperty(options);
		const value = contentProperty.data.confluence.page.properties?.[0]?.value;

		if (!value) {
			throw new Error('Content property value does not exist');
		}

		// Parse the synced block content from the property value
		const syncedBlockData = parseSyncedBlockContentPropertyValue(value);

		return {
			content: syncedBlockData.content,
			resourceId,
			localId,
		};
	}
}

/**
 * ADFWriteProvider implementation that writes synced block data to Confluence Content API
 */
class ConfluenceADFWriteProvider implements ADFWriteProvider {
	constructor(private config: ContentAPIConfig) {}

	private createNewContentProperty = async (pageId: string, key: string, value: string) => {
		const contentProperty = await createContentProperty({
			pageId,
			key,
			value,
			cloudId: this.config.cloudId,
		});

		if (contentProperty.data.confluence.createPageProperty.pageProperty?.key === key) {
			return key;
		} else {
			throw new Error('Failed to create content property');
		}
	};

	async writeData(data: SyncBlockData): Promise<string> {
		const pageId = getPageIdFromAri(data.resourceId);

		if (
			data.sourceDocumentAri &&
			data.resourceId !== resourceIdFromSourceAndLocalId(data.sourceDocumentAri, data.localId)
		) {
			return Promise.reject('Resource ARI differs from source document ARI');
		}

		const syncedBlockValue = JSON.stringify({ content: data.content });

		if (data.resourceId) {
			// Update existing content property
			const localId = getLocalIdFromAri(data.resourceId);
			const key = getContentPropertyKey(this.config.contentPropertyKey, localId);
			const contentProperty = await updateContentProperty({
				pageId,
				key,
				value: syncedBlockValue,
				cloudId: this.config.cloudId,
			});

			if (contentProperty.data.confluence.updateValuePageProperty.pageProperty?.key === key) {
				return key;
			} else if (contentProperty.data.confluence.updateValuePageProperty.pageProperty === null) {
				return this.createNewContentProperty(pageId, key, syncedBlockValue);
			} else {
				throw new Error('Failed to update content property');
			}
		} else {
			// Create new content property
			const key = getContentPropertyKey(this.config.contentPropertyKey, data.localId);
			return this.createNewContentProperty(pageId, key, syncedBlockValue);
		}
	}
}

/**
 * Factory function to create both providers with shared configuration
 */
const createContentAPIProviders = (config: ContentAPIConfig) => {
	const fetchProvider = new ConfluenceADFFetchProvider(config);
	const writeProvider = new ConfluenceADFWriteProvider(config);

	return {
		fetchProvider,
		writeProvider,
	};
};

/**
 * Convenience function to create providers with default content property key
 */
export const createContentAPIProvidersWithDefaultKey = (cloudId: string) => {
	return createContentAPIProviders({
		cloudId,
		contentPropertyKey: 'editor-synced-block',
	});
};

export const useMemoizedContentAPIProviders = (cloudId: string) => {
	return useMemo(() => {
		return createContentAPIProvidersWithDefaultKey(cloudId);
	}, [cloudId]);
};
