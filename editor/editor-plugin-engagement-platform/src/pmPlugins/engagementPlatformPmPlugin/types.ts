import type { CoordinationClient, EpComponents, EpHooks } from '../../engagementPlatformPluginType';

export interface EngagementPlatformPmPluginState {
	/**
	 * State of Engagement Platform messages in the Editor.
	 *
	 * Contains a map of message IDs to their active state.
	 */
	messageStates: { [messageId: string]: boolean };
	/** Engagement Platform coordination client */
	coordinationClient: CoordinationClient;
	epComponents: EpComponents;
	epHooks: EpHooks;
}

export interface EngagementPlatformPmPluginTrMeta {
	/**
	 * New state of Engagement Platform messages in the Editor.
	 *
	 * This state will be merged (NOT REPLACED) with the existing state.
	 */
	newMessageStates: { [messageId: string]: boolean };
}
