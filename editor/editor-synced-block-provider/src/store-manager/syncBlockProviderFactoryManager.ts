import { type RendererSyncBlockEventPayload } from '@atlaskit/editor-common/analytics';
import { logException } from '@atlaskit/editor-common/monitoring';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

import type { ResourceId } from '../common/types';
import type {
	SyncBlockInstance,
	SyncBlockDataProviderInterface,
	SyncBlockRendererProviderCreator,
} from '../providers/types';
import { fetchErrorPayload } from '../utils/errorHandling';
import { parseResourceId } from '../utils/resourceId';

export interface SyncBlockProviderFactoryManagerDeps {
	getDataProvider: () => SyncBlockDataProviderInterface | undefined;
	getFireAnalyticsEvent: () => ((payload: RendererSyncBlockEventPayload) => void) | undefined;
	getFromCache: (resourceId: ResourceId) => SyncBlockInstance | undefined;
}

/**
 * Manages creation and caching of ProviderFactory instances used to
 * render synced block content (media, emoji, smart links, etc.).
 */
export class SyncBlockProviderFactoryManager {
	private providerFactories = new Map<ResourceId, ProviderFactory>();

	constructor(private deps: SyncBlockProviderFactoryManagerDeps) {}

	public getProviderFactory(resourceId: ResourceId): ProviderFactory | undefined {
		const dataProvider = this.deps.getDataProvider();
		if (!dataProvider) {
			const error = new Error('Data provider not set');
			logException(error, {
				location: 'editor-synced-block-provider/syncBlockProviderFactoryManager',
			});
			this.deps.getFireAnalyticsEvent()?.(fetchErrorPayload(error.message));
			return undefined;
		}

		const { parentDataProviders, providerCreator } =
			dataProvider.getSyncedBlockRendererProviderOptions();

		let providerFactory: ProviderFactory | undefined = this.providerFactories.get(resourceId);
		if (!providerFactory) {
			providerFactory = ProviderFactory.create({
				mentionProvider: parentDataProviders?.mentionProvider,
				profilecardProvider: parentDataProviders?.profilecardProvider,
				taskDecisionProvider: parentDataProviders?.taskDecisionProvider,
			});
			this.providerFactories.set(resourceId, providerFactory);
		} else {
			if (parentDataProviders?.mentionProvider) {
				providerFactory.setProvider('mentionProvider', parentDataProviders?.mentionProvider);
			}
			if (parentDataProviders?.profilecardProvider) {
				providerFactory.setProvider(
					'profilecardProvider',
					parentDataProviders?.profilecardProvider,
				);
			}
			if (parentDataProviders?.taskDecisionProvider) {
				providerFactory.setProvider(
					'taskDecisionProvider',
					parentDataProviders?.taskDecisionProvider,
				);
			}
		}

		if (providerCreator) {
			try {
				this.retrieveDynamicProviders(resourceId, providerFactory, providerCreator);
			} catch (error) {
				logException(error as Error, {
					location: 'editor-synced-block-provider/syncBlockProviderFactoryManager',
				});
				this.deps.getFireAnalyticsEvent()?.(
					fetchErrorPayload((error as Error).message, resourceId),
				);
			}
		}
		return providerFactory;
	}

	public getSSRProviders(resourceId: ResourceId) {
		const dataProvider = this.deps.getDataProvider();
		if (!dataProvider) {
			return null;
		}

		const { providerCreator } = dataProvider.getSyncedBlockRendererProviderOptions();

		if (!providerCreator?.createSSRMediaProvider) {
			return null;
		}

		const parsedResourceId = parseResourceId(resourceId);
		if (!parsedResourceId) {
			return null;
		}

		const { contentId, product: contentProduct } = parsedResourceId;

		try {
			const mediaProvider = providerCreator.createSSRMediaProvider({
				contentId,
				contentProduct,
			});

			if (mediaProvider) {
				return { media: mediaProvider };
			}
		} catch (error) {
			logException(error as Error, {
				location: 'editor-synced-block-provider/syncBlockProviderFactoryManager',
			});
		}

		return null;
	}

	public deleteFactory(resourceId: ResourceId): void {
		this.providerFactories.delete(resourceId);
	}

	public destroy(): void {
		this.providerFactories.forEach((pf) => pf.destroy());
		this.providerFactories.clear();
	}

	private retrieveDynamicProviders(
		resourceId: ResourceId,
		providerFactory: ProviderFactory,
		providerCreator: SyncBlockRendererProviderCreator,
	) {
		const dataProvider = this.deps.getDataProvider();
		if (!dataProvider) {
			throw new Error('Data provider not set');
		}

		const hasMediaProvider = providerFactory.hasProvider('mediaProvider');
		const hasEmojiProvider = providerFactory.hasProvider('emojiProvider');
		const hasCardProvider = providerFactory.hasProvider('cardProvider');

		if (hasMediaProvider && hasEmojiProvider && hasCardProvider) {
			return;
		}

		const syncBlock = this.deps.getFromCache(resourceId);
		if (!syncBlock?.data) {
			return;
		}

		if (!syncBlock.data.sourceAri || !syncBlock.data.product) {
			this.deps.getFireAnalyticsEvent()?.(
				fetchErrorPayload('Sync block source ari or product not found'),
			);
			return;
		}

		const parentInfo = dataProvider.retrieveSyncBlockParentInfo(
			syncBlock.data.sourceAri,
			syncBlock.data.product,
		);

		if (!parentInfo) {
			throw new Error('Unable to retrieve sync block parent info');
		}

		const { contentId, contentProduct } = parentInfo;

		if (!hasMediaProvider && providerCreator.createMediaProvider && contentId && contentProduct) {
			const mediaProvider = providerCreator.createMediaProvider({
				contentProduct,
				contentId,
			});
			if (mediaProvider) {
				providerFactory.setProvider('mediaProvider', mediaProvider);
			}
		}

		if (!hasEmojiProvider && providerCreator.createEmojiProvider && contentId && contentProduct) {
			const emojiProvider = providerCreator.createEmojiProvider({
				contentProduct,
				contentId,
			});
			if (emojiProvider) {
				providerFactory.setProvider('emojiProvider', emojiProvider);
			}
		}

		if (!hasCardProvider && providerCreator.createSmartLinkProvider) {
			const smartLinkProvider = providerCreator.createSmartLinkProvider();
			if (smartLinkProvider) {
				providerFactory.setProvider('cardProvider', smartLinkProvider);
			}
		}
	}
}
