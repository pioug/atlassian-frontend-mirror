import throttle from 'lodash/throttle';

import type {
	ResolvedEditorState,
	SyncUpErrorFunction,
	CollabEvents,
	CollabInitPayload,
	StepJson,
} from '@atlaskit/editor-common/collab';
import { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform';
import { getCollabState, sendableSteps } from '@atlaskit/prosemirror-collab';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { Transaction } from '@atlaskit/editor-prosemirror/state';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type {
	Catchupv2Response,
	ChannelEvent,
	GenerateDiffStepsResponseBody,
	ReconcileResponse,
	ReconnectionMetadata,
	StepsPayload,
} from '../types';
import type { MetadataService } from '../metadata/metadata-service';
import { ACK_MAX_TRY, EVENT_ACTION, EVENT_STATUS, CatchupEventReason } from '../helpers/const';
import type AnalyticsHelper from '../analytics/analytics-helper';
import { MEASURE_NAME, startMeasure, stopMeasure } from '../analytics/performance';
import type { InternalError } from '../errors/internal-errors';
import { INTERNAL_ERROR_CODE } from '../errors/internal-errors';
import type { UGCFreeStepDetails } from '../helpers/utils';
import {
	createLogger,
	getDocAdfWithObfuscationFromJSON,
	getObfuscatedSteps,
	getStepUGCFreeDetails,
	sleep,
} from '../helpers/utils';
import { type ParticipantsService } from '../participants/participants-service';
import { MAX_STEP_REJECTED_ERROR, MAX_STEP_REJECTED_ERROR_AGGRESSIVE } from '../provider';
import { CommitStepService } from '../provider/commit-step';
import { CantSyncUpError, UpdateDocumentError } from '../errors/custom-errors';

import { catchupv2 } from './catchupv2';
import { StepQueueState } from './step-queue-state';
import { type DocumentServiceInterface } from './interface-document-service';
import { getConflictChanges } from './getConflictChanges';
import type { GetResolvedEditorStateReason } from '@atlaskit/editor-common/types';

const CATCHUP_THROTTLE = 1 * 1000; // 1 second

const noop = () => {};

const logger = createLogger('documentService', 'red');

/**
 *
 */
export class DocumentService implements DocumentServiceInterface {
	private getState: (() => EditorState) | undefined;
	// Fires analytics to editor when collab editor cannot sync up
	private onSyncUpError?: SyncUpErrorFunction;
	private stepQueue: StepQueueState;
	private stepRejectCounter: number = 0;
	private aggressiveCatchup: boolean = false;
	private catchUpOutofSync: boolean = false;
	private hasRecovered: boolean = false;
	private commitStepService: CommitStepService;
	private timeout: ReturnType<typeof setTimeout> | undefined;
	private timeoutExceeded: boolean = false;

	// ClientID is the unique ID for a prosemirror client. Used for step-rebasing.
	private clientId?: number | string;

	onErrorHandled: (error: InternalError) => void;
	/**
	 *
	 * @param participantsService - The participants service, used when users are detected active when making changes to the document
	 * and to emit their telepointers from steps they add
	 * @param analyticsHelper - Helper for analytics events
	 * @param fetchCatchupv2 - Step based - Function to fetch "catchupv2" data, data required to rebase current steps to the latest version.
	 * @param fetchReconcile - Function to call "reconcile" from NCS backend
	 * @param fetchGeneratedDiffSteps - Function to call "generateDiffSteps" from NCS backend
	 * @param providerEmitCallback - Callback for emitting events to listeners on the provider
	 * @param broadcast - Callback for broadcasting events to other clients
	 * @param getUserId - Callback to fetch the current user's ID
	 * @param onErrorHandled - Callback to handle
	 * @param metadataService
	 * @param isNameSpaceLocked
	 * @param enableErrorOnFailedDocumentApply - Enable failed document update exceptions.
	 * @param options.__livePage
	 * @param options
	 * @param getConnected - if the channel is currently connected
	 * @example
	 */
	constructor(
		private participantsService: ParticipantsService,
		private analyticsHelper: AnalyticsHelper | undefined,
		private fetchCatchupv2: (
			fromVersion: number,
			clientId: number | string | undefined,
			catchUpOutofSync: boolean,
		) => Promise<Catchupv2Response>,
		private fetchReconcile: (currentStateDoc: string, reason: string) => Promise<ReconcileResponse>,
		private fetchGeneratedDiffSteps: (
			currentStateDoc: string,
			reason: string,
		) => Promise<GenerateDiffStepsResponseBody>,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private providerEmitCallback: (evt: keyof CollabEvents, data: any) => void,
		private broadcast: <K extends keyof ChannelEvent>(
			type: K,
			data: Omit<ChannelEvent[K], 'timestamp'>,
			callback?: Function,
		) => void,
		private getUserId: () => string | undefined,
		onErrorHandled: (error: InternalError) => void,
		private metadataService: MetadataService,
		private isNameSpaceLocked: () => boolean,
		private enableErrorOnFailedDocumentApply: boolean = false,
		private options: { __livePage: boolean } = { __livePage: false },
		private getConnected: () => boolean,
	) {
		this.stepQueue = new StepQueueState();
		this.onErrorHandled = onErrorHandled;
		this.commitStepService = new CommitStepService(
			this.broadcast,
			this.analyticsHelper,
			this.providerEmitCallback,
			this.onErrorHandled,
		);
	}

	/**
	 * To prevent calling catchup to often, use lodash throttle to reduce the frequency
	 * @param reason - optional reason to attach.
	 */
	throttledCatchupv2 = throttle(
		(
			reason?: CatchupEventReason,
			reconnectionMetadata?: ReconnectionMetadata,
			sessionId?: string,
		) => this.catchupv2(reason, reconnectionMetadata, sessionId),
		CATCHUP_THROTTLE,
		{
			leading: false, // TODO: ED-26957 - why shouldn't this be leading?
			trailing: true,
		},
	);

	/**
	 * Called when:
	 *   * session established(offline -> online)
	 *   * try to accept steps but version is behind.
	 * @param reason - optional reason to attach.
	 * @param reconnectionMetadata
	 * @example
	 */
	private catchupv2 = async (
		reason?: CatchupEventReason,
		reconnectionMetadata?: ReconnectionMetadata,
		sessionId?: string,
	) => {
		const start = new Date().getTime();
		// if the queue is already paused, we are busy with something else, so don't proceed.
		if (this.stepQueue.isPaused()) {
			logger(`Queue is paused. Aborting.`);
			return;
		}

		/**
		 * If the database is in a transitionary state (i.e locked),
		 * it likely that another user may already be in the process of catching up.
		 *
		 * If multiple users are trying to catch up at the same time, it can lead to
		 * the database being stuck in a transitionary state due to duplicated page recovery requests.
		 * We don't wanna be stuck in a transitionary state as that will cause issues with
		 * content reconciliation and other operations.
		 */
		// check if the document is locked -> noop
		if (this.isNameSpaceLocked()) {
			logger(`catchupv2: Document is locked. Aborting.`);
			return;
		}

		this.stepQueue.pauseQueue();
		try {
			/**
			 * We have two options when out of sync:
			 * - Check a boolean that ensures we reset the document next time we catchup
			 * - Immediately catchup
			 *
			 * Immediately catching up has some complexity invovled with it - do we call catchupv2 again, fetchCatchupv2 again, or documentService.catchupV2 again?
			 * If we call either catchupv2 or documentService.catchupv2, we run the risk of creating an infinite loop of reset catchup requests.
			 * We can slow down the loop by calling throttledCatchupv2, and can add booleans that check if we're already doing a reset catchup request.
			 *
			 * But this all adds complexity that can be avoided by choosing the first option.
			 * Collab provider will already call catchup again, so this time we can ensure we call it with reset.
			 */
			this.catchUpOutofSync = await catchupv2({
				getCurrentPmVersion: this.getCurrentPmVersion,
				fetchCatchupv2: this.fetchCatchupv2,
				updateMetadata: this.metadataService.updateMetadata,
				analyticsHelper: this.analyticsHelper,
				clientId: this.clientId,
				onStepsAdded: this.onStepsAdded,
				catchUpOutofSync: this.catchUpOutofSync,
				reason,
				sessionId,
				onCatchupComplete: (steps) => {
					// We want to capture the number of steps made while offline vs. online
					if (reason === CatchupEventReason.RECONNECTED) {
						this.analyticsHelper?.sendActionEvent(EVENT_ACTION.RECONNECTION, EVENT_STATUS.INFO, {
							...reconnectionMetadata,
							remoteStepsLength: steps?.length ?? 0,
						});
						this.notifyReconnectionConflict(steps);
					}
				},
				getState: this.getState,
			});
			const latency = new Date().getTime() - start;
			this.analyticsHelper?.sendActionEvent(EVENT_ACTION.CATCHUP, EVENT_STATUS.SUCCESS, {
				latency,
				version: this.getCurrentPmVersion(),
			});
		} catch (error) {
			const latency = new Date().getTime() - start;
			// Skip client side errors; TypeErrors are client side errors https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch
			if (fg('platform_collab_do_not_client_error_log')) {
				const errorMessage = error instanceof Error ? error.message : String(error);
				if (!errorMessage.includes('TypeError') && !(error instanceof TypeError)) {
					this.analyticsHelper?.sendActionEvent(EVENT_ACTION.CATCHUP, EVENT_STATUS.FAILURE, {
						latency,
						reason,
						unconfirmedStepsLength: reconnectionMetadata?.unconfirmedStepsLength,
						disconnectionPeriodSeconds: reconnectionMetadata?.disconnectionPeriodSeconds,
					});
				}
			} else {
				this.analyticsHelper?.sendActionEvent(EVENT_ACTION.CATCHUP, EVENT_STATUS.FAILURE, {
					latency,
					reason,
					unconfirmedStepsLength: reconnectionMetadata?.unconfirmedStepsLength,
					disconnectionPeriodSeconds: reconnectionMetadata?.disconnectionPeriodSeconds,
				});
			}
		} finally {
			this.stepQueue.resumeQueue();
			this.processQueue();
			this.sendStepsFromCurrentState(); // this will eventually retry catchup as it calls throttledCommitStep which will either catchup on onStepsAdded or onErrorHandled
			this.stepRejectCounter = 0;
		}
	};

	private getVersionFromCollabState(state: EditorState, resource: string) {
		const collabState = getCollabState(state);
		if (!collabState) {
			this.analyticsHelper?.sendErrorEvent(
				new Error('No collab state when calling ProseMirror function'),
				`${resource} called without collab state`,
			);
			return 0;
		}

		// This should not happen in usual, just add error event in case it happens
		if (collabState.version === undefined) {
			this.analyticsHelper?.sendErrorEvent(
				new Error('Collab state missing version info when calling ProseMirror function'),
				`${resource} called with collab state missing version info`,
			);
			return 0;
		}

		return collabState.version;
	}

	getCurrentPmVersion = () => {
		const state = this.getState?.();
		if (!state) {
			this.analyticsHelper?.sendErrorEvent(
				new Error('No editor state when calling ProseMirror function'),
				'getCurrentPmVersion called without state',
			);
			return 0;
		}

		return this.getVersionFromCollabState(state, 'collab-provider: getCurrentPmVersion');
	};

	/**
	 * In the event we reconnect check if we have existing unconfirmed steps and if so
	 * notify the editor that we have a potential conflict to resolve on the frontend.
	 *
	 * @param data remote steps payload
	 * @param steps
	 * @example
	 */
	private notifyReconnectionConflict(steps: StepsPayload['steps']) {
		if (editorExperiment('platform_editor_offline_editing_web', false)) {
			return;
		}
		const state = this.getState?.();
		const unconfirmedSteps = state ? getCollabState(state)?.unconfirmed : undefined;
		if (steps.length > 0 && state && unconfirmedSteps && unconfirmedSteps.length > 0) {
			const { schema, tr } = state;
			const remoteSteps = steps.map((s) => ProseMirrorStep.fromJSON(schema, s));

			const conflicts = getConflictChanges({
				localSteps: unconfirmedSteps,
				remoteSteps,
				tr,
			});

			if (conflicts.deleted.length > 0 || conflicts.inserted.length > 0) {
				this.providerEmitCallback('data:conflict', {
					offlineDoc: state.doc,
					...conflicts,
				});
			}
		}
	}

	private processQueue() {
		if (this.stepQueue.isPaused()) {
			logger(`Queue is paused. Aborting.`);
			return;
		}

		logger(`Looking for processable data.`);

		if (this.stepQueue.getQueue().length > 0) {
			const firstItem = this.stepQueue.shift();
			const currentVersion = this.getCurrentPmVersion();
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const expectedVersion = currentVersion + firstItem!.steps.length;
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			if (firstItem!.version === expectedVersion) {
				logger(`Applying data from queue!`);
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				this.processSteps(firstItem!);
				// recur
				this.processQueue();
			}
		}
	}

	// Ignored via go/ees005
	// eslint-disable-next-line require-await
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
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const state = this.getState!();
			const adfDocument = new JSONTransformer().encode(state.doc);
			const version = this.getVersionFromCollabState(state, 'collab-provider: getCurrentState');

			const currentState = {
				content: adfDocument,
				title: this.metadataService.getTitle(),
				stepVersion: version,
			};

			const measure = stopMeasure(MEASURE_NAME.GET_CURRENT_STATE, this.analyticsHelper);
			this.analyticsHelper?.sendActionEvent(EVENT_ACTION.GET_CURRENT_STATE, EVENT_STATUS.SUCCESS, {
				latency: measure?.duration,
			});
			return currentState;
		} catch (error) {
			const measure = stopMeasure(MEASURE_NAME.GET_CURRENT_STATE, this.analyticsHelper);
			this.analyticsHelper?.sendActionEvent(EVENT_ACTION.GET_CURRENT_STATE, EVENT_STATUS.FAILURE, {
				latency: measure?.duration,
			});
			this.analyticsHelper?.sendErrorEvent(
				error,
				'Error while returning ADF version of current draft document',
			);
			throw error; // Reject the promise so the consumer can react to it failing
		}
	};

	private isStepsFromNewClientIdForSameUserId = (steps: StepJson[]) => {
		try {
			if (!Array.isArray(steps) || steps.length === 0) {
				return false;
			}
			const clientIds = new Set(steps.map(({ clientId }) => clientId));
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			if (!clientIds.has(this.clientId!)) {
				const userIds = new Set(steps.map(({ userId }) => userId));
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				if (userIds.has(this.getUserId()!)) {
					return true;
				}
			}
			return false;
		} catch (err) {
			this.analyticsHelper?.sendErrorEvent(
				err,
				'Error while checking for new clientId for same userId in steps',
			);
			return false;
		}
	};

	private processSteps(data: StepsPayload) {
		const { version, steps } = data;
		logger(`Processing data. Version "${version}".`);

		if (steps?.length) {
			try {
				const clientIds: (string | number)[] = steps.map(({ clientId }) => clientId);
				this.providerEmitCallback('data', {
					json: steps,
					version,
					userIds: clientIds,
				});
				// If steps can apply to local editor successfully, no need to accumulate the error counter.
				this.stepRejectCounter = 0;
				this.participantsService.emitTelepointersFromSteps(steps);

				// Resend local steps if none of the received steps originated with us!
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				if (clientIds.indexOf(this.clientId!) === -1) {
					setTimeout(() => this.sendStepsFromCurrentState(), 100);
				}
				this.analyticsHelper?.sendActionEvent(EVENT_ACTION.PROCESS_STEPS, EVENT_STATUS.SUCCESS);
			} catch (error) {
				// ESS-6421: log if error processing steps when there are steps from the same userId but not the same clientId
				const userIdMatch = this.isStepsFromNewClientIdForSameUserId(steps);
				logger(`Processing steps failed with error: ${error}. Triggering catch up call.`);
				this.analyticsHelper?.sendErrorEvent(
					error,
					userIdMatch
						? `Error while processing steps with new clientId`
						: `Error while processing steps`,
				);

				this.throttledCatchupv2(CatchupEventReason.PROCESS_STEPS);
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
	 * @param data
	 * @example
	 */
	onStepsAdded = (data: StepsPayload) => {
		logger(`Received steps`, { steps: data.steps, version: data.version });

		if (!data.steps) {
			logger(`No steps.. waiting..`);
			return;
		}

		const ADD_STEPS_PROVIDER_ERROR_MSG = 'Error while adding steps in the provider';
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

				this.throttledCatchupv2(CatchupEventReason.STEPS_ADDED);
			}
			this.participantsService.updateLastActive(data.steps.map(({ userId }: StepJson) => userId));
		} catch (stepsAddedError) {
			this.analyticsHelper?.sendErrorEvent(stepsAddedError, ADD_STEPS_PROVIDER_ERROR_MSG);
			this.onErrorHandled({
				message: ADD_STEPS_PROVIDER_ERROR_MSG,
				data: {
					status: 500, // Meaningless, remove when we review error structure
					code: INTERNAL_ERROR_CODE.ADD_STEPS_ERROR,
				},
			});
			// eslint-disable-next-line no-console
			console.error(ADD_STEPS_PROVIDER_ERROR_MSG);
		}
	};

	obfuscateStepsAndState = (
		unconfirmedSteps: readonly ProseMirrorStep[] | undefined,
		currentState?: ResolvedEditorState<JSONDocNode>,
	) => {
		let obfuscatedSteps;
		try {
			obfuscatedSteps = unconfirmedSteps
				? getObfuscatedSteps(unconfirmedSteps.map((pmStep) => pmStep.toJSON()))
				: 'None';
		} catch (error) {
			// Note that we do not log this error immediately - this string will be logged later.
			// This avoids double logging and keeps this function pure.
			obfuscatedSteps = 'Failed to obfuscate steps';
		}

		let obfuscatedDoc;
		if (currentState) {
			try {
				obfuscatedDoc = getDocAdfWithObfuscationFromJSON(currentState.content);
			} catch (error) {
				obfuscatedDoc = 'Failed to obfuscate doc';
			}
		}

		return { obfuscatedSteps, obfuscatedDoc };
	};

	// Triggered when page recovery has emitted an 'init' event on a page client is currently connected to.
	onRestore = async ({ doc, version, metadata, targetClientId }: CollabInitPayload) => {
		if (!targetClientId) {
			this.hasRecovered = true;
		}
		if (targetClientId && this.clientId !== targetClientId) {
			return;
		}
		// We preserve these as they will be lost apon this.updateDocument. This is because we are using document recovery.
		// We can then reconcile the document with the preserved state.
		const unconfirmedSteps = this.getUnconfirmedSteps();
		const currentState = await this.getCurrentState();
		let useReconcile = Boolean(unconfirmedSteps?.length && currentState && !targetClientId);

		const { obfuscatedSteps, obfuscatedDoc } = this.obfuscateStepsAndState(
			unconfirmedSteps,
			currentState,
		);

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
				caller: 'onRestore',
			});
			this.metadataService.updateMetadata(metadata);

			try {
				this.analyticsHelper?.sendActionEvent(
					EVENT_ACTION.REINITIALISE_DOCUMENT,
					EVENT_STATUS.INFO,
					{
						numUnconfirmedSteps: unconfirmedSteps?.length,
						obfuscatedSteps,
						obfuscatedDoc,
						hasTitle: !!metadata?.title,
						clientId: this.clientId,
						targetClientId,
						triggeredByCatchup: !!targetClientId,
					},
				);
				if (unconfirmedSteps?.length) {
					this.applyLocalSteps(unconfirmedSteps);
				}
			} catch (applyLocalStepsError) {
				// Extract generatedSteps from fetchReconcile response
				// and apply them to the editor state.
				this.onErrorHandled({
					message: `Content synced with your team's edits. You may want to check for conflicting edits that could override your changes.`,
					data: {
						code: INTERNAL_ERROR_CODE.OUT_OF_SYNC_CLIENT_DATA_LOSS_EVENT,
						meta: {
							reason: 'fe-restore-fetch-generated-steps',
						},
					},
				});
				useReconcile = false;
				try {
					const generatedDiffStepsResponse = await this.fetchGeneratedDiffSteps(
						JSON.stringify(currentState.content),
						'fe-restore-fetch-generated-steps',
					);
					const { generatedSteps } = generatedDiffStepsResponse;
					const state = this.getState?.();

					if (state?.schema) {
						const stepsToBeApplied = generatedSteps?.map((s) =>
							ProseMirrorStep.fromJSON(state.schema, s),
						);
						if (stepsToBeApplied && stepsToBeApplied.length > 0) {
							this.analyticsHelper?.sendActionEvent(
								EVENT_ACTION.REINITIALISE_DOCUMENT,
								EVENT_STATUS.INFO,
								{
									stepsCount: stepsToBeApplied.length,
								},
							);
							this.applyLocalSteps(stepsToBeApplied);
						} else {
							this.analyticsHelper?.sendActionEvent(
								EVENT_ACTION.REINITIALISE_DOCUMENT,
								EVENT_STATUS.INFO,
								{ reason: 'fetchGeneratedDiffSteps returned no steps' },
							);
						}
					}
				} catch (reconcileError) {
					this.analyticsHelper?.sendErrorEvent(
						reconcileError,
						`Error fetchGeneratedDiffSteps with steps-only mode`,
					);
				}
			}

			this.analyticsHelper?.sendActionEvent(
				EVENT_ACTION.REINITIALISE_DOCUMENT,
				EVENT_STATUS.SUCCESS,
				{
					numUnconfirmedSteps: unconfirmedSteps?.length,
					hasTitle: !!metadata?.title,
					useReconcile,
					clientId: this.clientId,
					targetClientId,
					triggeredByCatchup: !!targetClientId,
				},
			);
		} catch (restoreError) {
			this.analyticsHelper?.sendActionEvent(
				EVENT_ACTION.REINITIALISE_DOCUMENT,
				EVENT_STATUS.FAILURE,
				{
					numUnconfirmedSteps: unconfirmedSteps?.length,
					useReconcile,
					clientId: this.clientId,
					targetClientId,
					triggeredByCatchup: !!targetClientId,
				},
			);
			this.analyticsHelper?.sendErrorEvent(
				restoreError,
				`Error while reinitialising document. Use Reconcile: ${useReconcile}`,
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

	getFinalAcknowledgedState = async (
		reason: GetResolvedEditorStateReason,
	): Promise<ResolvedEditorState> => {
		this.aggressiveCatchup = true;

		try {
			startMeasure(MEASURE_NAME.PUBLISH_PAGE, this.analyticsHelper);
			let finalAcknowledgedState: ResolvedEditorState;

			try {
				await this.commitUnconfirmedSteps(reason);
				finalAcknowledgedState = await this.getCurrentState();
			} catch (error) {
				// if fails to commit unconfirmed steps, send reconcile request to NCS BE and return the doc to CC
				const currentState = await this.getCurrentState();
				const reconcileResponse = await this.fetchReconcile(
					JSON.stringify(currentState.content),
					'fe-final-ack',
				);
				finalAcknowledgedState = {
					content: JSON.parse(reconcileResponse.document),
					title: currentState.title,
					stepVersion: reconcileResponse.version,
				};
			}

			const measure = stopMeasure(MEASURE_NAME.PUBLISH_PAGE, this.analyticsHelper);
			this.analyticsHelper?.sendActionEvent(EVENT_ACTION.PUBLISH_PAGE, EVENT_STATUS.SUCCESS, {
				latency: measure?.duration,
			});
			this.aggressiveCatchup = false;
			return finalAcknowledgedState;
		} catch (error) {
			this.aggressiveCatchup = false;
			const measure = stopMeasure(MEASURE_NAME.PUBLISH_PAGE, this.analyticsHelper);
			this.analyticsHelper?.sendActionEvent(EVENT_ACTION.PUBLISH_PAGE, EVENT_STATUS.FAILURE, {
				latency: measure?.duration,
			});
			this.analyticsHelper?.sendErrorEvent(
				error,
				'Error while returning ADF version of the final draft document',
			);
			throw error; // Reject the promise so the consumer can react to it failing
		}
	};

	/**
	 *
	 * @example
	 */
	getIsNamespaceLocked(): boolean {
		return this.isNameSpaceLocked();
	}

	updateDocument = ({ doc, version, metadata, reserveCursor, caller }: CollabInitPayload) => {
		this.providerEmitCallback('init', {
			doc,
			version,
			metadata,
			...(reserveCursor ? { reserveCursor } : {}),
		});
		this.updateDocumentAnalytics(doc, version, caller);
	};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private updateDocumentAnalytics = (doc: any, version: number, caller?: string) => {
		const updatedVersion = this.getCurrentPmVersion();
		const isDocContentValid = this.validatePMJSONDocument(doc);
		// ESS-5023: only emit error event if updated client version is still behind server version
		// client version could become higher than server version due to user editing or plugin adding steps
		if (updatedVersion < version) {
			const error = new UpdateDocumentError('Failed to update the document', {
				newVersion: version,
				editorVersion: updatedVersion,
				isDocTruthy: !!doc,
				docHasContent: doc?.content?.length >= 1,
				isDocContentValid,
				caller,
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
		} else {
			this.analyticsHelper?.sendActionEvent(EVENT_ACTION.UPDATE_DOCUMENT, EVENT_STATUS.SUCCESS, {
				newVersion: version,
				editorVersion: updatedVersion,
				isDocTruthy: !!doc,
				docHasContent: doc?.content?.length >= 1,
				isDocContentValid,
			});
		}
	};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private validatePMJSONDocument = (doc: any) => {
		try {
			if (!this.getState?.()) {
				this.analyticsHelper?.sendErrorEvent(
					new Error('Editor state is undefined'),
					'validatePMJSONDocument called without state',
				);
			}
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const state = this.getState!();
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
	 * @param reason
	 * @throws {Error} Couldn't sync the steps after retrying 30 times
	 * @example
	 */
	commitUnconfirmedSteps = async (reason: GetResolvedEditorStateReason) => {
		const unconfirmedSteps = this.getUnconfirmedSteps();
		try {
			if (unconfirmedSteps?.length) {
				startMeasure(MEASURE_NAME.COMMIT_UNCONFIRMED_STEPS, this.analyticsHelper);

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
					// this makes all commitUnconfirmedSteps skip the waiting time, which means draft-sync is sped up too.
					this.sendStepsFromCurrentState(undefined, 'publish');

					await sleep(500);

					const nextUnconfirmedSteps = this.getUnconfirmedSteps();
					if (nextUnconfirmedSteps?.length) {
						const nextUnconfirmedTrs = this.getUnconfirmedStepsOrigins();
						isLastTrConfirmed = !nextUnconfirmedTrs?.some((tr) => tr === lastTr);
					} else {
						isLastTrConfirmed = true;
					}

					if (!isLastTrConfirmed && count++ >= ACK_MAX_TRY) {
						if (this.onSyncUpError) {
							// Ignored via go/ees005
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							const state = this.getState!();
							const version = this.getVersionFromCollabState(
								state,
								'collab-provider: commitUnconfirmedSteps',
							);

							this.onSyncUpError({
								lengthOfUnconfirmedSteps: nextUnconfirmedSteps?.length,
								tries: count,
								maxRetries: ACK_MAX_TRY,
								clientId: this.clientId,
								version,
							});
						}
						const unconfirmedStepsInfoUGCRemoved: UGCFreeStepDetails[] | undefined =
							this.getUnconfirmedSteps()?.map((step) => getStepUGCFreeDetails(step));
						const error: CantSyncUpError = new CantSyncUpError(
							"Can't sync up with Collab Service: unable to send unconfirmed steps and max retry reached",
							{
								unconfirmedStepsInfo: unconfirmedStepsInfoUGCRemoved
									? JSON.stringify(unconfirmedStepsInfoUGCRemoved)
									: 'Unable to generate UGC removed step info',
							},
						);
						throw error;
					}
				}

				const measure = stopMeasure(MEASURE_NAME.COMMIT_UNCONFIRMED_STEPS, this.analyticsHelper);
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
			const measure = stopMeasure(MEASURE_NAME.COMMIT_UNCONFIRMED_STEPS, this.analyticsHelper);
			this.analyticsHelper?.sendActionEvent(
				EVENT_ACTION.COMMIT_UNCONFIRMED_STEPS,
				EVENT_STATUS.FAILURE,
				{
					latency: measure?.duration,
					numUnconfirmedSteps: unconfirmedSteps?.length,
				},
			);
			this.analyticsHelper?.sendErrorEvent(error, 'Error while committing unconfirmed steps');
			throw error;
		}
	};

	/**
	 *
	 * @param root0
	 * @param root0.getState
	 * @param root0.onSyncUpError
	 * @param root0.clientId
	 * @example
	 */
	setup({
		getState,
		onSyncUpError,
		clientId,
	}: {
		clientId: number | string | undefined;
		getState: () => EditorState;
		onSyncUpError?: SyncUpErrorFunction;
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
	 * @param sendAnalyticsEvent
	 * @param reason
	 * @example
	 */
	sendStepsFromCurrentState(sendAnalyticsEvent?: boolean, reason?: GetResolvedEditorStateReason) {
		const state = this.getState?.();
		if (!state) {
			this.analyticsHelper?.sendErrorEvent(
				new Error('Editor state is undefined'),
				'sendStepsFromCurrentState called without state',
			);
			return;
		}

		this.send(null, null, state, sendAnalyticsEvent, reason);
	}

	onStepRejectedError = () => {
		this.stepRejectCounter++;
		logger(`Steps rejected (tries=${this.stepRejectCounter})`);
		this.analyticsHelper?.sendActionEvent(EVENT_ACTION.SEND_STEPS_RETRY, EVENT_STATUS.INFO, {
			count: this.stepRejectCounter,
		});
		const maxRetries = this.aggressiveCatchup
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

			this.throttledCatchupv2(CatchupEventReason.STEPS_REJECTED);
		} else {
			// If committing steps failed try again automatically in 1s
			// This makes it more likely that unconfirmed steps trigger a catch-up
			// within 15s even if there is no one editing actively (or draft sync polling)
			// reducing the risk of data loss at the expense of step commits
			setTimeout(() => this.sendStepsFromCurrentState(), 1000);
		}
	};

	/**
	 * If we are going to commit unconfirmed steps
	 * we need to lock them to ensure they don't get
	 * mutated in: `packages/editor/editor-plugin-collab-edit/src/pm-plugins/mergeUnconfirmed.ts`
	 */
	lockSteps = () => {
		if (
			editorExperiment('platform_editor_offline_editing_web', true) ||
			expValEquals('platform_editor_enable_single_player_step_merging', 'isEnabled', true)
		) {
			const currentState = this.getState?.();
			if (currentState) {
				this.lockStepOrigins(sendableSteps(currentState)?.origins ?? []);
			}
		}
	};

	lockStepOrigins = (origins: readonly Transaction[] | undefined) => {
		origins?.forEach((origin) => {
			if (origin instanceof Transaction) {
				return origin.setMeta('mergeIsLocked', true);
			}
		});
	};

	/**
	 * Send steps from transaction to other participants
	 * It needs the superfluous arguments because we keep the interface of the send API the same as the Synchrony plugin
	 * @param tr
	 * @param _oldState
	 * @param newState
	 * @param sendAnalyticsEvent
	 * @param reason
	 * @example
	 */
	send(
		tr: Transaction | null,
		_oldState: EditorState | null,
		_newState: EditorState,
		sendAnalyticsEvent?: boolean,
		reason?: GetResolvedEditorStateReason, // only used for publish and draft-sync events - when called through getFinalAcknowledgedState
	) {
		const offlineEditingEnabled = editorExperiment('platform_editor_offline_editing_web', true);
		const onlineStepMergingEnabled = expValEquals(
			'platform_editor_enable_single_player_step_merging',
			'isEnabled',
			true,
		);
		// We don't trust `_newState` not to be stale
		// ED-29051 - the `onEditorViewStateUpdated` can have a stale state in edge cases. We need
		// to always ensure we're sending the latest state and unconfirmed steps so we use the state
		// from editorView directly (via getState).
		const newState = onlineStepMergingEnabled ? (this.getState?.() ?? _newState) : _newState;

		// Don't send any steps before we're ready.
		if (offlineEditingEnabled || onlineStepMergingEnabled) {
			const enableOnlineStepMerging =
				onlineStepMergingEnabled && !this.commitStepService.getReadyToCommitStatus();

			if (!this.getConnected() || enableOnlineStepMerging) {
				return;
			}
		}
		const unconfirmedStepsData = sendableSteps(newState);
		const version = this.getVersionFromCollabState(newState, 'collab-provider: send');
		if (!unconfirmedStepsData) {
			return;
		}
		if (offlineEditingEnabled || onlineStepMergingEnabled) {
			this.lockStepOrigins(unconfirmedStepsData.origins);
		}

		const unconfirmedSteps = unconfirmedStepsData.steps;
		// sendAnalyticsEvent is only true when buffering is enabled,
		// to ensure that analytics events with the number of unconfirmed steps is only
		// sent once on connection (as opposed to on every step)
		if (sendAnalyticsEvent) {
			this.analyticsHelper?.sendActionEvent(EVENT_ACTION.HAS_UNCONFIRMED_STEPS, EVENT_STATUS.INFO, {
				numUnconfirmedSteps: unconfirmedSteps?.length || 0,
			});
		}

		if (!unconfirmedSteps?.length) {
			return;
		}

		const rebased = tr?.getMeta('rebasedData');

		if (rebased) {
			const obfuscatedUnconfirmedSteps = this.obfuscateStepsAndState(
				rebased.unconfirmedSteps,
			).obfuscatedSteps;
			const obfuscatedRemoteSteps = this.obfuscateStepsAndState(rebased.remoteSteps);
			const obfuscatedRebasedSteps = this.obfuscateStepsAndState(unconfirmedSteps).obfuscatedSteps;
			// send analtyics on unconfirmed steps
			this.analyticsHelper?.sendActionEvent(EVENT_ACTION.STEPS_REBASED, EVENT_STATUS.INFO, {
				obfuscatedUnconfirmedSteps,
				obfuscatedRemoteSteps,
				obfuscatedRebasedSteps,
				clientID: this.clientId,
				userId: this.getUserId(),
				versionBefore: rebased.versionBefore,
				versionAfter: version,
			});
		}

		if (editorExperiment('platform_editor_offline_editing_web', true)) {
			const containsOfflineSteps = unconfirmedStepsData?.origins.some((tr) => {
				return tr instanceof Transaction ? (tr.getMeta('isOffline') ?? false) : false;
			});

			if (containsOfflineSteps && !this.timeoutExceeded) {
				// Only start timer if we're online and don't already have one running
				if (this.getConnected() && !this.timeout) {
					this.timeout = setTimeout(() => {
						// If the timer expires and we're still online, handle the offline steps.
						// Otherwise, clear the timer so it can restart when we're online again.
						if (this.getConnected()) {
							this.timeoutExceeded = true;

							const updatedUnconfirmedStepsData = sendableSteps(newState);
							updatedUnconfirmedStepsData?.origins.forEach((origin) => {
								if (origin instanceof Transaction && origin.getMeta('isOffline')) {
									origin.setMeta('isOffline', false);
								}
							});
						} else {
							this.timeout = undefined;
						}
					}, 6000);
				}
				return;
			} else if (this.timeoutExceeded) {
				this.timeoutExceeded = false;
				if (this.timeout) {
					clearTimeout(this.timeout);
					this.timeout = undefined;
				}
			}
		}

		// Avoid reference issues using a
		// method outside of the provider
		// scope
		this.commitStepService.commitStepQueue({
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			userId: this.getUserId()!,
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			clientId: this.clientId!,
			steps: unconfirmedSteps,
			version,
			onStepsAdded: this.onStepsAdded,
			__livePage: this.options.__livePage,
			hasRecovered: this.hasRecovered,
			collabMode: this.participantsService.getCollabMode(),
			reason,
			lockSteps: this.lockSteps,
			stepOrigins: unconfirmedStepsData.origins,
		});
	}
}
