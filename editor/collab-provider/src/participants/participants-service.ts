import type {
	CollabEventPresenceData,
	CollabTelepointerPayload,
	CollabPresenceActivityChangePayload,
	ProviderParticipant,
	StepJson,
	UserPermitType,
} from '@atlaskit/editor-common/collab';

import { disconnectedReasonMapper } from '../disconnected-reason-mapper';
import type AnalyticsHelper from '../analytics/analytics-helper';
import { EVENT_ACTION, EVENT_STATUS } from '../helpers/const';
import { telepointerFromStep } from './telepointers-helper';
import type {
	CollabEventDisconnectedData,
	ChannelEvent,
	PresenceData,
	PresencePayload,
	TelepointerPayload,
	FetchAnonymousAsset,
} from '../types';
import type { BatchProps, GetUserType } from './participants-helper';
import {
	createParticipantFromPayload as enrichParticipant,
	fetchParticipants,
	PARTICIPANT_UPDATE_INTERVAL,
} from './participants-helper';
import { type ParticipantFilter, ParticipantsState } from './participants-state';
import { createLogger, isAIProviderID } from '../helpers/utils';

const logger = createLogger('PresenceService', 'pink');

const SEND_PRESENCE_INTERVAL = 150 * 1000; // 150 seconds
const DEFAULT_FETCH_USERS_INTERVAL = 500; // 0.5 second
const UNIDENTIFIED = 'unidentified';
export const SINGLE_COLLAB_MODE = 'single';
export const MULTI_COLLAB_MODE = 'collab';

/**
 * This service is responsible for handling presence and participant events, as well as sending them on to the editor or NCS.
 * @param analyticsHelper Analytics helper instance
 * @param participantsState Starts with no participants, only add this when testing
 * @param emit Emit from the Provider class (to the editor)
 * @param getUser Callback to get user data from the editor
 * @param channelBroadcast Broadcast from the Channel class (to NCS)
 * @param sendPresenceJoined Callback to Channel class
 */
export class ParticipantsService {
	private participantUpdateTimeout: number | undefined;
	private presenceUpdateTimeout: number | undefined;
	private presenceFetchTimeout: number | undefined;
	private currentlyPollingFetchUsers: boolean = true;
	private hasBatchFetchError: boolean = false;

	/**
	 * constructor
	 *
	 * @param analyticsHelper
	 * @param participantsState
	 * @param emit
	 * @param getUser
	 * @param batchProps
	 * @param channelBroadcast
	 * @param sendPresenceJoined
	 * @param getPresenceData
	 * @param setUserId
	 * @param getAIProviderActiveIds
	 * @param fetchAnonymousAsset
	 * @example
	 */
	constructor(
		private analyticsHelper: AnalyticsHelper | undefined,
		private participantsState: ParticipantsState = new ParticipantsState(),
		private emit: (
			evt: 'presence' | 'telepointer' | 'disconnected' | 'presence:changed',
			data:
				| CollabEventPresenceData
				| CollabTelepointerPayload
				| CollabEventDisconnectedData
				| CollabPresenceActivityChangePayload,
		) => void,
		private getUser: GetUserType,
		private batchProps: BatchProps | undefined,
		private channelBroadcast: <K extends keyof ChannelEvent>(
			type: K,
			data: Omit<ChannelEvent[K], 'timestamp'>,
			callback?: Function,
		) => void,
		private sendPresenceJoined: () => void,
		private getPresenceData: () => PresenceData,
		private setUserId: (id: string) => void,
		private getAIProviderActiveIds?: () => string[],
		private fetchAnonymousAsset?: FetchAnonymousAsset,
	) {}

	sendPresenceActivityChanged = () => {
		this.sendPresence();
	};

	sendAIProviderChanged = (payload: {
		action: 'add' | 'remove';
		clientId: string | number;
		permit?: UserPermitType;
		providerId?: string;
		sessionId: string;
		userId: string;
	}) => {
		if (payload.providerId) {
			for (const propKey in payload.permit) {
				if (payload.permit.hasOwnProperty(propKey)) {
					payload.permit[propKey as keyof UserPermitType] = false;
				}
			}

			const presencePayload = this.buildAIProviderPresencePayload(payload.providerId);

			if (payload.action === 'add') {
				this.sendAIProviderParticipantUpdated(presencePayload);
			} else if (payload.action === 'remove') {
				this.sendAIProviderParticipantLeft(presencePayload);
			}
		}
	};

