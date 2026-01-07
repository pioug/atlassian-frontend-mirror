import type { DispatchAnalyticsEvent } from '../analytics';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../analytics';
import type {
	ExperienceEventAttributes,
	ExperienceEventPayload,
} from '../analytics/types/experience-events';

import { DEFAULT_EXPERIENCE_SAMPLE_RATE, EXPERIENCE_ABORT_REASON } from './consts';
import { canTransition } from './experience-state';
import type { ExperienceCheck } from './ExperienceCheck';
import { ExperienceCheckComposite } from './ExperienceCheckComposite';
import type { CustomExperienceMetadata, ExperienceState } from './types';

type ExperienceOptions = {
	/**
	 * An optional sub identifier to further classify the specific experience action taken
	 *
	 * e.g. 'bold' 'bullet' 'insert-table'
	 */
	action?: string;

	/**
	 * An optional sub identifier to further classify the specific experience action subject
	 *
	 * e.g. 'selection-toolbar' 'quick-insert'
	 */
	actionSubjectId?: string;

	/**
	 * Checks used to control experience transition to various states.
	 * Once the experience is in progress, these checks can automatically trigger
	 * state transitions (e.g., timeout check to trigger failure).
	 */
	checks?: ExperienceCheck[];

	/**
	 * Function to dispatch analytics events for experience tracking.
	 * Required for tracking experienceMeasured and experienceSampled events.
	 */
	dispatchAnalyticsEvent: DispatchAnalyticsEvent;

	/**
	 * Optional global metadata to attach to all analytics events for this experience.
	 *
	 * Can be overridden by metadata provided in individual start/abort/fail/success calls.
	 */
	metadata?: CustomExperienceMetadata;

	/**
	 * Sample rate for experienceSampled events.
	 * Determines how frequently we should track events for the experience based on
	 * expected volume. Value should be between 0 and 1.
	 *
	 * @default DEFAULT_EXPERIENCE_SAMPLE_RATE (0.001 = 1 in 1000)
	 *
	 * Newly defined experiences should use the default unless they have data
	 * to justify a different rate. Measurements should be gathered after initial
	 * instrumentation, then the sample rate can be tuned up to a safe threshold.
	 */
	sampleRate?: number;
};

type ExperienceStartOptions = {
	forceRestart?: boolean;
	metadata?: CustomExperienceMetadata;
	method?: string;
};

type ExperienceEndOptions = {
	metadata?: CustomExperienceMetadata;
	reason?: string;
};

export class Experience {
	private readonly id: string;
	private readonly actionSubjectId: string | undefined;
	private readonly dispatchAnalyticsEvent: DispatchAnalyticsEvent;
	private readonly sampleRate: number;
	private readonly globalMetadata: CustomExperienceMetadata | undefined;
	private readonly check: ExperienceCheck;

	private currentState: ExperienceState = 'pending';

	/**
	 * Set of experience states that have been seen in the current session.
	 *
	 * Used to determine if experienceStatusFirstSeen flag should be set in events.
	 */
	private statesSeen: Set<ExperienceState> = new Set();

	/**
	 * Indicates whether sampled tracking is enabled for this current experience session.
	 *
	 * Set to true | false upon transitioning to 'started' state.
	 * When true, on subsequent transitions we fire experienceSampled events.
	 * Ensures that every tracked start has corresponding abort/fail/success tracked.
	 */
	private isSampledTrackingEnabled: boolean | undefined;

	/**
	 * Timestamp (in milliseconds) when the experience transitioned to 'started' state.
	 *
	 * Used to calculate experience duration. Set via Date.now() when experience starts.
	 */
	private startTimeMs: number | undefined;

	/**
	 * Metadata provided at experience start time to merge into subsequent events.
	 *
	 * Used to retain experienceStartMethod and other start-specific metadata.
	 */
	private startMetadata: CustomExperienceMetadata | undefined;

	/**
	 * Creates a new Experience instance for tracking user experiences.
	 *
	 * @param id - Unique identifier for the experience e.g. 'toolbar-open' 'menu-action'
	 * @param options - Configuration options for the experience
	 * @param options.checks - Experience checks to monitor for completion
	 * @param options.dispatchAnalyticsEvent - Function to dispatch analytics events
	 * @param options.sampleRate - Sample rate for experienceSampled events
	 * @param options.metadata - Global metadata to attach to all events
	 * @param options.action - Optional sub identifier for the specific experience action e.g. 'bold' 'insert-table'
	 * @param options.actionSubjectId - Optional sub identifier for the experience action subject e.g. 'selection-toolbar' 'quick-insert'
	 */
	constructor(id: string, options: ExperienceOptions) {
		this.id = id;
		this.actionSubjectId = options.actionSubjectId;
		this.dispatchAnalyticsEvent = options.dispatchAnalyticsEvent;
		this.sampleRate = options.sampleRate ?? DEFAULT_EXPERIENCE_SAMPLE_RATE;
		this.globalMetadata = {
			...options.metadata,
			experienceAction: options.action,
		};

		this.check = new ExperienceCheckComposite(options.checks || []);
	}

	private startCheck() {
		this.stopCheck();

		this.check.start(({ status, reason, metadata }) => {
			if (status === 'success') {
				this.success({ reason, metadata });
			} else if (status === 'abort') {
				this.abort({ reason, metadata });
			} else if (status === 'failure') {
				this.failure({ reason, metadata });
			}
		});
	}

	private stopCheck() {
		this.check.stop();
	}

