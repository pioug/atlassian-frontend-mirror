import type AnalyticsHelper from '../analytics/analytics-helper';
import { ACK_MAX_TRY, EVENT_ACTION, EVENT_STATUS } from '../helpers/const';
import type {
  CatchupResponse,
  ReconcileResponse,
  ChannelEvent,
  StepsPayload,
} from '../types';
import type {
  SyncUpErrorFunction,
  ResolvedEditorState,
} from '@atlaskit/editor-common/collab';
import type { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform';
import type { MetadataService } from '../metadata/metadata-service';

import { getVersion, sendableSteps } from '@atlaskit/prosemirror-collab';
import type {
  CollabEvents,
  CollabInitPayload,
  StepJson,
} from '@atlaskit/editor-common/collab';

import type {
  EditorState,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { UGCFreeStepDetails } from '../helpers/utils';
import { createLogger, getStepUGCFreeDetails, sleep } from '../helpers/utils';
import throttle from 'lodash/throttle';
import { throttledCommitStep } from '../provider/commit-step';
import {
  MEASURE_NAME,
  startMeasure,
  stopMeasure,
} from '../analytics/performance';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import {
  MAX_STEP_REJECTED_ERROR,
  MAX_STEP_REJECTED_ERROR_AGGRESSIVE,
} from '../provider';
import { catchup } from './catchup';
import type { ParticipantsService } from '../participants/participants-service';
import { StepQueueState } from './step-queue-state';
import type { InternalError } from '../errors/error-types';

import {
  CantSyncUpError,
  INTERNAL_ERROR_CODE,
  UpdateDocumentError,
} from '../errors/error-types';

const CATCHUP_THROTTLE = 1 * 1000; // 1 second

const noop = () => {};

const logger = createLogger('documentService', 'black');

export class DocumentService {
  private getState: (() => EditorState) | undefined;
  // Fires analytics to editor when collab editor cannot sync up
  private onSyncUpError?: SyncUpErrorFunction;
  private stepQueue: StepQueueState;
  private stepRejectCounter: number = 0;
  private aggressiveCatchup: boolean = false;

  // ClientID is the unique ID for a prosemirror client. Used for step-rebasing.
  private clientId?: number | string;

  /**
   *
   * @param participantsService - The participants service, used when users are detected active when making changes to the document
   * and to emit their telepointers from steps they add
   * @param analyticsHelper - Helper for analytics events
   * @param fetchCatchup - Function to fetch "catchup" data, data required to rebase current steps to the latest version.
   * @param fetchReconcile - Function to call "reconcile" from NCS backend
   * @param providerEmitCallback - Callback for emitting events to listeners on the provider
   * @param broadcast - Callback for broadcasting events to other clients
   * @param getUserId - Callback to fetch the current user's ID
   * @param onErrorHandled - Callback to handle
   * @param metadataService
   * @param enableErrorOnFailedDocumentApply - Enable failed document update exceptions.
   */
  constructor(
    private participantsService: ParticipantsService,
    private analyticsHelper: AnalyticsHelper | undefined,
    private fetchCatchup: (
      fromVersion: number,
      clientId: number | string | undefined,
    ) => Promise<CatchupResponse>,
    private fetchReconcile: (
      currentStateDoc: string,
    ) => Promise<ReconcileResponse>,
    private providerEmitCallback: (evt: keyof CollabEvents, data: any) => void,
    private broadcast: <K extends keyof ChannelEvent>(
      type: K,
      data: Omit<ChannelEvent[K], 'timestamp'>,
      callback?: Function,
    ) => void,
    private getUserId: () => string | undefined,
    private onErrorHandled: (error: InternalError) => void,
    private metadataService: MetadataService,
    private enableErrorOnFailedDocumentApply: boolean = false,
  ) {
    this.stepQueue = new StepQueueState();
  }

  /**
   * To prevent calling catchup to often, use lodash throttle to reduce the frequency
   */
  throttledCatchup = throttle(() => this.catchup(), CATCHUP_THROTTLE, {
    leading: false, // TODO: why shouldn't this be leading?
    trailing: true,
  });

  /**
   * Called when:
   *   * session established(offline -> online)
   *   * try to accept steps but version is behind.
   */
  private catchup = async () => {
    const start = new Date().getTime();
    // if the queue is already paused, we are busy with something else, so don't proceed.
    if (this.stepQueue.isPaused()) {
      logger(`Queue is paused. Aborting.`);
      return;
    }
    this.stepQueue.pauseQueue();
    try {
      await catchup({
        getCurrentPmVersion: this.getCurrentPmVersion,
        fetchCatchup: this.fetchCatchup,
        getUnconfirmedSteps: this.getUnconfirmedSteps,
        filterQueue: this.stepQueue.filterQueue,
        applyLocalSteps: this.applyLocalSteps,
        updateDocument: this.updateDocument,
        updateMetadata: this.metadataService.updateMetadata,
        analyticsHelper: this.analyticsHelper,
        clientId: this.clientId,
      });
      const latency = new Date().getTime() - start;
      this.analyticsHelper?.sendActionEvent(
        EVENT_ACTION.CATCHUP,
        EVENT_STATUS.SUCCESS,
        {
          latency,
        },
      );
    } catch (error) {
      const latency = new Date().getTime() - start;
      this.analyticsHelper?.sendActionEvent(
        EVENT_ACTION.CATCHUP,
        EVENT_STATUS.FAILURE,
        {
          latency,
        },
      );
    } finally {
      this.stepQueue.resumeQueue();
      this.processQueue();
      this.sendStepsFromCurrentState(); // this will eventually retry catchup as it calls commitStep which will either catchup on onStepsAdded or onErrorHandled
      this.stepRejectCounter = 0;
    }
  };

  getCurrentPmVersion = () => {
    const state = this.getState?.();
    if (!state) {
      this.analyticsHelper?.sendErrorEvent(
        new Error('No editor state when calling ProseMirror function'),
        'getCurrentPmVersion called without state',
      );
      return 0;
    }
    return getVersion(state);
  };

  private processQueue() {
    if (this.stepQueue.isPaused()) {
      logger(`Queue is paused. Aborting.`);
      return;
    }

    logger(`Looking for processable data.`);

    if (this.stepQueue.getQueue().length > 0) {
      const firstItem = this.stepQueue.shift();
      const currentVersion = this.getCurrentPmVersion();
      const expectedVersion = currentVersion + firstItem!.steps.length;
      if (firstItem!.version === expectedVersion) {
        logger(`Applying data from queue!`);
        this.processSteps(firstItem!);
        // recur
        this.processQueue();
      }
    }
  }

  getCurrentState = async (): Promise<ResolvedEditorState> => {
    try {
      startMeasure(MEASURE_NAME.GET_CURRENT_STATE, this.analyticsHelper);

      // Convert ProseMirror document in Editor state to ADF document
      if (!this.getState?.()) {
        this.analyticsHelper?.sendErrorEvent(
          new Error('Editor state is undefined'),
          'getCurrentState called without state',
        );
      }
      const state = this.getState!();
      const adfDocument = new JSONTransformer().encode(state.doc);

      const currentState = {
        content: adfDocument,
        title: this.metadataService.getTitle(),
        stepVersion: getVersion(state),
      };

      const measure = stopMeasure(
        MEASURE_NAME.GET_CURRENT_STATE,
        this.analyticsHelper,
      );
      this.analyticsHelper?.sendActionEvent(
        EVENT_ACTION.GET_CURRENT_STATE,
        EVENT_STATUS.SUCCESS,
        {
          latency: measure?.duration,
        },
      );
      return currentState;
    } catch (error) {
      const measure = stopMeasure(
        MEASURE_NAME.GET_CURRENT_STATE,
        this.analyticsHelper,
      );
      this.analyticsHelper?.sendActionEvent(
        EVENT_ACTION.GET_CURRENT_STATE,
        EVENT_STATUS.FAILURE,
        {
          latency: measure?.duration,
        },
      );
      this.analyticsHelper?.sendErrorEvent(
        error,
        'Error while returning ADF version of current draft document',
      );
      throw error; // Reject the promise so the consumer can react to it failing
    }
  };

  private processSteps(data: StepsPayload) {
    const { version, steps } = data;
    logger(`Processing data. Version "${version}".`);

    if (steps?.length) {
      try {
        const clientIds: (string | number)[] = steps.map(
          ({ clientId }) => clientId,
        );
        this.providerEmitCallback('data', {
          json: steps,
          version,
          userIds: clientIds,
        });
        // If steps can apply to local editor successfully, no need to accumulate the error counter.
        this.stepRejectCounter = 0;
        this.participantsService.emitTelepointersFromSteps(steps);

        // Resend local steps if none of the received steps originated with us!
        if (clientIds.indexOf(this.clientId!) === -1) {
          setTimeout(() => this.sendStepsFromCurrentState(), 100);
        }
      } catch (error) {
        logger(
          `Processing steps failed with error: ${error}. Triggering catch up call.`,
        );
        this.analyticsHelper?.sendErrorEvent(
          error,
          'Error while processing steps',
        );
        this.throttledCatchup();
      }
    }
  }

  getUnconfirmedStepsOrigins = () => {
    const state = this.getState?.();
    if (!state) {
      this.analyticsHelper?.sendErrorEvent(
        new Error('No editor state when calling ProseMirror function'),
        'getUnconfirmedStepsOrigins called without state',
      );
      return;
    }
    return sendableSteps(state)?.origins;
  };

  getUnconfirmedSteps = (): readonly ProseMirrorStep[] | undefined => {
    const state = this.getState?.();
    if (!state) {
      this.analyticsHelper?.sendErrorEvent(
        new Error('No editor state when calling ProseMirror function'),
        'getUnconfirmedSteps called without state',
      );
      return;
    }
    return sendableSteps(state)?.steps;
  };

  private applyLocalSteps = (steps: readonly ProseMirrorStep[]) => {
    // Re-apply local steps
    this.providerEmitCallback('local-steps', { steps });
  };

  /**
   * Called when we receive steps from the service
   */
  onStepsAdded = (data: StepsPayload) => {
    logger(`Received steps`, { steps: data.steps, version: data.version });

    if (!data.steps) {
      logger(`No steps.. waiting..`);
      return;
    }

    try {
      const currentVersion = this.getCurrentPmVersion();
      const expectedVersion = currentVersion + data.steps.length;
      if (data.version <= currentVersion) {
        logger(`Received steps we already have. Ignoring.`);
      } else if (data.version === expectedVersion) {
        this.processSteps(data);
      } else if (data.version > expectedVersion) {
        logger(
          `Version too high. Expected "${expectedVersion}" but got "${data.version}. Current local version is ${currentVersion}.`,
        );
        this.stepQueue.queueSteps(data);
        this.throttledCatchup();
      }
      this.participantsService.updateLastActive(
        data.steps.map(({ userId }: StepJson) => userId),
      );
    } catch (stepsAddedError) {
      this.analyticsHelper?.sendErrorEvent(
        stepsAddedError,
        'Error while adding steps in the provider',
      );
      this.onErrorHandled({
        message: 'Error while adding steps in the provider',
        data: {
          status: 500, // Meaningless, remove when we review error structure
          code: INTERNAL_ERROR_CODE.ADD_STEPS_ERROR,
        },
      });
    }
  };

  // Triggered when page recovery has emitted an 'init' event on a page client is currently connected to.
  onRestore = ({ doc, version, metadata }: CollabInitPayload) => {
    // Preserve the unconfirmed steps to prevent data loss.
    const unconfirmedSteps = this.getUnconfirmedSteps();

    try {
      // Reset the editor,
      //  - Replace the document, keep in sync with the server
      //  - Replace the version number, so editor is in sync with NCS server and can commit new changes.
      //  - Replace the metadata
      //  - Reserve the cursor position, in case a cursor jump.

      this.updateDocument({
        doc,
        version,
        metadata,
        reserveCursor: true,
      });
      this.metadataService.updateMetadata(metadata);

      // Re-apply the unconfirmed steps, not 100% of them can be applied, if document is changed significantly.
      if (unconfirmedSteps?.length) {
        this.applyLocalSteps(unconfirmedSteps);
      }

      this.analyticsHelper?.sendActionEvent(
        EVENT_ACTION.REINITIALISE_DOCUMENT,
        EVENT_STATUS.SUCCESS,
        {
          numUnconfirmedSteps: unconfirmedSteps?.length,
          hasTitle: !!metadata?.title,
        },
      );
    } catch (restoreError) {
      this.analyticsHelper?.sendActionEvent(
        EVENT_ACTION.REINITIALISE_DOCUMENT,
        EVENT_STATUS.FAILURE,
        { numUnconfirmedSteps: unconfirmedSteps?.length },
      );
      this.analyticsHelper?.sendErrorEvent(
        restoreError,
        'Error while reinitialising document',
      );
      this.onErrorHandled({
        message: 'Caught error while trying to recover the document',
        data: {
          status: 500, // Meaningless, remove when we review error structure
          code: INTERNAL_ERROR_CODE.DOCUMENT_RESTORE_ERROR,
        },
      });
    }
  };

  getFinalAcknowledgedState = async (): Promise<ResolvedEditorState> => {
    this.aggressiveCatchup = true;

    try {
      startMeasure(MEASURE_NAME.PUBLISH_PAGE, this.analyticsHelper);
      let finalAcknowledgedState: ResolvedEditorState;

      try {
        await this.commitUnconfirmedSteps();
        finalAcknowledgedState = await this.getCurrentState();
      } catch (error) {
        // if fails to commit unconfirmed steps, send reconcile request to NCS BE and return the doc to CC
        const currentState = await this.getCurrentState();
        const reconcileResponse = await this.fetchReconcile(
          JSON.stringify(currentState.content),
        );
        finalAcknowledgedState = {
          content: JSON.parse(reconcileResponse.document),
          title: currentState.title,
          stepVersion: reconcileResponse.version,
        };
      }

      const measure = stopMeasure(
        MEASURE_NAME.PUBLISH_PAGE,
        this.analyticsHelper,
      );
      this.analyticsHelper?.sendActionEvent(
        EVENT_ACTION.PUBLISH_PAGE,
        EVENT_STATUS.SUCCESS,
        {
          latency: measure?.duration,
        },
      );
      this.aggressiveCatchup = false;
      return finalAcknowledgedState;
    } catch (error) {
      this.aggressiveCatchup = false;
      const measure = stopMeasure(
        MEASURE_NAME.PUBLISH_PAGE,
        this.analyticsHelper,
      );
      this.analyticsHelper?.sendActionEvent(
        EVENT_ACTION.PUBLISH_PAGE,
        EVENT_STATUS.FAILURE,
        {
          latency: measure?.duration,
        },
      );
      this.analyticsHelper?.sendErrorEvent(
        error,
        'Error while returning ADF version of the final draft document',
      );
      throw error; // Reject the promise so the consumer can react to it failing
    }
  };

  updateDocument = ({
    doc,
    version,
    metadata,
    reserveCursor,
  }: CollabInitPayload) => {
    this.providerEmitCallback('init', {
      doc,
      version,
      metadata,
      ...(reserveCursor ? { reserveCursor } : {}),
    });
    const updatedVersion = this.getCurrentPmVersion();
    if (this.getCurrentPmVersion() !== version) {
      const isDocContentValid = this.validatePMJSONDocument(doc);
      const error = new UpdateDocumentError('Failed to update the document', {
        newVersion: version,
        editorVersion: updatedVersion,
        isDocTruthy: !!doc,
        docHasContent: doc?.content?.length >= 1,
        isDocContentValid,
      });

      this.analyticsHelper?.sendErrorEvent(
        error,
        'Failed to update the document in document service',
      );
      if (this.enableErrorOnFailedDocumentApply) {
        this.onErrorHandled({
          message: 'The provider failed to apply changes to the editor',
          data: {
            code: INTERNAL_ERROR_CODE.DOCUMENT_UPDATE_ERROR,
            meta: {
              newVersion: version,
              editorVersion: updatedVersion,
            },
            status: 500,
          },
        });
        throw error;
      }
      // Otherwise just fail silently for now
    }
  };

  private validatePMJSONDocument = (doc: any) => {
    try {
      if (!this.getState?.()) {
        this.analyticsHelper?.sendErrorEvent(
          new Error('Editor state is undefined'),
          'validatePMJSONDocument called without state',
        );
      }
      const state = this.getState!();
      const content: Array<PMNode> = (doc.content || []).map((child: any) =>
        state.schema.nodeFromJSON(child),
      );
      return content.every((node) => {
        try {
          node.check(); // this will throw an error if the node is invalid
        } catch (error) {
          return false;
        }
        return true;
      });
    } catch (e) {
      return false;
    }
  };

  /**
   * Commit the unconfirmed local steps to the back-end service
   * @throws {Error} Couldn't sync the steps after retrying 30 times
   */
  commitUnconfirmedSteps = async () => {
    const unconfirmedSteps = this.getUnconfirmedSteps();
    try {
      if (unconfirmedSteps?.length) {
        startMeasure(
          MEASURE_NAME.COMMIT_UNCONFIRMED_STEPS,
          this.analyticsHelper,
        );

        let count = 0;
        // We use origins here as steps can be rebased. When steps are rebased a new step is created.
        // This means that we can not track if it has been removed from the unconfirmed array or not.
        // Origins points to the original transaction that the step was created in. This is never changed
        // and gets passed down when a step is rebased.
        const unconfirmedTrs = this.getUnconfirmedStepsOrigins();
        const lastTr = unconfirmedTrs?.[unconfirmedTrs.length - 1];
        let isLastTrConfirmed = false;

        if (!this.getState?.()) {
          this.analyticsHelper?.sendErrorEvent(
            new Error('Editor state is undefined'),
            'commitUnconfirmedSteps called without state',
          );
        }
        while (!isLastTrConfirmed) {
          this.sendStepsFromCurrentState();

          await sleep(500);

          const nextUnconfirmedSteps = this.getUnconfirmedSteps();
          if (nextUnconfirmedSteps?.length) {
            const nextUnconfirmedTrs = this.getUnconfirmedStepsOrigins();
            isLastTrConfirmed = !nextUnconfirmedTrs?.some(
              (tr) => tr === lastTr,
            );
          } else {
            isLastTrConfirmed = true;
          }

          if (!isLastTrConfirmed && count++ >= ACK_MAX_TRY) {
            if (this.onSyncUpError) {
              const state = this.getState!();

              this.onSyncUpError({
                lengthOfUnconfirmedSteps: nextUnconfirmedSteps?.length,
                tries: count,
                maxRetries: ACK_MAX_TRY,
                clientId: this.clientId,
                version: getVersion(state),
              });
            }
            const unconfirmedStepsInfoUGCRemoved:
              | UGCFreeStepDetails[]
              | undefined = this.getUnconfirmedSteps()?.map((step) =>
              getStepUGCFreeDetails(step),
            );
            const error: CantSyncUpError = new CantSyncUpError(
              "Can't sync up with Collab Service: unable to send unconfirmed steps and max retry reached",
              {
                unconfirmedStepsInfo: unconfirmedStepsInfoUGCRemoved
                  ? unconfirmedStepsInfoUGCRemoved.toString()
                  : 'Unable to generate UGC removed step info',
              },
            );
            throw error;
          }
        }

        const measure = stopMeasure(
          MEASURE_NAME.COMMIT_UNCONFIRMED_STEPS,
          this.analyticsHelper,
        );
        this.analyticsHelper?.sendActionEvent(
          EVENT_ACTION.COMMIT_UNCONFIRMED_STEPS,
          EVENT_STATUS.SUCCESS,
          {
            latency: measure?.duration,
            // upon success, emit the total number of unconfirmed steps we synced
            numUnconfirmedSteps: unconfirmedSteps?.length,
          },
        );
      }
    } catch (error) {
      const measure = stopMeasure(
        MEASURE_NAME.COMMIT_UNCONFIRMED_STEPS,
        this.analyticsHelper,
      );
      this.analyticsHelper?.sendActionEvent(
        EVENT_ACTION.COMMIT_UNCONFIRMED_STEPS,
        EVENT_STATUS.FAILURE,
        {
          latency: measure?.duration,
          numUnconfirmedSteps: unconfirmedSteps?.length,
        },
      );
      this.analyticsHelper?.sendErrorEvent(
        error,
        'Error while committing unconfirmed steps',
      );
      throw error;
    }
  };

  setup({
    getState,
    onSyncUpError,
    clientId,
  }: {
    getState: () => EditorState;
    onSyncUpError?: SyncUpErrorFunction;
    clientId: number | string | undefined;
  }): this {
    this.getState = getState;
    this.onSyncUpError = onSyncUpError || noop;
    this.clientId = clientId;
    return this;
  }

  /**
   * We can use this function to throttle/delay
   * Any send steps operation
   *
   * The getState function will return the current EditorState
   * from the EditorView.
   */
  sendStepsFromCurrentState(sendAnalyticsEvent?: boolean) {
    const state = this.getState?.();
    if (!state) {
      this.analyticsHelper?.sendErrorEvent(
        new Error('Editor state is undefined'),
        'sendStepsFromCurrentState called without state',
      );
      return;
    }

    this.send(null, null, state, sendAnalyticsEvent);
  }

  onStepRejectedError = () => {
    this.stepRejectCounter++;
    logger(`Steps rejected (tries=${this.stepRejectCounter})`);
    this.analyticsHelper?.sendActionEvent(
      EVENT_ACTION.SEND_STEPS_RETRY,
      EVENT_STATUS.INFO,
      {
        count: this.stepRejectCounter,
      },
    );
    let maxRetries = this.aggressiveCatchup
      ? MAX_STEP_REJECTED_ERROR_AGGRESSIVE
      : MAX_STEP_REJECTED_ERROR;

    if (this.stepRejectCounter >= maxRetries) {
      logger(
        `The steps were rejected too many times (tries=${this.stepRejectCounter}, limit=${MAX_STEP_REJECTED_ERROR}). Trying to catch-up.`,
      );
      this.analyticsHelper?.sendActionEvent(
        EVENT_ACTION.CATCHUP_AFTER_MAX_SEND_STEPS_RETRY,
        EVENT_STATUS.INFO,
      );
      this.throttledCatchup();
    } else {
      // If committing steps failed try again automatically in 1s
      // This makes it more likely that unconfirmed steps trigger a catch-up
      // within 15s even if there is no one editing actively (or draft sync polling)
      // reducing the risk of data loss at the expense of step commits
      setTimeout(() => this.sendStepsFromCurrentState(), 1000);
    }
  };

  /**
   * Send steps from transaction to other participants
   * It needs the superfluous arguments because we keep the interface of the send API the same as the Synchrony plugin
   */
  send(
    _tr: Transaction | null,
    _oldState: EditorState | null,
    newState: EditorState,
    sendAnalyticsEvent?: boolean,
  ) {
    const unconfirmedStepsData = sendableSteps(newState);
    const version = getVersion(newState);

    // Don't send any steps before we're ready.
    if (!unconfirmedStepsData) {
      return;
    }

    const unconfirmedSteps = unconfirmedStepsData.steps;
    // sendAnalyticsEvent is only true when buffering is enabled,
    // to ensure that analytics events with the number of unconfirmed steps is only
    // sent once on connection (as opposed to on every step)
    if (sendAnalyticsEvent) {
      this.analyticsHelper?.sendActionEvent(
        EVENT_ACTION.HAS_UNCONFIRMED_STEPS,
        EVENT_STATUS.INFO,
        {
          numUnconfirmedSteps: unconfirmedSteps?.length || 0,
        },
      );
    }

    if (!unconfirmedSteps?.length) {
      return;
    }

    // Avoid reference issues using a
    // method outside of the provider
    // scope
    throttledCommitStep({
      broadcast: this.broadcast,
      userId: this.getUserId()!,
      clientId: this.clientId!,
      steps: unconfirmedSteps,
      version,
      onStepsAdded: this.onStepsAdded,
      onErrorHandled: this.onErrorHandled,
      analyticsHelper: this.analyticsHelper,
      emit: this.providerEmitCallback,
    });
  }
}