	private buildAIProviderPresencePayload = (providerId: string) => {
		const defaultPresenceData = this.getPresenceData();
		const presencePayload: PresencePayload = {
			sessionId: `${providerId}::${defaultPresenceData.sessionId}`,
			userId: providerId,
			clientId: `${providerId}::${defaultPresenceData.clientId}`,
			permit: { isPermittedToComment: false, isPermittedToEdit: false, isPermittedToView: false },
			timestamp: Date.now(),
		};

		return presencePayload;
	};

	private sendAIProviderParticipantUpdated = (payload: PresencePayload) => {
		this.channelBroadcast('participant:updated', payload);
	};

	private sendAIProviderParticipantLeft = (payload: PresencePayload) => {
		this.channelBroadcast('participant:left', payload);
	};

	// Refresh current AI providers
	private sendAIProvidersPresence = () => {
		if (this.getAIProviderActiveIds) {
			this.getAIProviderActiveIds().forEach((aiProviderId) => {
				const presenceData = this.buildAIProviderPresencePayload(aiProviderId);
				this.sendAIProviderParticipantUpdated(presenceData);
			});
		}
	};

	private hasPresenceActivityChanged = (
		previous: ProviderParticipant,
		current: ProviderParticipant,
	) => {
		return previous.presenceActivity !== current.presenceActivity;
	};

	private handleAnonymousUser = async (payload: PresencePayload) => {
		const { sessionId } = payload;

		const previousParticipant = this.participantsState.getBySessionId(sessionId);
		let asset;
		let name = previousParticipant?.name ?? '';

		if (!previousParticipant && this.fetchAnonymousAsset) {
			try {
				asset = await this.fetchAnonymousAsset(payload.presenceId);
			} catch (error) {
				this.analyticsHelper?.sendErrorEvent(error, 'Error while fetching anonymous assets');
			}
			name = asset?.name ?? name;
		}

		const participant = {
			...payload,
			lastActive: payload.timestamp,
			name,
			avatar: previousParticipant?.avatar ?? asset?.src ?? '',
			email: '',
			userId: UNIDENTIFIED,
			isHydrated: true,
		};

		this.participantsState.setBySessionId(sessionId, participant);
		this.emitPresence({ joined: [participant] }, 'handling updated anonymous participant');
	};

	/**
	 * Carries out 3 things: 1) enriches the participant with user data, 2) updates the participantsState, 3) emits the presence event
	 * @param payload Payload from incoming socket event
	 * @example
	 */
	private updateParticipantEager = async (payload: PresencePayload) => {
		const { userId } = payload;

		if (!userId || userId === UNIDENTIFIED) {
			await this.handleAnonymousUser(payload);
			return;
		}

		let participant: ProviderParticipant | undefined;
		// getUser is a failable callback, hence try-catch
		try {
			participant = await enrichParticipant(
				// userId _must_ be defined, this lets the compiler know
				{ ...payload, userId },
				this.getUser,
			);
		} catch (error) {
			// We don't want to throw errors for Presence features as they tend to self-restore
			this.analyticsHelper?.sendErrorEvent(error, 'Error while enriching participant');
		}

		if (!participant) {
			return;
		}

		const previousParticipant = this.participantsState.getBySessionId(participant.sessionId);

		this.participantsState.setBySessionId(participant.sessionId, participant);

		if (previousParticipant) {
			if (this.hasPresenceActivityChanged(previousParticipant, participant)) {
				this.emitPresenceActivityChange(
					{
						type: 'participant:activity',
						activity: participant.presenceActivity,
					},
					'handling participant activity changed event',
				);
			}
			return;
		}

		// Only emit the joined presence event if this is a new participant
		this.emitPresence({ joined: [participant] }, 'handling participant updated event');
	};

