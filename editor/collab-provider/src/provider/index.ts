import { v4 as uuidv4 } from 'uuid';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform';
import { Emitter } from '../emitter';
import { Channel } from '../channel';
import type { Config, InitialDraft, PresenceData } from '../types';
import type {
	CollabEditProvider,
	CollabEvents,
	CollabTelepointerPayload,
	ResolvedEditorState,
	Metadata,
	CollabInitPayload,
	SyncUpErrorFunction,
	CollabPresenceActivityChangePayload,
	CollabActivityAIProviderChangedPayload,
	UserPermitType,
	PresenceActivity,
} from '@atlaskit/editor-common/collab';

import { createLogger, logObfuscatedSteps } from '../helpers/utils';
import AnalyticsHelper from '../analytics/analytics-helper';
import { telepointerCallback } from '../participants/telepointers-helper';
import {
	CustomError,
	DestroyError,
	GetCurrentStateError,
	GetFinalAcknowledgedStateError,
	ProviderInitialisationError,
	SendTransactionError,
	SetEditorWidthError,
	SetMetadataError,
	SetTitleError,
} from '../errors/custom-errors';
import { NCS_ERROR_CODE } from '../errors/ncs-errors';
import { MetadataService } from '../metadata/metadata-service';
import { DocumentService } from '../document/document-service';
import { NullDocumentService } from '../document/null-document-service';
import { NamespaceService } from '../namespace/namespace-service';
import { ParticipantsService } from '../participants/participants-service';
import { errorCodeMapper } from '../errors/error-code-mapper';
import type { InternalError, ViewOnlyStepsError } from '../errors/internal-errors';
import { INTERNAL_ERROR_CODE } from '../errors/internal-errors';
import { EVENT_ACTION, EVENT_STATUS, CatchupEventReason } from '../helpers/const';
import { Api } from '../api/api';
import { shouldTelepointerBeSampled } from '../analytics/performance';
import { NullApi } from '../api/null-api';
import type { GetResolvedEditorStateReason } from '@atlaskit/editor-common/types';
import { fg } from '@atlaskit/platform-feature-flags';

const logger = createLogger('Provider', 'black');

const OUT_OF_SYNC_PERIOD = 3 * 1000; // 3 seconds

export const MAX_STEP_REJECTED_ERROR = 15;
export const MAX_STEP_REJECTED_ERROR_AGGRESSIVE = 2;

type BaseEvents = Pick<CollabEditProvider<CollabEvents>, 'setup' | 'send' | 'sendMessage'>;

export class Provider extends Emitter<CollabEvents> implements BaseEvents {
	api: Api | NullApi;
	private channel: Channel;
	private config: Config;
	private analyticsHelper?: AnalyticsHelper;
	private isChannelInitialized: boolean = false;
	private initialDraft?: InitialDraft;
	private isProviderInitialized: boolean = false;
	private isBuffered: boolean = false;
	// User permit is used to determine if the user is allowed to view, comment or edit the document
	// Therefore, the initial value is false for all three
	private permit: UserPermitType = {
		isPermittedToView: false,
		isPermittedToComment: false,
		isPermittedToEdit: false,
	};

	// isBufferingEnabled is a boolean value passed to the config during provider creation.
	// It determines if the provider should initialize immediately and will only be true if:
	// the feature flag is enabled and the initial draft fetched from NCS is also passed in the config.
	private isBufferingEnabled: boolean = false;
	// SessionID is the unique socket-session.
	private sessionId?: string;
	// ClientID is the unique ID for a prosemirror client. Used for step-rebasing.
	private clientId?: number | string;

	// UserID is the users actual account id.
	private userId?: string;

	// PresenceId is used to correlate to independent websocket connections together (presence and editor)
	private presenceId?: string;
	// PresenceActivity is used to determine if the user is a viewer or editor, only used in the presence connection
	private presenceActivity?: PresenceActivity;

	private presenceUpdateTimeout?: number;

	private disconnectedAt?: number;
	private sendStepsTimer?: ReturnType<typeof setInterval>;

