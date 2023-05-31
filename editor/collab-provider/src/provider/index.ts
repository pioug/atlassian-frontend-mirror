import type { EditorState, Transaction } from 'prosemirror-state';
import type { Step as ProseMirrorStep } from 'prosemirror-transform';
import { Emitter } from '../emitter';
import { Channel } from '../channel';
import type {
  CollabEditProvider,
  CollabEvents,
  CollabTelepointerPayload,
  Config,
  Metadata,
  ResolvedEditorState,
  InitialDraft,
} from '../types';

import { createLogger } from '../helpers/utils';
import AnalyticsHelper from '../analytics/analytics-helper';

import type { SyncUpErrorFunction, PresenceData } from '../types';

import { telepointerCallback } from '../participants/telepointers-helper';
import {
  DestroyError,
  GetCurrentStateError,
  GetFinalAcknowledgedStateError,
  ProviderInitialisationError,
  SendTransactionError,
  SetEditorWidthError,
  SetMetadataError,
  SetTitleError,
  NCS_ERROR_CODE,
} from '../errors/error-types';
import { MetadataService } from '../metadata/metadata-service';
import { DocumentService } from '../document/document-service';
import { NamespaceService } from '../namespace/namespace-service';
import { ParticipantsService } from '../participants/participants-service';
import { errorCodeMapper } from '../errors/error-code-mapper';
import type { InternalError } from '../errors/error-types';

const logger = createLogger('Provider', 'black');

const OUT_OF_SYNC_PERIOD = 3 * 1000; // 3 seconds

export const MAX_STEP_REJECTED_ERROR = 15;

type BaseEvents = Pick<
  CollabEditProvider<CollabEvents>,
  'setup' | 'send' | 'sendMessage'
>;

export class Provider extends Emitter<CollabEvents> implements BaseEvents {
  private channel: Channel;
  private config: Config;
  private analyticsHelper?: AnalyticsHelper;
  private isChannelInitialized: boolean = false;
  private initialDraft?: InitialDraft;
  private isProviderInitialized: boolean = false;

  // isPreinitializating acts as a feature flag to determine when the provider has been initialized early
  // and also contains the initial draft
  private isPreinitializing: boolean = false;

  // SessionID is the unique socket-session.
  private sessionId?: string;

  // ClientID is the unique ID for a prosemirror client. Used for step-rebasing.
  private clientId?: number | string;

  // UserID is the users actual account id.
  private userId?: string;

  private presenceUpdateTimeout?: number;

  private disconnectedAt?: number;

  private readonly participantsService: ParticipantsService;
  private readonly metadataService: MetadataService;
  private readonly documentService: DocumentService;
  private readonly namespaceService: NamespaceService;

  /**
   * Wrapper for this.emit, it binds scope for callbacks and waits for initialising of the editor before emitting events.
   * Waiting for the collab provider to become connected to the editor ensures the editor doesn't miss any events.
   * @param evt - Event name to emit to subscribers
   * @param data - Event data to emit to subscribers
   */
  private readonly emitCallback: (evt: keyof CollabEvents, data: any) => void =
    (evt, data) => {
      // When the provider is initialized early, we want the editor state promise to resolve before emitting events
      // to ensure that it is ready to listen to the events fired by NCS
      if (this.isPreinitializing) {
        this.getStatePromise.then(() => this.emit(evt, data));
      } else {
        this.emit(evt, data);
      }
    };

  private getStatePromise: Promise<void>;
  getStatePromiseResolve!: (value: void | PromiseLike<void>) => void;

  constructor(config: Config) {
    super();
    this.config = config;
    this.analyticsHelper = new AnalyticsHelper(
      this.config.documentAri,
      this.config.analyticsClient,
      this.config.getAnalyticsWebClient,
    );
    this.channel = new Channel(config, this.analyticsHelper);
    this.isChannelInitialized = false;
    this.initialDraft = this.config.initialDraft;
    this.isProviderInitialized = false;
    this.isPreinitializing = false;
    this.participantsService = new ParticipantsService(
      this.analyticsHelper,
      undefined,
      this.emitCallback,
      this.config.getUser,
      this.channel.broadcast,
      this.channel.sendPresenceJoined,
      this.getPresenceData,
      this.setUserId,
    );
    this.metadataService = new MetadataService(
      this.emitCallback,
      this.channel.sendMetadata,
    );
    this.documentService = new DocumentService(
      this.participantsService,
      this.analyticsHelper,
      this.channel.fetchCatchup,
      this.emitCallback,
      this.channel.broadcast,
      () => this.userId,
      this.onErrorHandled,
      this.metadataService,
    );
    this.getStatePromise = new Promise((resolve) => {
      this.getStatePromiseResolve = resolve;
    });
    this.namespaceService = new NamespaceService();
  }

