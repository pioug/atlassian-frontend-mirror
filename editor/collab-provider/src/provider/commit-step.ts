import countBy from 'lodash/countBy';
import { ADD_STEPS_TYPE, EVENT_ACTION, EVENT_STATUS } from '../helpers/const';
import type {
	AcknowledgementErrorPayload,
	AddStepAcknowledgementPayload,
	ChannelEvent,
	StepsPayload,
} from '../types';
import { AcknowledgementResponseTypes } from '../types';
import type { CollabEvents, StepJson } from '@atlaskit/editor-common/collab';
import type { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform';
import { NCS_ERROR_CODE } from '../errors/ncs-errors';
import { createLogger } from '../helpers/utils';
import type AnalyticsHelper from '../analytics/analytics-helper';
import type { InternalError } from '../errors/internal-errors';
import type { GetResolvedEditorStateReason } from '@atlaskit/editor-common/types';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

const logger = createLogger('commit-step', 'black');
export const RESET_READYTOCOMMIT_INTERVAL_MS = 5000;

export class CommitStepService {
	private readyToCommit: boolean;
	private lastBroadcastRequestAcked: boolean;

	/**
	 * @param broadcast - Callback for broadcasting events to other clients
	 * @param analyticsHelper - Helper for analytics events
	 * @param emit - Callback for emitting events to listeners on the provider
	 * @param onErrorHandled - Callback to handle
	 */
	constructor(
		private broadcast: <K extends keyof ChannelEvent>(
			type: K,
			data: Omit<ChannelEvent[K], 'timestamp'>,
			callback?: Function,
		) => void,
		private analyticsHelper: AnalyticsHelper | undefined,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private emit: (evt: keyof CollabEvents, data: any) => void,
		private onErrorHandled: (error: InternalError) => void,
	) {
		this.readyToCommit = true;
		this.lastBroadcastRequestAcked = true;
	}

	commitStepQueue({
		steps,
		version,
		userId,
		clientId,
		onStepsAdded,
		__livePage,
		hasRecovered,
		collabMode,
		reason,
		lockSteps,
		stepOrigins,
	}: {
		__livePage: boolean;
		clientId: number | string;
		collabMode: string;
		hasRecovered: boolean;
		lockSteps: (stepOrigins?: readonly Transaction[]) => void;
		onStepsAdded: (data: StepsPayload) => void;
		reason?: GetResolvedEditorStateReason;
		stepOrigins: readonly Transaction[];
		steps: readonly ProseMirrorStep[];
		userId: string;
		version: number;
	}): void {
		// this timer is for waiting to send the next batch in between acks from the BE
		let commitWaitTimer;
		// if publishing and not waiting for an ACK, then clear the commit timer and proceed, skipping the timer
		if (reason === 'publish' && this.lastBroadcastRequestAcked) {
			clearTimeout(commitWaitTimer);
			lockSteps();
			this.readyToCommit = true;
		}
		if (!this.readyToCommit) {
			logger('Not ready to commit, skip');
			return;
		}
		// Block other sending request, before ACK
		this.readyToCommit = false;
		this.lastBroadcastRequestAcked = false;

		// this timer is a fallback for if an ACK from BE is lost - stop the queue from getting indefinitely locked
		const fallbackTimer = setTimeout(() => {
			lockSteps();
			this.readyToCommit = true;
			this.lastBroadcastRequestAcked = true;
			logger('reset readyToCommit by timer');
		}, RESET_READYTOCOMMIT_INTERVAL_MS);

		let stepsWithClientAndUserId = steps.map((step) => ({
			...step.toJSON(),
			clientId,
			userId,
		})) as StepJson[];

		// Mutate steps to ignore expand expand/collapse changes in live pages
		// This is expected to be a temporary divergence from standard editor behaviour
		// and will be removed in Q4 when editor and live view pages align on a single
		// behaviour for expands.
		// While not recommended by the Editor content services team, this has been discussed
		// as being low risk as the expand change via a setAttrs step;
		// - doesn't impact any indexes,
		// - is setup for last write wins,
		// - and is just a boolean -- so no real risk of data loss.
		if (__livePage) {
			stepsWithClientAndUserId = stepsWithClientAndUserId.map((step: StepJson) => {
				if (this.isExpandChangeStep(step)) {
					// The title is also updated via this step, which we do want to send to the server.
					// so we strip out the __expanded attribute from the step.
					return { ...step, attrs: { title: step.attrs.title } };
				}
				return step;
			});
		}

		// tag unconfirmed steps sent after page has been recovered during client's editing session
		if (hasRecovered) {
			stepsWithClientAndUserId = stepsWithClientAndUserId.map((step: StepJson) => {
				step.metadata = { ...step.metadata, unconfirmedStepAfterRecovery: true };
				return step;
			});
		}

		if (expValEquals('platform_editor_offline_editing_web', 'isEnabled', true)) {
			stepsWithClientAndUserId = this.addOfflineMetadata(stepsWithClientAndUserId, stepOrigins);
		}

		const start = new Date().getTime();
		const ADD_STEPS_ACKNOWLEDGEMENT_ERROR_MSG =
			'Error while adding steps - Invalid Acknowledgement';
		const ADD_STEPS_BROADCAST_ERROR_MSG = 'Error while adding steps - Broadcast threw exception';
		this.emit('commit-status', { status: 'attempt', version });
		try {
			this.broadcast(
				'steps:commit',
				{
					collabMode,
					steps: stepsWithClientAndUserId,
					version,
					userId,
				},
				(response: AddStepAcknowledgementPayload) => {
					this.lastBroadcastRequestAcked = true;
					const latency = new Date().getTime() - start;
					// this most closely replicates the BE ack delay behaviour. 500ms hardcoded + 180ms network delay (tested on hello)
					// more context: https://hello.atlassian.net/wiki/spaces/CEPS/pages/5020556010/Spike+Moving+BE+delay+to+the+FE
					// to be switched over to backpressure delay sent from the BE in https://hello.jira.atlassian.cloud/browse/CEPS-1030
					let delay = latency < 680 ? 680 - latency : 1;
					if (response.delay) {
						delay = response.delay;
					} // if backpressure delay is sent, overwrite it

					clearTimeout(fallbackTimer); // clear the fallback timer, ack was successfully sent/recieved
					commitWaitTimer = setTimeout(() => {
						lockSteps();
						// unlock the queue after waiting for delay
						this.readyToCommit = true;
						logger('reset readyToCommit');
					}, delay);

					if (response.type === AcknowledgementResponseTypes.SUCCESS) {
						onStepsAdded({
							steps: stepsWithClientAndUserId,
							version: response.version,
						});
						this.sendSuccessAnalytics(latency, stepsWithClientAndUserId);
						this.emit('commit-status', {
							status: 'success',
							version: response.version,
						});
					} else if (response.type === AcknowledgementResponseTypes.ERROR) {
						this.onErrorHandled(response.error);
						this.sendFailureAnalytics(response, latency);
						this.emit('commit-status', { status: 'failure', version });
						// eslint-disable-next-line no-console
						console.error(ADD_STEPS_ACKNOWLEDGEMENT_ERROR_MSG);
					} else {
						this.analyticsHelper?.sendErrorEvent(
							// @ts-expect-error We didn't type the invalid type case
							new Error(`Response type: ${response?.type || 'No response type'}`),
							ADD_STEPS_ACKNOWLEDGEMENT_ERROR_MSG,
						);
						this.emit('commit-status', { status: 'failure', version });
						// eslint-disable-next-line no-console
						console.error(ADD_STEPS_ACKNOWLEDGEMENT_ERROR_MSG);
					}
				},
			);
		} catch (error) {
			// if the broadcast failed for any reason, we shouldn't keep the queue locked as the BE has not recieved any message
			lockSteps();
			this.readyToCommit = true;
			this.analyticsHelper?.sendErrorEvent(error, ADD_STEPS_BROADCAST_ERROR_MSG);
			this.emit('commit-status', { status: 'failure', version });
			// eslint-disable-next-line no-console
			console.error(ADD_STEPS_BROADCAST_ERROR_MSG);
		}
	}

	private isExpandChangeStep(step: StepJson): step is StepJson & { attrs: { title: string } } {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		if (step.stepType === 'setAttrs' && '__expanded' in (step as any).attrs) {
			return true;
		}
		return false;
	}

	private addOfflineMetadata(
		stepsWithClientAndUserId: StepJson[],
		origins: readonly Transaction[],
	): StepJson[] {
		if (origins.some((s) => s.getMeta('isOffline') === true || s.getMeta('wasOffline') === true)) {
			return stepsWithClientAndUserId.map((step: StepJson, idx) => {
				const origin = origins[idx];
				if (!origin) {
					return step;
				}
				const createdOffline = origin.getMeta('isOffline') || origin.getMeta('wasOffline');
				if (createdOffline === true) {
					step.metadata = { ...step.metadata, createdOffline };
				}
				return step;
			});
		}
		return stepsWithClientAndUserId;
	}

	private sendSuccessAnalytics(latency: number, stepsWithClientAndUserId: StepJson[]) {
		// Sample only 10% of add steps events to avoid overwhelming the analytics
		if (Math.random() < 0.1) {
			this.analyticsHelper?.sendActionEvent(
				EVENT_ACTION.ADD_STEPS,
				EVENT_STATUS.SUCCESS_10x_SAMPLED,
				{
					type: ADD_STEPS_TYPE.ACCEPTED,
					latency,
					stepType: countBy(
						stepsWithClientAndUserId,
						// Ignored via go/ees005
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						(stepWithClientAndUserId) => stepWithClientAndUserId.stepType!,
					),
				},
			);
		}
	}

	private sendFailureAnalytics(response: AcknowledgementErrorPayload, latency: number) {
		this.analyticsHelper?.sendActionEvent(EVENT_ACTION.ADD_STEPS, EVENT_STATUS.FAILURE, {
			// User tried committing steps but they were rejected because:
			// - HEAD_VERSION_UPDATE_FAILED: the collab service's latest stored step tail version didn't correspond to the head version of the first step submitted
			// - VERSION_NUMBER_ALREADY_EXISTS: while storing the steps there was a conflict meaning someone else wrote steps into the database more quickly
			type:
				response.error.data.code === NCS_ERROR_CODE.HEAD_VERSION_UPDATE_FAILED ||
				response.error.data.code === NCS_ERROR_CODE.VERSION_NUMBER_ALREADY_EXISTS
					? ADD_STEPS_TYPE.REJECTED
					: ADD_STEPS_TYPE.ERROR,
			latency,
		});
		this.analyticsHelper?.sendErrorEvent(
			response.error,
			'Error while adding steps - Acknowledgement Error',
		);
	}

	getReadyToCommitStatus() {
		return this.readyToCommit;
	}
}
