import { useMemo } from 'react';

import {
	getConfluencePageAri,
	getPageARIFromContentPropertyResourceId,
	getLocalIdFromConfluencePageAri,
	getPageIdAndTypeFromConfluencePageAri,
	resourceIdFromConfluencePageSourceIdAndLocalId,
	type PAGE_TYPE,
} from '../../clients/confluence/ari';
import {
	getContentProperty,
	createContentProperty,
	updateContentProperty,
	deleteContentProperty,
	type CreateContentPropertyResult,
	type CreateBlogPostContentPropertyResult,
	type UpdateBlogPostContentPropertyResult,
	type UpdateContentPropertyResult,
	type GetContentPropertyResult,
	type GetBlogPostContentPropertyResult,
	type DeleteBlogPostPropertyResult,
	type DeletePageContentPropertyResult,
} from '../../clients/confluence/contentProperty';
import { isBlogPageType } from '../../clients/confluence/utils';
import { SyncBlockError, type ResourceId, type SyncBlockData } from '../../common/types';
import { stringifyError } from '../../utils/errorHandling';
import type {
	ADFFetchProvider,
	ADFWriteProvider,
	DeleteSyncBlockResult,
	SourceInfoFetchData,
	SyncBlockInstance,
	WriteSyncBlockResult,
} from '../types';

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

const getResponseError = (
	contentProperty: GetBlogPostContentPropertyResult | GetContentPropertyResult,
): SyncBlockError => {
	const content =
		'blogPost' in contentProperty.data.confluence
			? contentProperty.data.confluence.blogPost
			: contentProperty.data.confluence.page;

	if (!content) {
		return SyncBlockError.Forbidden;
	}
	if (!content.properties?.[0]) {
		return SyncBlockError.NotFound;
	}
	return SyncBlockError.Errored;
};

/**
 * ADFFetchProvider implementation that fetches synced block data from Confluence Content API
 */
class ConfluenceADFFetchProvider implements ADFFetchProvider {
	constructor(private config: ContentAPIConfig) {}

	async fetchData(resourceId: string): Promise<SyncBlockInstance> {
		const { id: pageId, type: pageType } = getPageIdAndTypeFromConfluencePageAri(resourceId);
		const localId = getLocalIdFromConfluencePageAri(resourceId);

		try {
			const key = getContentPropertyKey(this.config.contentPropertyKey, localId);
			const options = {
				pageId,
				key,
				cloudId: this.config.cloudId,
				pageType,
			};

			let error;
			let value;
			if (isBlogPageType(pageType)) {
				const contentProperty = await getContentProperty<GetBlogPostContentPropertyResult>(options);
				value = contentProperty.data.confluence.blogPost?.properties?.[0]?.value;
				error = getResponseError(contentProperty);
			} else {
				const contentProperty = await getContentProperty<GetContentPropertyResult>(options);
				value = contentProperty.data.confluence.page?.properties?.[0]?.value;
				error = getResponseError(contentProperty);
			}

			if (!value) {
				return { error, resourceId };
			}

			// Parse the synced block content from the property value
			const syncedBlockData = parseSyncedBlockContentPropertyValue(value);

			return {
				data: {
					content: syncedBlockData.content,
					resourceId,
					blockInstanceId: localId,
				},
				resourceId,
			};
		} catch {
			return { error: SyncBlockError.Errored, resourceId };
		}
	}

	retrieveSourceInfoFetchData(resourceId: ResourceId): SourceInfoFetchData {
		const pageARI = getPageARIFromContentPropertyResourceId(resourceId);
		let sourceLocalId;

		try {
			sourceLocalId = getLocalIdFromConfluencePageAri(resourceId);
		} catch (error) {
			// EDITOR-1921: log analytic here, safe to continue
		}

		return {
			pageARI,
			sourceLocalId,
		};
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
				return Promise.reject('Failed to create blog post content property');
			}
		} else {
			const contentProperty = await createContentProperty<CreateContentPropertyResult>(options);

			if (contentProperty.data.confluence.createPageProperty.pageProperty?.key === key) {
				return key;
			} else {
				return Promise.reject('Failed to create page content property');
			}
		}
	};

	async writeData(data: SyncBlockData): Promise<WriteSyncBlockResult> {
		let match;
		const { resourceId } = data;
		try {
			match = getPageIdAndTypeFromConfluencePageAri(data.resourceId);
		} catch (error) {
			return { error: stringifyError(error) };
		}

		const { id: pageId, type: pageType } = match;
		try {
			// Update existing content property
			const localId = getLocalIdFromConfluencePageAri(resourceId);
			const key = getContentPropertyKey(this.config.contentPropertyKey, localId);
			const sourceAri = getConfluencePageAri(pageId, this.config.cloudId, pageType);
			const syncBlockDataWithSourceDocumentAri: SyncBlockData = {
				...data,
				product: 'confluence-page',
				sourceAri,
			};
			const options = {
				pageId,
				key,
				value: syncBlockDataWithSourceDocumentAri,
				cloudId: this.config.cloudId,
				pageType,
			};

			const updatePayload = await updateContentProperty(options);
			const updateResult = isBlogPageType(pageType)
				? (updatePayload as UpdateBlogPostContentPropertyResult).data.confluence
						.updateValueBlogPostProperty.blogPostProperty
				: (updatePayload as UpdateContentPropertyResult).data.confluence.updateValuePageProperty
						.pageProperty;

			if (updateResult?.key === key) {
				return { resourceId };
			} else if (!updateResult) {
				return this.createNewContentProperty(pageId, key, data, pageType).then(
					() => {
						return { resourceId };
					},
					(error) => {
						return { error };
					},
				);
			} else {
				return { error: `Failed to update ${pageType} content property` };
			}
		} catch {
			return { error: `Failed to write ${pageType}` };
		}
	}

	async deleteData(resourceId: string): Promise<DeleteSyncBlockResult> {
		let deletePayload, deleteResult, match;
		try {
			match = getPageIdAndTypeFromConfluencePageAri(resourceId);
		} catch (error) {
			return { resourceId, success: false, error: stringifyError(error) };
		}

		const { id: pageId, type: pageType } = match;
		try {
			const localId = getLocalIdFromConfluencePageAri(resourceId);
			const key = getContentPropertyKey(this.config.contentPropertyKey, localId);
			const options = {
				pageId,
				key,
				cloudId: this.config.cloudId,
				pageType,
			};
			deletePayload = await deleteContentProperty(options);
			deleteResult = isBlogPageType(pageType)
				? (deletePayload as DeleteBlogPostPropertyResult).data.confluence.deleteBlogPostProperty
				: (deletePayload as DeletePageContentPropertyResult).data.confluence.deletePageProperty;
		} catch (error) {
			return {
				resourceId,
				success: false,
				error: stringifyError(error) ?? `Fail to delete ${pageType} content property`,
			};
		}

		return { resourceId, success: deleteResult.success, error: deleteResult.errors.join() };
	}

	generateResourceId(sourceId: string, localId: string): string {
		return resourceIdFromConfluencePageSourceIdAndLocalId(sourceId, localId);
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
