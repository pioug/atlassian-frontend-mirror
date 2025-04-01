import countBy from 'lodash/countBy';
import { fg } from '@atlaskit/platform-feature-flags';
import FeatureGates from '@atlaskit/feature-gate-js-client';
import { ADD_STEPS_TYPE, EVENT_ACTION, EVENT_STATUS } from '../helpers/const';
import type {
	AcknowledgementErrorPayload,
	AddStepAcknowledgementPayload,
	ChannelEvent,
	StepsPayload,
} from '../types';
import { AcknowledgementResponseTypes } from '../types';
import type {
	CollabCommitStatusEventPayload,
	CollabEvents,
	StepJson,
} from '@atlaskit/editor-common/collab';
import type { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform';
import { NCS_ERROR_CODE } from '../errors/ncs-errors';
import { createLogger } from '../helpers/utils';
import type AnalyticsHelper from '../analytics/analytics-helper';
import type { InternalError } from '../errors/internal-errors';
import type { GetResolvedEditorStateReason } from '@atlaskit/editor-common/types';

const logger = createLogger('commit-step', 'black');

export let readyToCommit = true;
export let lastBroadcastRequestAcked = true;
export const RESET_READYTOCOMMIT_INTERVAL_MS = 5000;

export const commitStepQueue = ({
	broadcast,
	steps,
	version,
	userId,
	clientId,
	onStepsAdded,
	onErrorHandled,
	analyticsHelper,
	emit,
	__livePage,
	hasRecovered,
	collabMode,
	reason,
	numberOfStepCommitsSent,
	setNumberOfCommitsSent,
}: {
	broadcast: <K extends keyof ChannelEvent>(
		type: K,
		data: Omit<ChannelEvent[K], 'timestamp'>,
		callback?: Function,
	) => void;
	steps: readonly ProseMirrorStep[];
	version: number;
	userId: string;
	clientId: number | string;
	onStepsAdded: (data: StepsPayload) => void;
	onErrorHandled: (error: InternalError) => void;
	analyticsHelper?: AnalyticsHelper;
	emit: (evt: keyof CollabEvents, data: CollabCommitStatusEventPayload) => void;
	__livePage: boolean;
	hasRecovered: boolean;
	collabMode: string;
	reason?: GetResolvedEditorStateReason;
	numberOfStepCommitsSent: number;
	setNumberOfCommitsSent: (steps: number) => void;
}) => {
	// this timer is for waiting to send the next batch in between acks from the BE
	let commitWaitTimer;
	// if publishing and not waiting for an ACK, then clear the commit timer and proceed, skipping the timer
	if (reason === 'publish' && lastBroadcastRequestAcked) {
		if (fg('skip_collab_provider_delay_on_publish')) {
			clearTimeout(commitWaitTimer);
			readyToCommit = true;
		} // no-op if fg is turned off
	}
	if (!readyToCommit) {
		logger('Not ready to commit, skip');
		return;
	}
	// Block other sending request, before ACK
	readyToCommit = false;
	lastBroadcastRequestAcked = false;

	// this timer is a fallback for if an ACK from BE is lost - stop the queue from getting indefinitely locked
	const fallbackTimer = setTimeout(() => {
		readyToCommit = true;
		lastBroadcastRequestAcked = true;
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
	if (__livePage && fg('platform.editor.live-pages-expand-divergence')) {
		stepsWithClientAndUserId = stepsWithClientAndUserId.map((step: StepJson) => {
			if (isExpandChangeStep(step)) {
				// The title is also updated via this step, which we do want to send to the server.
				// so we strip out the __expanded attribute from the step.
				return { ...step, attrs: { title: step.attrs.title } };
			}
			return step;
		});
	}

	// tag unconfirmed steps sent after page has been recovered during client's editing session
	if (hasRecovered && fg('tag_unconfirmed_steps_after_recovery')) {
		stepsWithClientAndUserId = stepsWithClientAndUserId.map((step: StepJson) => {
			step.metadata = { ...step.metadata, unconfirmedStepAfterRecovery: true };
			return step;
		});
	}

	const start = new Date().getTime();
	emit('commit-status', { status: 'attempt', version });
	try {
		const n =
			FeatureGates.getExperimentValue('platform_editor_step_validation_on_connect', 'steps', 0) ??
			0;
		const isExperimentEnabled = n > 0;
		// skip validation if FG is on and we have already sent n steps, or if FG is off
		const skipValidation = isExperimentEnabled ? numberOfStepCommitsSent >= n : true;
		broadcast(
			'steps:commit',
			{
				collabMode,
				steps: stepsWithClientAndUserId,
				version,
				userId,
				skipValidation,
			},
			(response: AddStepAcknowledgementPayload) => {
				lastBroadcastRequestAcked = true;
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
					// unlock the queue after waiting for delay
					readyToCommit = true;
					logger('reset readyToCommit');
				}, delay);

				if (response.type === AcknowledgementResponseTypes.SUCCESS) {
					onStepsAdded({
						steps: stepsWithClientAndUserId,
						version: response.version,
					});
					sendSuccessAnalytics(latency, stepsWithClientAndUserId, analyticsHelper);
					emit('commit-status', {
						status: 'success',
						version: response.version,
					});
				} else if (response.type === AcknowledgementResponseTypes.ERROR) {
					onErrorHandled(response.error);
					sendFailureAnalytics(response, latency, analyticsHelper);
					emit('commit-status', { status: 'failure', version });
				} else {
					analyticsHelper?.sendErrorEvent(
						// @ts-expect-error We didn't type the invalid type case
						new Error(`Response type: ${response?.type || 'No response type'}`),
						'Error while adding steps - Invalid Acknowledgement',
					);
					emit('commit-status', { status: 'failure', version });
				}
			},
		);

		if (isExperimentEnabled && numberOfStepCommitsSent < n) {
			setNumberOfCommitsSent(numberOfStepCommitsSent + 1);
		}
	} catch (error) {
		// if the broadcast failed for any reason, we shouldn't keep the queue locked as the BE has not recieved any message
		readyToCommit = true;
		analyticsHelper?.sendErrorEvent(error, 'Error while adding steps - Broadcast threw exception');
		emit('commit-status', { status: 'failure', version });
	}
};

function isExpandChangeStep(step: StepJson): step is StepJson & { attrs: { title: string } } {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	if (step.stepType === 'setAttrs' && '__expanded' in (step as any).attrs) {
		return true;
	}
	return false;
}

function sendSuccessAnalytics(
	latency: number,
	stepsWithClientAndUserId: StepJson[],
	analyticsHelper?: AnalyticsHelper,
) {
	// Sample only 10% of add steps events to avoid overwhelming the analytics
	if (Math.random() < 0.1) {
		analyticsHelper?.sendActionEvent(EVENT_ACTION.ADD_STEPS, EVENT_STATUS.SUCCESS_10x_SAMPLED, {
			type: ADD_STEPS_TYPE.ACCEPTED,
			latency,
			stepType: countBy(
				stepsWithClientAndUserId,
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				(stepWithClientAndUserId) => stepWithClientAndUserId.stepType!,
			),
		});
	}
}

function sendFailureAnalytics(
	response: AcknowledgementErrorPayload,
	latency: number,
	analyticsHelper?: AnalyticsHelper,
) {
	analyticsHelper?.sendActionEvent(EVENT_ACTION.ADD_STEPS, EVENT_STATUS.FAILURE, {
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
	analyticsHelper?.sendErrorEvent(
		response.error,
		'Error while adding steps - Acknowledgement Error',
	);
}