	/**
	 * Will update participant state without attempting to hydrate the participant, which is handled in {@link #batchFetchUsers}
	 * Here's the TLDR of what this method handles
	 *
	 * 1. If participant that joined is anonymous, update state, emit event and return
	 * 2. If incoming participant is new, update state and emit event
	 * 3. If incoming participant is not new, update previous state with new values (timestamp, activity)
	 *
	 * @param payload Payload from incoming socket event
	 * @example
	 */
	private updateParticipantLazy = async (payload: PresencePayload) => {
		const { userId, sessionId } = payload;

		// anonymous users always skip hydration but are marked as hydrated since we don't want to attempt to fetch data
		// this can cause interesting behavior if batchProps.participantsLimit exists
		// for example if limit = 5 and we've hydrated 5 real users and 2 anonymous users join, it'll look like we've hydrated 7 users
		if (!userId || userId === UNIDENTIFIED) {
			await this.handleAnonymousUser(payload);
			return;
		}

		const previousParticipant = this.participantsState.getBySessionId(sessionId);
		if (!previousParticipant) {
			const participant = {
				...payload,
				lastActive: payload.timestamp,
				name: '',
				avatar: '',
				email: '',
				userId,
			};
			this.participantsState.setBySessionId(sessionId, participant);

			if (isAIProviderID(userId)) {
				this.emitPresence({ joined: [participant] }, 'handling updated new agent lazy');
				return;
			}

			// prevent running multiple debounces concurrently
			if (!this.currentlyPollingFetchUsers) {
				void this.batchFetchUsers();
			}

			// while this doesn't completely eliminate extra events from firing, it does help reduce it.
			// batchFetchUsers will always emitPresence when no participantsLimit is present;
			// however, if the limit has been reached, we need to ensure we emit the joined participants
			// current alternatives to this logic would add even more complexity
			if (this.batchProps?.participantsLimit) {
				this.emitPresence({ joined: [participant] }, 'handling updated new participant lazy');
			}
			return;
		}

		// would handle activity and lastActive changes
		const participant = {
			...previousParticipant,
			presenceActivity: payload.presenceActivity,
			lastActive: payload.timestamp,
		};

		if (this.hasPresenceActivityChanged(previousParticipant, participant)) {
			this.participantsState.setBySessionId(sessionId, participant);
			this.emitPresenceActivityChange(
				{
					type: 'participant:activity',
					activity: participant.presenceActivity,
				},
				'handling participant activity changed event',
			);
		}
		return;
	};

	onParticipantUpdated = async (payload: PresencePayload) => {
		if (this.batchProps) {
			this.updateParticipantLazy(payload);
		} else {
			await this.updateParticipantEager(payload);
		}
	};

	/**
	 * Called when a participant leaves the session.
	 * We emit the `presence` event to update the active avatars in the editor.
	 * @param payload
	 * @example
	 */
	onParticipantLeft = (payload: PresencePayload): void => {
		let sessionId = payload.sessionId;

		// When an agent leaves a session, the backend service returns the original user's
		// session ID accompanied by a payload containing the agent's session ID.
		// If the user session leaves, we also want to remove all agent sessions associated.
		if (payload?.data?.sessionId && isAIProviderID(payload.data.sessionId)) {
			sessionId = payload.data.sessionId;
		} else {
			const associatedAgents = this.getAIProviderParticipants().filter((ap) =>
				ap.sessionId.endsWith(sessionId),
			);

			associatedAgents.forEach((agent) => {
				this.onParticipantLeft({
					sessionId,
					timestamp: payload.timestamp,
					data: agent,
					userId: undefined,
					clientId: '',
				});
			});
		}

		this.participantsState.removeBySessionId(sessionId);
		this.emitPresence({ left: [{ sessionId }] }, 'participant leaving');
	};

	disconnect = (reason: string, sessionId: string | undefined) => {
		const left = this.participantsState.getParticipants();
		this.participantsState.clear();
		try {
			this.emit('disconnected', {
				reason: disconnectedReasonMapper(reason),
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				sid: sessionId!,
			});
		} catch (error) {
			// We don't want to throw errors for Presence features as they tend to self-restore
			this.analyticsHelper?.sendErrorEvent(error, 'Error while emitting disconnected data');
		}

		if (left.length) {
			this.emitPresence({ left }, 'emitting presence update on disconnect');
		}
	};

	/**
	 * Updates when users were last active
	 * @param userIds Users in most recent steps
	 * @example
	 */
	updateLastActive = (userIds: string[] = []) =>
		this.participantsState.updateLastActive(Date.now(), userIds);

	/**
	 * Called on receiving steps, emits each step's telepointer
	 * @param steps Steps to extract telepointers from
	 * @example
	 */
	emitTelepointersFromSteps(steps: StepJson[]) {
		steps.forEach((step) => {
			const event = telepointerFromStep(this.participantsState.getParticipants(), step);
			if (event) {
				this.emitTelepointer(event, 'emitting telepointers from steps');
			}
		});
	}