	private readonly participantsService: ParticipantsService;
	private readonly metadataService: MetadataService;
	private readonly documentService: DocumentService | NullDocumentService;
	private readonly namespaceService: NamespaceService;

	// Local IDs of active AI Providers
	private aiProviderActiveIds: string[] = [];

	/**
	 * Wrapper for this.emit, it binds scope for callbacks and waits for initialising of the editor before emitting events.
	 * Waiting for the collab provider to become connected to the editor ensures the editor doesn't miss any events.
	 * @param evt - Event name to emit to subscribers
	 * @param data - Event data to emit to subscribers
	 */
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private readonly emitCallback: (evt: keyof CollabEvents, data: any) => void = (evt, data) =>
		this.emit(evt, data);

	/**
	 * Wrapper to update document and metadata.
	 * Catches and logs any errors thrown by document service's updateDocument and updateMetadata methods and destroys the provider in case of errors.
	 * Passing the document, metadata, version (either from the initial draft or from collab service)
	 */
	private readonly updateDocumentAndMetadata: ({
		doc,
		version,
		metadata,
	}: CollabInitPayload) => void = ({ doc, version, metadata }: CollabInitPayload) => {
		try {
			this.documentService.updateDocument({
				doc,
				version,
				metadata,
			});
			this.metadataService.updateMetadata(metadata);
			this.isProviderInitialized = true;
		} catch (e) {
			this.analyticsHelper?.sendErrorEvent(
				e,
				'Failed to update with the init document, destroying provider',
			);
			// Stop events and connections to step us trying to talk to the backend with an invalid state.
			this.destroy();
		}
	};

	constructor(config: Config) {
		super();
		this.config = config;
		this.analyticsHelper = new AnalyticsHelper(
			this.config.documentAri,
			this.config.productInfo?.subProduct,
			this.config.analyticsClient,
			this.config.getAnalyticsWebClient,
		);
		this.channel = new Channel(config, this.analyticsHelper);
		this.isChannelInitialized = false;
		this.initialDraft = this.config.initialDraft;
		this.isBufferingEnabled = Boolean(this.config.isBufferingEnabled);
		this.isProviderInitialized = false;
		this.participantsService = new ParticipantsService(
			this.analyticsHelper,
			undefined,
			this.emitCallback,
			this.config.getUser,
			this.config.batchProps,
			this.channel.broadcast,
			this.channel.sendPresenceJoined,
			this.getPresenceData,
			this.setUserId,
			this.getAIProviderActiveIds,
			this.config.fetchAnonymousAsset,
		);
		this.metadataService = new MetadataService(this.emitCallback, this.channel.sendMetadata);
		this.namespaceService = new NamespaceService();
		this.presenceId = this.config.presenceId;
		this.presenceActivity = this.config.presenceActivity;

		if (config.isPresenceOnly) {
			// this check is specifically for the presence only
			// This presence feature is only for the confluence view page & jira presence which do not need the document service or api
			this.documentService = new NullDocumentService();
			this.api = new NullApi();
		} else {
			this.documentService = new DocumentService(
				this.participantsService,
				this.analyticsHelper,
				this.channel.fetchCatchupv2,
				this.channel.fetchReconcile,
				this.channel.fetchGeneratedDiffSteps,
				this.emitCallback,
				this.channel.broadcast,
				() => this.userId,
				this.onErrorHandled,
				this.metadataService,
				this.namespaceService.getIsNamespaceLocked.bind(this.namespaceService),
				this.config.enableErrorOnFailedDocumentApply,
				{ __livePage: this.config.__livePage || false },
				this.channel.getConnected,
			);
			this.api = new Api(config, this.documentService as DocumentService, this.channel);
		}

		this.sendStepsTimer = setInterval(() => {
			logger('Intervally sendStepsFromCurrentState');
			this.documentService.sendStepsFromCurrentState(true, undefined);
		}, 5000);
	}