	private getEndStateMetadata(options: ExperienceEndOptions = {}): CustomExperienceMetadata {
		const metadata: CustomExperienceMetadata = {
			...options.metadata,
		};

		if (options.reason) {
			metadata.experienceEndReason = options.reason;
		}

		return metadata;
	}

	/**
	 * Transitions to a new experience state and tracks analytics events.
	 *
	 * Upon transition to each state, two events are tracked:
	 * - experienceMeasured: tracked on every successful transition, used for data analysis
	 * - experienceSampled: tracked only on 1 out of every N transitions based on sample rate
	 *
	 * @param toState - The target state to transition to
	 * @param metadata - Optional metadata to attach to the analytics events
	 * @returns true if transition was successful, false if invalid transition
	 */
	private transitionTo(toState: ExperienceState, metadata?: CustomExperienceMetadata): boolean {
		if (!canTransition(this.currentState, toState)) {
			return false;
		}

		this.currentState = toState;

		if (toState === 'started') {
			this.isSampledTrackingEnabled = Math.random() < this.sampleRate;
			this.startTimeMs = Date.now();
			this.startMetadata = metadata;
		}

		this.trackTransition(toState, metadata);

		if (toState === 'started') {
			this.startCheck();
		} else {
			this.stopCheck();
			this.startMetadata = undefined;
		}

		this.statesSeen.add(toState);

		return true;
	}

	/**
	 * Tracks analytics events for a state transition.
	 *
	 * Fires both experienceMeasured (always) and experienceSampled (sampled) events.
	 *
	 * @param toState - The state that was transitioned to
	 * @param metadata - Metadata to include in the event, including firstInSession flag
	 */
	private trackTransition(toState: ExperienceState, metadata?: CustomExperienceMetadata): void {
		const attributes: ExperienceEventAttributes = {
			experienceKey: this.id,
			experienceStatus: toState,
			experienceStatusFirstSeen: !this.statesSeen.has(toState),
			experienceStartTime: this.startTimeMs || 0,
			experienceDuration: this.startTimeMs ? Date.now() - this.startTimeMs : 0,
			...this.globalMetadata,
			...this.startMetadata,
			...metadata,
		};

		const experienceMeasuredEvent: ExperienceEventPayload = {
			action: ACTION.EXPERIENCE_MEASURED,
			actionSubject: ACTION_SUBJECT.EDITOR,
			actionSubjectId: this.actionSubjectId,
			eventType: EVENT_TYPE.OPERATIONAL,
			attributes,
		};

		this.dispatchAnalyticsEvent(experienceMeasuredEvent);

		if (this.isSampledTrackingEnabled) {
			const experienceSampledEvent: ExperienceEventPayload = {
				action: ACTION.EXPERIENCE_SAMPLED,
				actionSubject: ACTION_SUBJECT.EDITOR,
				actionSubjectId: this.actionSubjectId,
				eventType: EVENT_TYPE.OPERATIONAL,
				attributes,
			};

			this.dispatchAnalyticsEvent(experienceSampledEvent);
		}
	}

	/**
	 * Starts tracking the experience and all checks which monitor for completion.
	 *
	 * Metadata from options will be merged with metadata provided in subsequent events.
	 *
	 * @param options - Configuration for starting the experience
	 * @param options.metadata - Optional custom metadata attached to all subsequent events for this started experience
	 * @param options.forceRestart - If true and experience already in progress will abort and restart
	 * @param options.method - Optional method for experience start, e.g., how the experience was initiated
	 */
	start(options: ExperienceStartOptions = {}): boolean {
		if (options.forceRestart && this.currentState === 'started') {
			this.abort({ reason: EXPERIENCE_ABORT_REASON.RESTARTED });
		}

		return this.transitionTo('started', {
			experienceStartMethod: options.method,
			...options.metadata,
		});
	}

	/**
	 * Marks the experience as successful and stops any ongoing checks.
	 *
	 * @param options - Configuration for the success event
	 * @param options.metadata - Optional custom metadata attached to the success event
	 * @param options.reason - Optional reason for success
	 * @returns false if transition to success state was not valid
	 */
	success(options: ExperienceEndOptions = {}): boolean {
		const metadata = this.getEndStateMetadata(options);

		return this.transitionTo('succeeded', metadata);
	}

	/**
	 * Aborts the experience and stops any ongoing checks.
	 *
	 * Use this when a started experience terminates early due to user action or context change
	 * (e.g., component unmount, navigation). This is neither success nor failure.
	 *
	 * @param options - Configuration for the abort event
	 * @param options.metadata - Optional custom metadata attached to the abort event
	 * @param options.reason - Optional reason for abort
	 *
	 * @example
	 * // Abort on component unmount
	 * useEffect(() => {
	 *   return () => experience.abort({ reason: 'unmount', metadata: { someKey: 'someValue' } });
	 * }, []);
	 *
	 * @returns false if transition to aborted state was not valid
	 */
	abort(options: ExperienceEndOptions = {}): boolean {
		const metadata = this.getEndStateMetadata(options);

		return this.transitionTo('aborted', metadata);
	}

	/**
	 * Manually marks the experience as failed and stops any ongoing checks.
	 *
	 * Use this for actual failures in the experience flow (e.g., timeout, error conditions).
	 *
	 * @param options - Configuration for the failure event
	 * @param options.metadata - Optional custom metadata attached to the failure event
	 * @param options.reason - Optional reason for failure
	 * @returns false if transition to failed state was not valid
	 */
	failure(options: ExperienceEndOptions = {}): boolean {
		const metadata = this.getEndStateMetadata(options);

		return this.transitionTo('failed', metadata);
	}
}