	/**
	 * Called when we receive a telepointer update from another
	 * participant.
	 * @param payload
	 * @param thisSessionId
	 * @example
	 */
	onParticipantTelepointer = (
		payload: TelepointerPayload,
		thisSessionId: string | undefined,
	): void => {
		const { sessionId, selection, timestamp } = payload;
		const participant = this.participantsState.getBySessionId(sessionId);
		if (
			sessionId === thisSessionId ||
			// Ignore old telepointer events
			(participant && participant.lastActive > timestamp)
		) {
			return;
		}

		const userId = payload.userId ? [payload.userId] : undefined;

		// Set last active
		this.updateLastActive(userId);

		this.emitTelepointer(
			{
				type: 'telepointer',
				selection,
				sessionId,
			},
			'handling participant telepointer event',
		);
	};

	/**
	 * Every 5 minutes (PARTICIPANT_UPDATE_INTERVAL), removes inactive participants and emits the update to other participants.
	 * Needs to be kicked off in the Provider.
	 * @param sessionId SessionId from provider's connection
	 * @example
	 */
	startInactiveRemover = (sessionId: string | undefined) => {
		clearTimeout(this.participantUpdateTimeout);

		try {
			this.filterInactive(sessionId);
		} catch (err) {
			this.analyticsHelper?.sendErrorEvent(err, 'Failed filtering inactive participants');
		}

		this.participantUpdateTimeout = window.setTimeout(
			() => this.startInactiveRemover(sessionId),
			PARTICIPANT_UPDATE_INTERVAL,
		);
	};

	enrichParticipants = async (props: BatchProps) => {
		try {
			const participants = await fetchParticipants(this.participantsState, props);
			if (participants.length) {
				this.emitPresence({ joined: participants }, 'handling participant updated event');
			}
		} catch (err) {
			props.onError?.(err);
			this.hasBatchFetchError = true;

			this.analyticsHelper?.sendErrorEvent(err, 'Failed while fetching participants');
		}
	};

	/**
	 * a debounce so we can wait until participants join before hydrating the user and perform batch calls in a timely manner.
	 *
	 * if {@link BatchProps#participantsLimit} is supplied
	 *  1. Fetch users until we've reached the participantsLimit
	 *  2. If there are no more participants to hydrate and we haven't reached the participantsLimit, stop polling
	 *  3. If we've reached our participantLimit, stop polling
	 *
	 * if no {@link BatchProps#participantsLimit} is supplied
	 *  1. Fetch users until there are no more participants to hydrate
	 * @example
	 */
	batchFetchUsers = async () => {
		if (!this.batchProps) {
			return;
		}
		if (this.hasBatchFetchError) {
			// no retry logic yet
			logger('Cannot continue to fetch users due to fetch error');
			clearTimeout(this.presenceFetchTimeout);
			return;
		}

		this.currentlyPollingFetchUsers = true;

		clearTimeout(this.presenceFetchTimeout);
		const { debounceTime, participantsLimit } = this.batchProps;

		if (participantsLimit) {
			const size = this.participantsState.getUniqueParticipants({ isHydrated: true }).length;
			if (size < participantsLimit) {
				await this.enrichParticipants({
					...this.batchProps,
					batchSize: participantsLimit,
				});
				this.currentlyPollingFetchUsers = this.participantsState.hasMoreParticipantsToHydrate();
			} else {
				this.currentlyPollingFetchUsers = false;
			}
		} else if (!participantsLimit) {
			await this.enrichParticipants(this.batchProps);
			this.currentlyPollingFetchUsers = this.participantsState.hasMoreParticipantsToHydrate();
		}

		if (this.currentlyPollingFetchUsers) {
			this.presenceFetchTimeout = window.setTimeout(
				() => this.batchFetchUsers(),
				debounceTime ?? DEFAULT_FETCH_USERS_INTERVAL,
			);
		}
	};

	/**
	 * We want to give some time for users to initially join before attempting to fetch users
	 * otherwise we'll always make at least 2 calls if there's more than 1 participant
	 * @example
	 */
	initializeFirstBatchFetchUsers = async () => {
		await new Promise((r) =>
			window.setTimeout(r, this.batchProps?.debounceTime ?? DEFAULT_FETCH_USERS_INTERVAL),
		);
		void this.batchFetchUsers();
	};

	/**
	 * Keep list of participants up to date. Filter out inactive users etc.
	 * @param sessionId
	 * @example
	 */
	private filterInactive = (sessionId: string | undefined): void => {
		const now: number = Date.now();

		const left = this.participantsState
			.getParticipants()
			.filter((p) => p.sessionId !== sessionId && now - p.lastActive > PARTICIPANT_UPDATE_INTERVAL);

		left.forEach((p) => this.participantsState.removeBySessionId(p.sessionId));

		left.length && this.emitPresence({ left }, 'filtering inactive participants');
	};