	private initializeChannel = () => {
		this.emit('connecting', { initial: true });
		// shouldSkipDocumentInit will bypass the NCS draft fetch if the initial draft is passed to the provider
		const shouldSkipDocumentInit = Boolean(this.initialDraft);
		this.channel
			.on('connected', ({ sid, initialized }) => {
				this.sessionId = sid;
				this.emit('connected', {
					sid,
					initial: !initialized,
				});
				const unconfirmedStepsLength = this.documentService.getUnconfirmedSteps()?.length;
				this.documentService.setNumberOfCommitsSent(0);

				// if buffering is enabled and the provider is initialized before connection,
				// send any unconfirmed steps
				if (this.isBufferingEnabled && this.isProviderInitialized && !this.isBuffered) {
					this.isBuffered = true; // setting buffering to true so that the sending of unconfirmed steps happens only on first connection
					this.documentService.sendStepsFromCurrentState(true);
				}

				// Early initialization with initial draft passed via provider
				if (this.initialDraft && initialized && !this.isProviderInitialized) {
					const { document, version, metadata }: InitialDraft = this.initialDraft;
					this.updateDocumentAndMetadata({
						doc: document,
						version,
						metadata,
					});
				}
				// If already initialized, `connected` means reconnected
				if (
					initialized &&
					this.disconnectedAt &&
					// Offline longer than `OUT_OF_SYNC_PERIOD`
					Date.now() - this.disconnectedAt >= OUT_OF_SYNC_PERIOD
				) {
					this.documentService.throttledCatchupv2(
						CatchupEventReason.RECONNECTED,
						{
							disconnectionPeriodSeconds: Math.floor((Date.now() - this.disconnectedAt) / 1000),
							unconfirmedStepsLength: unconfirmedStepsLength,
						},
						fg('add_session_id_to_catchup_query') ? this.sessionId : undefined,
					);
				}
				this.participantsService.startInactiveRemover(this.sessionId);
				if (this.config.batchProps) {
					if (this.config.getUser) {
						throw new ProviderInitialisationError('Cannot supply getUser and batchProps together');
					}
					this.participantsService.initializeFirstBatchFetchUsers();
				}
				this.disconnectedAt = undefined;
			})
			.on('init', ({ doc, version, metadata }) => {
				// Initial document and version
				this.updateDocumentAndMetadata({ doc, version, metadata });
			})
			.on('restore', this.documentService.onRestore)
			.on('permission', (permit: UserPermitType) => {
				this.permit = Object.assign(this.permit, permit);
				this.emit('permission', permit);
			})
			.on('steps:added', this.documentService.onStepsAdded)
			.on('metadata:changed', this.metadataService.onMetadataChanged)
			.on('participant:telepointer', (payload) =>
				this.participantsService.onParticipantTelepointer(payload, this.sessionId),
			)
			.on('presence:joined', this.participantsService.onPresenceJoined)
			.on('presence', this.participantsService.onPresence)
			.on('participant:left', this.participantsService.onParticipantLeft)
			.on('participant:updated', this.participantsService.onParticipantUpdated)
			.on('disconnect', this.onDisconnected.bind(this))
			.on('error', this.onErrorHandled)
			.on('status', async (status) => {
				await this.namespaceService.onNamespaceStatusChanged(status);
				const isLocked = this.namespaceService.getIsNamespaceLocked();
				this.emit('namespace-lock:check', { isLocked });
			})
			.connect(shouldSkipDocumentInit);
	};

	private setUserId = (id: string) => {
		this.userId = id;
	};

	private getPresenceData = (): PresenceData => {
		return {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			sessionId: this.sessionId!,
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			userId: this.userId!,
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			clientId: this.clientId!,
			permit: this.permit,
			presenceId: this.presenceId,
			presenceActivity: this.presenceActivity,
		};
	};

	private setPresenceActivity = (activity: PresenceActivity | undefined) => {
		this.presenceActivity = activity;
	};

	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/**
	 * Initialisation logic, called by Jira with a dummy getState function, deprecated in favour of the setup method which allows more configuration
	 * @param {Function} getState Function that returns the editor state, used to retrieve collab-edit properties and to interact with prosemirror-collab
	 * @throws {ProviderInitialisationError} Something went wrong during provider initialisation
	 * @deprecated Use setup method instead
	 */
	initialize(getState: () => EditorState): this {
		return this.setup({
			getState,
		});
	}

