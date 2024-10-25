import type { CoordinationClient, EpComponents, EpHooks } from '../../engagementPlatformPluginType';

export interface EngagementPlatformPmPluginState {
	/**
	 * State of Engagement Platform messages in the Editor.
	 *
	 * Contains a map of message IDs to their active state.
	 */
	messageStates: { [messageId: string]: boolean };
	/**
	 * Promise for each message that has been started.
	 *
	 * This is used to prevent multiple start requests for the same message.
	 */
	startMessagePromises: { [messageId: string]: Promise<boolean> };
	/**
	 * Promise for each message that has been stopped.
	 *
	 * This is used to prevent multiple stop requests for the same message.
	 */
	stopMessagePromises: { [messageId: string]: Promise<boolean> };
	/** Engagement Platform coordination client */
	coordinationClient: CoordinationClient;
	epComponents: EpComponents;
	epHooks: EpHooks;
}

/** Command to EP plugin, that set state of a message with given ID. */
export interface SetMessageStateCommand {
	type: 'setMessageState';
	messageId: string;
	state: boolean;
}

/** Command to EP plugin, that set promise for starting a message with given ID. */
export interface SetStartMessagePromiseCommand {
	type: 'setStartMessagePromise';
	messageId: string;
	promise: Promise<boolean> | undefined;
}

/** Command to EP plugin, that set promise for stopping a message with given ID. */
export interface SetStopMessagePromiseCommand {
	type: 'setStopMessagePromise';
	messageId: string;
	promise: Promise<boolean> | undefined;
}

/** Commands that can be applied to the Engagement Platform plugin state. */
export type EngagementPlatformPmPluginCommand =
	| SetMessageStateCommand
	| SetStartMessagePromiseCommand
	| SetStopMessagePromiseCommand;

export interface EngagementPlatformPmPluginTrMeta {
	/** List of commands that should be applied to the Engagement Platform plugin state. */
	commands: EngagementPlatformPmPluginCommand[];
}
