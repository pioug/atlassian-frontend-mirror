import type { DispatchAnalyticsEvent } from "@atlaskit/editor-common/analytics";
import type { SyncBlockStoreManager } from "@atlaskit/editor-synced-block-provider";

import { getCreateReferenceExperiencePlugin } from "./create-reference-experience"
import { getCreateSourceExperiencePlugin } from "./create-source-experience"

type ExperienceTrackingPluginsProps = {
	dispatchAnalyticsEvent: DispatchAnalyticsEvent;
	refs: { containerElement?: HTMLElement, popupsMountPoint?: HTMLElement, wrapperElement?: HTMLElement};
	syncBlockStore: SyncBlockStoreManager;
}

export const getExperienceTrackingPlugins = ({ refs, dispatchAnalyticsEvent, syncBlockStore}: ExperienceTrackingPluginsProps) => {
	return [{
		name: 'createReferenceSyncedBlockExperiencePlugin',
		plugin: () =>
			getCreateReferenceExperiencePlugin({
				refs,
				dispatchAnalyticsEvent
			})
	}, {
		name: 'createSourceSyncedBlockExperiencePlugin',
		plugin: () =>
			getCreateSourceExperiencePlugin({
				refs,
				dispatchAnalyticsEvent,
				syncBlockStore
			})
	}]
}