	/**
	 * Initialisation logic, called by the editor in the collab-edit plugin.
	 *
	 * @param {Function} options.getState Function that returns the editor state, used to retrieve collab-edit properties and to interact with prosemirror-collab
	 * @param options.editorApi
	 * @param {SyncUpErrorFunction} options.onSyncUpError (Optional) Function that gets called when the sync of steps fails after retrying 30 times, used by Editor to log to analytics
	 * @throws {ProviderInitialisationError} Something went wrong during provider initialisation
	 */
	setup({
		getState,
		editorApi,
		onSyncUpError,
	}: {
		getState: () => EditorState;
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		editorApi?: any;
		onSyncUpError?: SyncUpErrorFunction;
	}): this {
		this.checkForCookies();
		try {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const collabPlugin = getState().plugins.find((p: any) => p.key === 'collab$');
			if (collabPlugin === undefined) {
				throw new ProviderInitialisationError(
					'Collab provider attempted to initialise, but Editor state is missing collab plugin',
				);
			}
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			this.clientId = (collabPlugin.spec as any).config.clientID;

			// generate a temporary id as clientId when it is undefined
			// prefix temp-cp- indicates collab-provider
			if (!this.clientId) {
				this.clientId = `temp-cp-${uuidv4()}`;
			}

			this.documentService.setup({
				getState,
				onSyncUpError,
				clientId: this.clientId,
			});

			if (this.isBufferingEnabled && this.initialDraft && !this.isProviderInitialized) {
				const { document, version, metadata }: InitialDraft = this.initialDraft;
				this.updateDocumentAndMetadata({
					doc: document,
					version,
					metadata,
				});
				this.analyticsHelper?.sendActionEvent(
					EVENT_ACTION.PROVIDER_INITIALIZED,
					EVENT_STATUS.INFO,
					{
						isBuffered: true,
					},
				);
			}

			if (!this.isChannelInitialized) {
				this.initializeChannel();
				this.isChannelInitialized = true;
			}
		} catch (initError) {
			this.analyticsHelper?.sendErrorEvent(initError, 'Error while initialising the provider');
			// Throw error so consumers are aware the initialisation failed when initialising themselves
			throw new ProviderInitialisationError('Provider initialisation error', initError);
		}

		return this;
	}

	// Only used for the presence - opts out of the document service and api service
	setupForPresenceOnly(clientId: string) {
		this.clientId = clientId;
		this.checkForCookies();
		try {
			if (!this.isChannelInitialized) {
				this.initializeChannel();
				this.isChannelInitialized = true;
			}
		} catch (initError) {
			this.analyticsHelper?.sendErrorEvent(initError, 'Error while initialising the provider');
			// Throw error so consumers are aware the initialisation failed when initialising themselves
			throw new ProviderInitialisationError('Provider initialisation error', initError);
		}
		return this;
	}

	private checkForCookies() {
		if (!global.navigator.cookieEnabled) {
			const initError = new ProviderInitialisationError(
				'Cookies are not enabled. Please enable cookies to use collaborative editing.',
			);
			this.analyticsHelper?.sendErrorEvent(
				initError,
				'Error while initialising the provider - cookies disabled',
			);
			throw new ProviderInitialisationError(
				'Provider initialisation error - cookies disabled',
				initError,
			);
		}
	}