  private initializeChannel = () => {
    this.emit('connecting', { initial: true });
    const shouldInitialize =
      Boolean(this.initialDraft) && !this.isProviderInitialized;
    this.channel
      .on('connected', ({ sid, initialized }) => {
        this.sessionId = sid;
        this.emitCallback('connected', {
          sid,
          initial: !initialized,
        });
        // If initial draft is already present and the channel is initialized,
        // fire the provider's init event with initial draft document and version
        if (this.initialDraft && initialized && !this.isProviderInitialized) {
          const { document, version, metadata }: InitialDraft =
            this.initialDraft;
          // Initial document, version, metadata from initial draft
          this.documentService.updateDocument({
            doc: document,
            version,
            metadata,
          });
          this.metadataService.updateMetadata(metadata);
          this.isProviderInitialized = true;
        }
        // If already initialized, `connected` means reconnected
        if (
          initialized &&
          this.disconnectedAt &&
          // Offline longer than `OUT_OF_SYNC_PERIOD`
          Date.now() - this.disconnectedAt >= OUT_OF_SYNC_PERIOD
        ) {
          this.documentService.throttledCatchup();
        }
        this.participantsService.startInactiveRemover(this.sessionId);
        this.disconnectedAt = undefined;
      })
      .on('init', ({ doc, version, metadata }) => {
        // Initial document and version
        this.documentService.updateDocument({
          doc,
          version,
          metadata,
        });
        this.metadataService.updateMetadata(metadata);
        this.isProviderInitialized = true;
      })
      .on('restore', this.documentService.onRestore)
      .on('steps:added', this.documentService.onStepsAdded)
      .on('metadata:changed', this.metadataService.onMetadataChanged)
      .on('participant:telepointer', (payload) =>
        this.participantsService.onParticipantTelepointer(
          payload,
          this.sessionId,
        ),
      )
      .on('presence:joined', this.participantsService.onPresenceJoined)
      .on('presence', this.participantsService.onPresence)
      .on('participant:left', this.participantsService.onParticipantLeft)
      .on('participant:updated', this.participantsService.onParticipantUpdated)
      .on('disconnect', this.onDisconnected.bind(this))
      .on('error', this.onErrorHandled)
      .on('status', this.namespaceService.onNamespaceStatusChanged)
      .connect(shouldInitialize);
  };

