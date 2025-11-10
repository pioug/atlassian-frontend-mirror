import type { CustomData } from '@atlaskit/ufo';

import type { DispatchAnalyticsEvent } from '../analytics';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../analytics';
import type { ExperienceEventPayload } from '../analytics/types/experience-events';

import { DEFAULT_EXPERIENCE_SAMPLE_RATE } from './consts';
import { canTransition, type ExperienceState } from './experience-state';
import type { ExperienceCheck } from './ExperienceCheck';
import { ExperienceCheckComposite } from './ExperienceCheckComposite';

type ExperienceOptions = {
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
	metadata?: CustomData;
};

type ExperienceEndOptions = {
	metadata?: CustomData;
};

export class Experience {
	private readonly id: string;
	private readonly dispatchAnalyticsEvent: DispatchAnalyticsEvent;
	private readonly sampleRate: number;

	private check: ExperienceCheck;
	private startOptions: ExperienceStartOptions | undefined;

	private currentState: ExperienceState = 'pending';
	private statesSeen: Set<ExperienceState> = new Set();

	/**
	 * Indicates whether sampled tracking is enabled for this current experience session.
	 *
	 * Set to true | false upon transitioning to 'started' state.
	 * When true, on subsequent transitions we fire experienceSampled events.
	 * Ensures that every tracked start has corresponding abort/fail/success tracked.
	 */
	private isSampledTrackingEnabled: boolean | undefined;

	constructor(id: string, options: ExperienceOptions) {
		this.id = id;
		this.dispatchAnalyticsEvent = options.dispatchAnalyticsEvent;
		this.sampleRate = options.sampleRate ?? DEFAULT_EXPERIENCE_SAMPLE_RATE;

		this.check = new ExperienceCheckComposite(options.checks || []);
	}

	private startCheck() {
		this.stopCheck();

		this.check.start(({ status, metadata }) => {
			if (status === 'success') {
				this.success({ metadata });
			} else if (status === 'abort') {
				this.abort({ metadata });
			} else if (status === 'failure') {
				this.failure({ metadata });
			}
		});
	}

	private stopCheck() {
		this.check.stop();
	}

	private getEndStateConfig(options?: ExperienceEndOptions) {
		return {
			metadata:
				options?.metadata || this.startOptions?.metadata
					? {
							...this.startOptions?.metadata,
							...options?.metadata,
						}
					: undefined,
		};
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
	private transitionTo(toState: ExperienceState, metadata?: Record<string, unknown>): boolean {
		if (!canTransition(this.currentState, toState)) {
			return false;
		}

		this.statesSeen.add(toState);
		this.currentState = toState;

		if (toState === 'started') {
			this.isSampledTrackingEnabled = Math.random() < this.sampleRate;
		}

		this.trackTransition(toState, metadata);

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
	private trackTransition(toState: ExperienceState, metadata?: Record<string, unknown>): void {
		const attributes = {
			experienceKey: this.id,
			experienceStatus: toState,
			firstInSession: !this.statesSeen.has(toState),
			...metadata,
		};

		const experienceMeasuredEvent: ExperienceEventPayload = {
			action: ACTION.EXPERIENCE_MEASURED,
			actionSubject: ACTION_SUBJECT.EDITOR,
			actionSubjectId: undefined,
			eventType: EVENT_TYPE.OPERATIONAL,
			attributes,
		};

		this.dispatchAnalyticsEvent(experienceMeasuredEvent);

		if (this.isSampledTrackingEnabled) {
			const experienceSampledEvent: ExperienceEventPayload = {
				action: ACTION.EXPERIENCE_SAMPLED,
				actionSubject: ACTION_SUBJECT.EDITOR,
				actionSubjectId: undefined,
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
	 * @param options.metadata - Optional metadata attached to all subsequent events for this started experience
	 */
	start(options?: ExperienceStartOptions) {
		this.startOptions = options;

		if (this.transitionTo('started', options?.metadata)) {
			this.startCheck();
		}
	}

	/**
	 * Marks the experience as successful and stops any ongoing checks.
	 *
	 * @param options - Configuration for the success event
	 * @param options.metadata - Optional metadata attached to the success event
	 */
	success(options?: ExperienceEndOptions) {
		const mergedConfig = this.getEndStateConfig(options);

		if (this.transitionTo('succeeded', mergedConfig.metadata)) {
			this.stopCheck();
			this.startOptions = undefined;
		}
	}

	/**
	 * Aborts the experience and stops any ongoing checks.
	 *
	 * Use this when a started experience terminates early due to user action or context change
	 * (e.g., component unmount, navigation). This is neither success nor failure.
	 *
	 * @param options - Configuration for the abort event
	 * @param options.metadata - Optional metadata attached to the abort event
	 *
	 * @example
	 * // Abort on component unmount
	 * useEffect(() => {
	 *   return () => experience.abort({ metadata: { reason: 'unmount' } });
	 * }, []);
	 */
	abort(options?: ExperienceEndOptions) {
		const mergedConfig = this.getEndStateConfig(options);

		if (this.transitionTo('aborted', mergedConfig.metadata)) {
			this.stopCheck();
			this.startOptions = undefined;
		}
	}

	/**
	 * Manually marks the experience as failed and stops any ongoing checks.
	 *
	 * Use this for actual failures in the experience flow (e.g., timeout, error conditions).
	 *
	 * @param options - Configuration for the failure event
	 * @param options.metadata - Optional metadata attached to the failure event
	 */
	failure(options?: ExperienceEndOptions) {
		const mergedConfig = this.getEndStateConfig(options);

		if (this.transitionTo('failed', mergedConfig.metadata)) {
			this.stopCheck();
			this.startOptions = undefined;
		}
	}
}