	/**
	 * Send steps from transaction to NCS (and as a consequence to other participants), called from the collab-edit plugin in the editor
	 * @param {Transaction} _tr Deprecated, included to keep API consistent with Synchrony provider
	 * @param {EditorState} _oldState Deprecated, included to keep API consistent with Synchrony provider
	 * @param {EditorState} newState The editor state after applying the transaction
	 * @throws {SendTransactionError} Something went wrong while sending the steps for this transaction
	 */
	send(_tr: Transaction | null, _oldState: EditorState | null, newState: EditorState) {
		try {
			if (this.isViewOnly()) {
				const error: ViewOnlyStepsError = {
					message: 'Attempted to send steps in view only mode',
					data: {
						code: INTERNAL_ERROR_CODE.VIEW_ONLY_STEPS_ERROR,
					},
				};

				logObfuscatedSteps(_oldState, newState)
					.then((attributes) => {
						const stepAttributes = attributes instanceof CustomError ? {} : { ...attributes };

						const stepsError = new CustomError(error.message, error, { ...stepAttributes });
						this.analyticsHelper?.sendErrorEvent(stepsError, stepsError.message);
					})
					.catch((err: CustomError) => this.analyticsHelper?.sendErrorEvent(err, err.message));

				return;
			}
			// Don't send steps while the document is locked (eg. when restoring the document)
			if (this.namespaceService.getIsNamespaceLocked()) {
				logger('The document is temporary locked');
				return;
			}
			this.documentService.send(_tr, _oldState, newState);
		} catch (error) {
			this.analyticsHelper?.sendErrorEvent(error, 'Error while sending steps for a transaction');
			throw new SendTransactionError('Error while sending steps for a transaction', error);
		}
	}

	/**
	 * @param {InternalError} error The error to handle
	 */
	private onErrorHandled = (error: InternalError) => {
		// User tried committing steps but they were rejected because:
		// HEAD_VERSION_UPDATE_FAILED: the collab service's latest stored step tail version didn't correspond to the head version of the first step submitted
		// VERSION_NUMBER_ALREADY_EXISTS: while storing the steps there was a conflict meaning someone else wrote steps into the database more quickly
		if (
			error.data?.code === NCS_ERROR_CODE.HEAD_VERSION_UPDATE_FAILED ||
			error.data?.code === NCS_ERROR_CODE.VERSION_NUMBER_ALREADY_EXISTS
		) {
			this.documentService.onStepRejectedError();
		} else if (error.data?.code === NCS_ERROR_CODE.CORRUPT_STEP_FAILED_TO_SAVE) {
			this.documentService.throttledCatchupv2(
				CatchupEventReason.CORRUPT_STEP,
				undefined,
				fg('add_session_id_to_catchup_query') ? this.sessionId : undefined,
			);
		} else {
			this.analyticsHelper?.sendErrorEvent(error, error.message);
			const mappedError = errorCodeMapper(error);
			// Only emit errors to Confluence very intentionally because they will disconnect the collab provider
			if (mappedError) {
				this.analyticsHelper?.sendProviderErrorEvent(mappedError);
				this.emit('error', mappedError);
			}
		}
	};

	private isViewOnly() {
		return (
			this.permit &&
			// isPermittedToEdit or isPermittedToView can be undefined, must use `===` here.
			this.permit.isPermittedToEdit === false &&
			this.permit.isPermittedToView === true
		);
	}

	/**
	 * Send messages, such as telepointers,  and AI provider changes to NCS and other participants.
	 * Only used for telepointer data (text and node selections) in the editor and JWM.
	 * JWM does some weird serialisation stuff on the node selections.
	 * Silently fails if an error occurs, since Presence isn't a critical functionality and self-restores over time.
	 *
	 * @param {CollabTelepointerPayload} data Data you want to send to NCS / the other participants
	 * @param {string} data.type Can only be 'telepointer' for now, we don't support anything else yet
	 * @param {CollabSendableSelection} data.selection Object representing the selected element
	 * @param {string} data.sessionId Identifier identifying the session
	 */
	sendMessage(
		data:
			| CollabTelepointerPayload
			| CollabActivityAIProviderChangedPayload
			| CollabPresenceActivityChangePayload,
	) {
		const basePayload = {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			userId: this.userId!,
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			sessionId: this.sessionId!,
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			clientId: this.clientId!,
			permit: this.permit,
		};
		try {
			if (data?.type === 'telepointer') {
				this.channel.broadcast(
					'participant:telepointer',
					{
						...basePayload,
						selection: data.selection,
					},
					shouldTelepointerBeSampled() ? telepointerCallback(this.config.documentAri) : undefined,
				);
			} else if (data?.type === 'ai-provider:change') {
				this.participantsService.sendAIProviderChanged({
					...basePayload,
					...data,
				});
			} else if (data?.type === 'participant:activity') {
				this.setPresenceActivity(data.activity);
				this.participantsService.sendPresenceActivityChanged();
			}
		} catch (error) {
			// We don't want to throw errors for Presence features as they tend to self-restore
			this.analyticsHelper?.sendErrorEvent(error, 'Error while sending message - telepointer');
		}
	}

