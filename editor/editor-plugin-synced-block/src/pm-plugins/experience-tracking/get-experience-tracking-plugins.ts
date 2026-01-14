import type { ProviderExperienceOptions } from "../../types";

import { getCreateReferenceExperiencePlugin } from "./create-reference-experience"
import { getCreateSourceExperiencePlugin } from "./create-source-experience"
import { getDeleteReferenceExperiencePlugin } from "./delete-reference-experience";
import { getDeleteSourceExperiencePlugin } from "./delete-source-experience";
import { getProviderOnlyExperiencesPlugin } from "./provider-only-experiences";

export const getExperienceTrackingPlugins = ({ refs, dispatchAnalyticsEvent, syncBlockStore}: ProviderExperienceOptions) => {
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
	}, {
		name: 'deleteSourceExperiencePlugin',
		plugin: () =>
			getDeleteSourceExperiencePlugin({
				refs,
				dispatchAnalyticsEvent,
				syncBlockStore
			})
	}, {
		name: 'deleteReferenceExperiencePlugin',
		plugin: () =>
			getDeleteReferenceExperiencePlugin({
				refs,
				dispatchAnalyticsEvent,
				syncBlockStore
			})
	}, {
		name: 'providerOnlySyncedBlockExperiencesPlugin',
		plugin: () =>
			getProviderOnlyExperiencesPlugin({
				refs,
				dispatchAnalyticsEvent,
				syncBlockStore
			})
	}]
}