  private setUserId = (id: string) => {
    this.userId = id;
  };
  private getPresenceData = (): PresenceData => {
    return {
      sessionId: this.sessionId!,
      userId: this.userId!,
      clientId: this.clientId!,
    };
  };

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
   * When getState is nullish and a initialDraft is provided the collab provider is in a state of pre-initialization,
   * the provider starts to enable the connection to NCS, but the provider will not emit any events until this function
   * is called again with a getState function, indicating that the editor is loaded and ready to receive the emits.
   *
   * @param {Object} options ...
   * @param {Function} options.getState Function that returns the editor state, used to retrieve collab-edit properties and to interact with prosemirror-collab
   * @param {SyncUpErrorFunction} options.onSyncUpError (Optional) Function that gets called when the sync of steps fails after retrying 30 times, used by Editor to log to analytics
   * @throws {ProviderInitialisationError} Something went wrong during provider initialisation
   */
  setup({
    getState,
    onSyncUpError,
  }: {
    getState?: () => EditorState;
    onSyncUpError?: SyncUpErrorFunction;
  }): this {
    this.checkForCookies();
    try {
      // if setup is called with no state and the initial draft is already provided
      // set a flag to mark early provider setup
      if (!getState && this.initialDraft) {
        this.isPreinitializing = true;
      }

      if (getState) {
        // if provider has already been initialized earlier, resolve the state once it is available
        if (this.isPreinitializing) {
          this.getStatePromiseResolve();
        }
        const collabPlugin = getState().plugins.find(
          (p: any) => p.key === 'collab$',
        );
        if (collabPlugin === undefined) {
          throw new ProviderInitialisationError(
            'Collab provider attempted to initialise, but Editor state is missing collab plugin',
          );
        }
        this.clientId = (collabPlugin.spec as any).config.clientID;

        this.documentService.setup({
          getState,
          onSyncUpError,
          clientId: this.clientId,
        });
      }

      if (!this.isChannelInitialized) {
        this.initializeChannel();
        this.isChannelInitialized = true;
      }
    } catch (initError) {
      this.analyticsHelper?.sendErrorEvent(
        initError,
        'Error while initialising the provider',
      );
      // Throw error so consumers are aware the initialisation failed when initialising themselves
      throw new ProviderInitialisationError(
        'Provider initialisation error',
        initError,
      );
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
  send(
    _tr: Transaction | null,
    _oldState: EditorState | null,
    newState: EditorState,
  ) {
    try {
      // Don't send steps while the document is locked (eg. when restoring the document)
      if (this.namespaceService.getIsNamespaceLocked()) {
        logger('The document is temporary locked');
        return;
      }
      this.documentService.send(_tr, _oldState, newState);
    } catch (error) {
      this.analyticsHelper?.sendErrorEvent(
        error,
        'Error while sending steps for a transaction',
      );
      throw new SendTransactionError(
        'Error while sending steps for a transaction',
        error,
      );
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
    } else {
      this.analyticsHelper?.sendErrorEvent(error, 'Error handled');
      const mappedError = errorCodeMapper(error);
      // Temporarily only emit errors to Confluence very intentionally because they will disconnect the collab provider
      if (mappedError) {
        this.analyticsHelper?.sendErrorEvent(mappedError, 'Error emitted');
        this.emitCallback('error', mappedError);
      }
    }
  };

  /**
   * Send messages, such as telepointers, to NCS and other participants. Only used for telepointer data (text and node selections) in the editor and JWM. JWM does some weird serialisation stuff on the node selections.
   * Silently fails if an error occurs, since Presence isn't a critical functionality and self-restores over time.
   * @param {CollabTelepointerPayload} data Data you want to send to NCS / the other participants
   * @param {string} data.type Can only be 'telepointer' for now, we don't support anything else yet
   * @param {CollabSendableSelection} data.selection Object representing the selected element
   * @param {string} data.sessionId Identifier identifying the session
   */
  sendMessage(data: CollabTelepointerPayload) {
    try {
      if (data?.type === 'telepointer') {
        const payload = {
          userId: this.userId!,
          sessionId: this.sessionId!,
          clientId: this.clientId!,
          selection: data.selection,
        };
        const callback = telepointerCallback(this.config.documentAri);
        this.channel.broadcast('participant:telepointer', payload, callback);
      }
    } catch (error) {
      // We don't want to throw errors for Presence features as they tend to self-restore
      this.analyticsHelper?.sendErrorEvent(
        error,
        'Error while sending message - telepointer',
      );
    }
  }

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

  /**
   * Disconnect the provider, disconnect it's connection to the back-end service and unsubscribe all event listeners on the provider.
   * Used by Confluence to disable the provider when a user doesn't have access to a resource.
   * @deprecated use destroy instead, it does the same thing
   * @throws {DestroyError} Something went wrong while shutting down the collab provider
   */
  disconnect() {
    return this.unsubscribeAll();
  }

  /**
   * Disconnect the provider's connection to the back-end service and unsubscribe from all events emitted by this provider. Kept to keep roughly aligned to Synchrony API, which you need to call for each event.
   * @deprecated use destroy instead, it does the same thing
   * @throws {DestroyError} Something went wrong while shutting down the collab provider
   */
  unsubscribeAll() {
    try {
      super.unsubscribeAll();
      this.channel.disconnect();
    } catch (error) {
      this.analyticsHelper?.sendErrorEvent(
        error,
        'Error while shutting down the collab provider',
      );
      throw new DestroyError(
        'Error while shutting down the collab provider',
        error,
      );
    }
    this.clearTimers();
    return this;
  }

  /**
   * Update the title of the document in the collab provider and optionally broadcast it to other participants and NCS
   * @deprecated use setMetadata instead, it does the same thing
   * @param {string} title Title you want to set on the document
   * @param {boolean} broadcast (Optional) Flag indicating whether you want to broadcast the title change to the other participants, always true for now (otherwise we would lose title changes)
   * @throws {SetTitleError} Something went wrong while setting the title
   */
  setTitle(title: string, broadcast?: boolean) {
    try {
      this.metadataService.setTitle(title, broadcast);
    } catch (error) {
      this.analyticsHelper?.sendErrorEvent(error, 'Error while setting title');
      throw new SetTitleError('Error while setting title', error);
    }
  }

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
      this.analyticsHelper?.sendErrorEvent(
        error,
        'Error while setting editor width',
      );
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
      this.metadataService.setMetadata(metadata);
    } catch (error) {
      this.analyticsHelper?.sendErrorEvent(
        error,
        'Error while setting metadata',
      );
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
      return this.documentService.getCurrentState();
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
  getFinalAcknowledgedState = async (): Promise<ResolvedEditorState> => {
    try {
      return await this.documentService.getFinalAcknowledgedState();
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

  getUnconfirmedSteps = (): readonly ProseMirrorStep[] | undefined => {
    return this.documentService.getUnconfirmedSteps();
  };

  /**
   * Used when the provider is disconnected or destroyed to prevent perpetual timers from continuously running
   */
  private clearTimers = () => {
    clearTimeout(this.presenceUpdateTimeout);
    this.participantsService.clearTimers();
  };
}