	setAIProviderActiveIds(ids: string[] = []) {
		this.aiProviderActiveIds = ids;
	}

	private getAIProviderActiveIds = () => {
		return this.aiProviderActiveIds;
	};

	// Note: this gets triggered on page reload for Firefox (not other browsers) because of closeOnBeforeunload: false
	private onDisconnected = ({ reason }: { reason: string }) => {
		this.disconnectedAt = Date.now();
		this.participantsService.disconnect(reason, this.sessionId);
	};

	/**
	 * "Destroy" the provider, disconnect it's connection to the back-end service and unsubscribe all event listeners on the provider.
	 * Used by Jira products (JWM, JPD) to disable the provider
	 * @throws {DestroyError} Something went wrong while shutting down the collab provider
	 */
	destroy() {
		return this.unsubscribeAll();
	}

	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/**
	 * Disconnect the provider, disconnect it's connection to the back-end service and unsubscribe all event listeners on the provider.
	 * Used by Confluence to disable the provider when a user doesn't have access to a resource.
	 * @deprecated use destroy instead, it does the same thing
	 * @throws {DestroyError} Something went wrong while shutting down the collab provider
	 */
	disconnect() {
		return this.unsubscribeAll();
	}

	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/**
	 * Disconnect the provider's connection to the back-end service and unsubscribe from all events emitted by this provider. Kept to keep roughly aligned to Synchrony API, which you need to call for each event.
	 * @deprecated use destroy instead, it does the same thing
	 * @throws {DestroyError} Something went wrong while shutting down the collab provider
	 */
	unsubscribeAll() {
		try {
			super.unsubscribeAll();
			this.channel.disconnect();

			if (this.sendStepsTimer) {
				clearInterval(this.sendStepsTimer);
				this.sendStepsTimer = undefined;
			}
		} catch (error) {
			this.analyticsHelper?.sendErrorEvent(error, 'Error while shutting down the collab provider');
			throw new DestroyError('Error while shutting down the collab provider', error);
		}
		this.clearTimers();
		return this;
	}

	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/**
	 * Update the title of the document in the collab provider and optionally broadcast it to other participants and NCS
	 * @deprecated use setMetadata instead, it does the same thing
	 * @param {string} title Title you want to set on the document
	 * @param {boolean} broadcast (Optional) Flag indicating whether you want to broadcast the title change to the other participants, always true for now (otherwise we would lose title changes)
	 * @throws {SetTitleError} Something went wrong while setting the title
	 */
	setTitle(title: string, broadcast?: boolean) {
		try {
			if (this.isViewOnly()) {
				return;
			}
			this.metadataService.setTitle(title, broadcast);
		} catch (error) {
			this.analyticsHelper?.sendErrorEvent(error, 'Error while setting title');
			throw new SetTitleError('Error while setting title', error);
		}
	}

	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/**
	 * Set editor width, not used any more
	 * @deprecated use setMetadata instead, it does the same thing
	 * @param {string} editorWidth string? indicating the editor width
	 * @param {boolean} broadcast (Optional) Flag indicating whether you want to broadcast the editor width change
	 * @throws {SetEditorWidthError} Something went wrong while setting the editor width
	 */
	setEditorWidth(editorWidth: string, broadcast?: boolean) {
		try {
			this.metadataService.setEditorWidth(editorWidth, broadcast);
		} catch (error) {
			this.analyticsHelper?.sendErrorEvent(error, 'Error while setting editor width');
			throw new SetEditorWidthError('Error while setting editor width', error);
		}
	}