	/**
	 * Wrapper function to emit with error handling and analytics
	 * @param data Data to emit
	 * @param emit Emit function from Provider
	 * @param errorMessage
	 * @example
	 */
	private emitPresence = (data: CollabEventPresenceData, errorMessage: string): void => {
		try {
			this.emit('presence', data);
			this.analyticsHelper?.sendActionEvent(
				EVENT_ACTION.UPDATE_PARTICIPANTS,
				EVENT_STATUS.SUCCESS,
				{ participants: this.participantsState.size() },
			);
		} catch (error) {
			// We don't want to throw errors for Presence features as they tend to self-restore
			this.analyticsHelper?.sendErrorEvent(error, `Error while ${errorMessage}`);
		}
	};

	/**
	 * Wrapper function to emit with error handling and analytics
	 * @param data Data to emit
	 * @param emit Emit function from Provider
	 * @param errorMessage
	 * @example
	 */
	private emitTelepointer = (data: CollabTelepointerPayload, errorMessage: string): void => {
		try {
			this.emit('telepointer', data);
		} catch (error) {
			// We don't want to throw errors for Presence features as they tend to self-restore
			this.analyticsHelper?.sendErrorEvent(error, `Error while ${errorMessage}`);
		}
	};

	/**
	 * Wrapper function to emit with error handling and analytics
	 * @param data Data to emit
	 * @param errorMessage Error message for analytics
	 * @example
	 */
	private emitPresenceActivityChange(
		data: CollabPresenceActivityChangePayload,
		errorMessage: string,
	): void {
		try {
			this.emit('presence:changed', data);
		} catch (error) {
			// We don't want to throw errors for Presence features as they tend to self-restore
			this.analyticsHelper?.sendErrorEvent(error, `Error while ${errorMessage}`);
		}
	}

	/**
	 * Used when the provider is disconnected or destroyed to prevent perpetual timers from continuously running
	 * @example
	 */
	clearTimers = () => {
		clearTimeout(this.participantUpdateTimeout);
		clearTimeout(this.presenceFetchTimeout);
	};

	private sendPresence = () => {
		try {
			clearTimeout(this.presenceUpdateTimeout);

			const data: PresenceData = this.getPresenceData();
			this.channelBroadcast('participant:updated', data);

			this.presenceUpdateTimeout = window.setTimeout(
				() => this.sendPresence(),
				SEND_PRESENCE_INTERVAL,
			);

			// Expose existing AI providers to the newly joined user
			this.sendAIProvidersPresence();
		} catch (error) {
			// We don't want to throw errors for Presence features as they tend to self-restore
			this.analyticsHelper?.sendErrorEvent(error, 'Error while sending presence');
		}
	};

	/**
	 * Called when a participant joins the session.
	 *
	 * We keep track of participants internally, and emit the `presence` event to update
	 * the active avatars in the editor.
	 * This method will be triggered from backend to notify all participants to exchange presence
	 * @param payload
	 * @example
	 */
	onPresenceJoined = (payload: PresencePayload) => {
		try {
			logger('Participant joined with session: ', payload.sessionId);
			// This expose existing users to the newly joined user
			this.sendPresence();
		} catch (error) {
			// We don't want to throw errors for Presence features as they tend to self-restore
			this.analyticsHelper?.sendErrorEvent(error, 'Error while joining presence');
		}
	};

	/**
	 * Called when the current user joins the session.
	 *
	 * This will send both a 'presence' event and a 'participant:updated' event.
	 * This updates both the avatars and the participants list.
	 * @param payload
	 * @example
	 */
	onPresence = (payload: PresencePayload) => {
		try {
			logger('onPresence userId: ', payload.userId);
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			this.setUserId(payload.userId!);
			this.sendPresence();
			this.sendPresenceJoined();
		} catch (error) {
			// We don't want to throw errors for Presence features as they tend to self-restore
			this.analyticsHelper?.sendErrorEvent(error, 'Error while receiving presence');
		}
	};

	getParticipants = () => {
		return this.participantsState.getParticipants();
	};

	getUniqueParticipantSize = () => {
		return this.participantsState.getUniqueParticipantSize();
	};

	getUniqueParticipants = (filter: ParticipantFilter) => {
		return this.participantsState.getUniqueParticipants(filter);
	};

	getAIProviderParticipants = () => {
		return this.participantsState.getAIProviderParticipants();
	};

	getCollabMode = () => {
		return this.participantsState.size() > 1 ? MULTI_COLLAB_MODE : SINGLE_COLLAB_MODE;
	};
}
