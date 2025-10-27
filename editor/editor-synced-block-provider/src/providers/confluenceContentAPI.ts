import { useMemo } from 'react';

import { SyncBlockStatus } from '../common/types';
import type {
	ADFFetchProvider,
	ADFWriteProvider,
	FetchSyncBlockDataResult,
	SyncBlockData,
} from '../common/types';
import { getLocalIdFromAri, getPageIdAndTypeFromAri, type PAGE_TYPE } from '../utils/ari';
import {
	getContentProperty,
	createContentProperty,
	updateContentProperty,
	type CreateContentPropertyResult,
	type CreateBlogPostContentPropertyResult,
	type UpdateBlogPostContentPropertyResult,
	type UpdateContentPropertyResult,
	type GetContentPropertyResult,
	type GetBlogPostContentPropertyResult,
} from '../utils/contentProperty';
import { isBlogPageType } from '../utils/utils';

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

const parseSyncedBlockContentPropertyValue = (value: string): SyncBlockData => {
	try {
		if (value !== '') {
			const parsedValue = JSON.parse(value);
			if (typeof parsedValue.content === 'object') {
				return parsedValue as SyncBlockData;
			}

			throw new Error('Cannot parse synced block data: required properties missing in value');
		} else {
			throw new Error('Cannot parse synced block data: value is empty');
		}
	} catch (error) {
		throw new Error(`Failed to parse synced block data: ${error}`);
	}
};

const getResponseStatus = (
	contentProperty: GetBlogPostContentPropertyResult | GetContentPropertyResult,
): SyncBlockStatus => {
	const content =
		'blogPost' in contentProperty.data.confluence
			? contentProperty.data.confluence.blogPost
			: contentProperty.data.confluence.page;

	if (!content) {
		return SyncBlockStatus.Unauthorized;
	}
	if (!content.properties?.[0]) {
		return SyncBlockStatus.NotFound;
	}
	return SyncBlockStatus.Errored;
};

/**
 * ADFFetchProvider implementation that fetches synced block data from Confluence Content API
 */
class ConfluenceADFFetchProvider implements ADFFetchProvider {
	constructor(private config: ContentAPIConfig) {}

	async fetchData(resourceId: string): Promise<FetchSyncBlockDataResult> {
		const { id: pageId, type: pageType } = getPageIdAndTypeFromAri(resourceId);
		const localId = getLocalIdFromAri(resourceId);

		try {
			const key = getContentPropertyKey(this.config.contentPropertyKey, localId);
			const options = {
				pageId,
				key,
				cloudId: this.config.cloudId,
				pageType,
			};

			let status;
			let value;
			if (isBlogPageType(pageType)) {
				const contentProperty = await getContentProperty<GetBlogPostContentPropertyResult>(options);
				value = contentProperty.data.confluence.blogPost?.properties?.[0]?.value;
				status = getResponseStatus(contentProperty);
			} else {
				const contentProperty = await getContentProperty<GetContentPropertyResult>(options);
				value = contentProperty.data.confluence.page?.properties?.[0]?.value;
				status = getResponseStatus(contentProperty);
			}

			if (!value) {
				return { status: status, resourceId };
			}

			// Parse the synced block content from the property value
			const syncedBlockData = parseSyncedBlockContentPropertyValue(value);

			return {
				content: syncedBlockData.content,
				resourceId,
				blockInstanceId: localId,
			};
		} catch {
			return { status: SyncBlockStatus.Errored, resourceId };
		}
	}
}

/**
 * ADFWriteProvider implementation that writes synced block data to Confluence Content API
 */
class ConfluenceADFWriteProvider implements ADFWriteProvider {
	constructor(private config: ContentAPIConfig) {}

	private createNewContentProperty = async (
		pageId: string,
		key: string,
		value: SyncBlockData,
		pageType: PAGE_TYPE,
	) => {
		const options = {
			pageId,
			key,
			value,
			cloudId: this.config.cloudId,
			pageType,
		};

		if (isBlogPageType(pageType)) {
			const contentProperty =
				await createContentProperty<CreateBlogPostContentPropertyResult>(options);

			if (contentProperty.data.confluence.createBlogPostProperty.blogPostProperty?.key === key) {
				return key;
			} else {
				throw new Error('Failed to create blog post content property');
			}
		} else {
			const contentProperty = await createContentProperty<CreateContentPropertyResult>(options);

			if (contentProperty.data.confluence.createPageProperty.pageProperty?.key === key) {
				return key;
			} else {
				throw new Error('Failed to create page content property');
			}
		}
	};

	async writeData(data: SyncBlockData): Promise<string> {
		const { id: pageId, type: pageType } = getPageIdAndTypeFromAri(data.resourceId);

		if (data.resourceId) {
			// Update existing content property
			const localId = getLocalIdFromAri(data.resourceId);
			const key = getContentPropertyKey(this.config.contentPropertyKey, localId);
			const options = {
				pageId,
				key,
				value: data,
				cloudId: this.config.cloudId,
				pageType,
			};

			if (isBlogPageType(pageType)) {
				const contentProperty =
					await updateContentProperty<UpdateBlogPostContentPropertyResult>(options);

				if (
					contentProperty.data.confluence.updateValueBlogPostProperty.blogPostProperty?.key === key
				) {
					return key;
				} else if (
					contentProperty.data.confluence.updateValueBlogPostProperty.blogPostProperty === null
				) {
					return this.createNewContentProperty(pageId, key, data, pageType);
				} else {
					throw new Error('Failed to update blog post content property');
				}
			} else {
				const contentProperty = await updateContentProperty<UpdateContentPropertyResult>(options);

				if (contentProperty.data.confluence.updateValuePageProperty.pageProperty?.key === key) {
					return key;
				} else if (contentProperty.data.confluence.updateValuePageProperty.pageProperty === null) {
					return this.createNewContentProperty(pageId, key, data, pageType);
				} else {
					throw new Error('Failed to update content property');
				}
			}
		} else {
			// Create new content property
			const key = getContentPropertyKey(this.config.contentPropertyKey, data.blockInstanceId);
			return this.createNewContentProperty(pageId, key, data, pageType);
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