	/**
	 * Set the editor width and title and distribute it to all participants. Used by Confluence
	 * @param {Metadata} metadata The metadata you want to update
	 * @throws {ExampleError} Something went wrong while setting the metadata
	 */
	setMetadata(metadata: Metadata) {
		try {
			if (this.isViewOnly()) {
				return;
			}
			this.metadataService.setMetadata(metadata);
		} catch (error) {
			this.analyticsHelper?.sendErrorEvent(error, 'Error while setting metadata');
			throw new SetMetadataError('Error while setting metadata', error);
		}
	}

	/**
	 * Returns the documents metadata
	 */
	getMetadata = () => {
		return this.metadataService.getMetaData();
	};

	/**
	 * Return the ADF version of the current draft document, together with it's title and the current step version.
	 * Used for draft sync, a process running every 5s for the first editor of a document to sync the document to the Confluence back-end.
	 * @throws {GetCurrentStateError} Something went wrong while returning the current state
	 */
	getCurrentState = async (): Promise<ResolvedEditorState> => {
		try {
			return await this.documentService.getCurrentState();
		} catch (error) {
			this.analyticsHelper?.sendErrorEvent(
				error,
				'Error while returning ADF version of current draft document',
			);
			throw new GetCurrentStateError(
				'Error while returning the current state of the draft document',
				error,
			); // Reject the promise so the consumer can react to it failing
		}
	};

	/**
	 * Return the final acknowledged (by NCS) ADF version of the current draft document, together with it's title and the current step version.
	 * Used when returning the document to Confluence on publish.
	 * @throws {GetFinalAcknowledgedStateError} Something went wrong while returning the acknowledged state
	 */
	getFinalAcknowledgedState = async (
		reason: GetResolvedEditorStateReason,
	): Promise<ResolvedEditorState> => {
		try {
			return await this.documentService.getFinalAcknowledgedState(reason);
		} catch (error) {
			this.analyticsHelper?.sendErrorEvent(
				error,
				'Error while returning ADF version of the final draft document',
			);
			throw new GetFinalAcknowledgedStateError(
				'Error while returning the final acknowledged state of the draft document',
				error,
			); // Reject the promise so the consumer can react to it failing
		}
	};

	/**
	 * Returns the namespace locking status via true/false
	 */
	getIsNamespaceLocked(): boolean {
		return this.namespaceService.getIsNamespaceLocked();
	}

	getUnconfirmedSteps = (): readonly ProseMirrorStep[] | undefined => {
		return this.documentService.getUnconfirmedSteps();
	};

	/**
	 * Provides a synchronous method to retreive the version from the Document Service / Editor State
	 *
	 * @returns {number} Returns the current ProseMirror version from the Editor State
	 */
	getCurrentPmVersion = (): number => {
		return this.documentService.getCurrentPmVersion();
	};

	/**
	 * Used when the provider is disconnected or destroyed to prevent perpetual timers from continuously running
	 */
	private clearTimers = () => {
		clearTimeout(this.presenceUpdateTimeout);
		this.participantsService.clearTimers();
	};

	getParticipants = () => {
		return this.participantsService.getParticipants();
	};

	getUniqueParticipantSize = () => {
		return this.participantsService.getUniqueParticipantSize();
	};

	getUniqueParticipants = () => {
		return this.participantsService.getUniqueParticipants({ isHydrated: false });
	};

	getUniqueHydratedParticipants = () => {
		return this.participantsService.getUniqueParticipants({ isHydrated: true });
	};

	getAIProviderParticipants = () => {
		return this.participantsService.getAIProviderParticipants();
	};

	fetchMore = async (props?: { fetchSize?: number }) => {
		if (this.config.batchProps) {
			await this.participantsService.enrichParticipants({
				...this.config.batchProps,
				batchSize: props?.fetchSize ?? this.config.batchProps.batchSize,
			});
		} else {
			throw new Error('Must provide batch properties to use fetchMore');
		}
	};

	getSessionId = () => {
		return this.sessionId;
	};

	getDocumentAri = () => {
		return this.config.documentAri;
	};
}
