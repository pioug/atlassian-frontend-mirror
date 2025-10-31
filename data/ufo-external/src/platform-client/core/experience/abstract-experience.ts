import { v4 as uuidv4 } from 'uuid';

import { UFO_EXPERIMENTAL_BUILD_VERSION } from '../../../buildVersion';
import {
	experiencePayloadEvent,
	getGlobalEventStream,
	subscribeEvent,
	unsubscribeEvent,
} from '../../../global-stream-buffer';
import { ufolog, ufowarn } from '../../../logger';
import { visibilityChangeObserver } from '../../../observer/visibility-change-observer';
import {
	type CustomData,
	type ExperienceData,
	type ExperienceMetrics,
	FMP_MARK,
	INLINE_RESPONSE_MARK,
	PageVisibleState,
	type PerformanceConfig,
	type ReportedTimings,
	SUBSCRIBE_ALL,
	type SubscribeCallback,
	type Timing,
} from '../../../types';
import { roundPerfNow } from '../../utils/round-perf-now';
import { isWindowObjectAvailable } from '../../utils/window-helper';

import { UFOExperienceState, type UFOExperienceStateType } from './experience-state';
import { canTransition } from './experience-state-transitions';
import { ExperiencePerformanceTypes, type ExperienceTypes } from './experience-types';

const getPageVisibleState = () => {
	return !isWindowObjectAvailable() ||
		!window.document ||
		window.document.visibilityState === 'visible'
		? PageVisibleState.VISIBLE
		: PageVisibleState.HIDDEN;
};

export const perfNowOrTimestamp = (timestamp?: number): number => {
	if (timestamp !== undefined) {
		return ~~timestamp;
	}
	return roundPerfNow();
};

export type AbstractExperienceConfig = {
	category?: string | null;
	featureFlags?: string[];
	isSSROutputAsFMP?: boolean;
	performanceConfig?: PerformanceConfig;
	performanceType: ExperiencePerformanceTypes;
	platform?: { component: string };
	timings?: Timing[];
	type: ExperienceTypes;
	until?: Function | null;
};

export type EndStateConfig = {
	force?: boolean;
	metadata?: CustomData;
};

export class UFOAbstractExperience {
	state: UFOExperienceStateType = UFOExperienceState.NOT_STARTED;

	id: string;

	instanceId: null | string = null; // for concurrent

	parent: null | UFOAbstractExperience = null;

	category: null | string = null;

	type: ExperienceTypes;

	performanceType: ExperiencePerformanceTypes;

	metadata: CustomData = {};

	onDoneCallbacks: never[] = [];

	childExperiences: never[] = [];

	featureFlags: string[];

	timings: Timing[];

	explicitTimings: ReportedTimings = {};

	// @todo move to page load experience when proper classes/inheritance prepared
	isSSROutputAsFMP: boolean = false;

	handleDoneBind: SubscribeCallback;

	uuid: string | null = null;

	until: Function | null;

	private _until: Function | null = null;

	private pageVisibleState: PageVisibleState;

	metrics: ExperienceMetrics = {
		startTime: null,
		endTime: null,
		marks: [],
	};

	performanceConfig: PerformanceConfig = {};

	config: AbstractExperienceConfig;

	constructor(id: string, config: AbstractExperienceConfig, instanceId: null | string = null) {
		this.id = id;
		this.category = config?.category || null;
		this.until = config?.until || null;
		this.instanceId = instanceId;
		this.handleDoneBind = this._handleDoneExperience.bind(this);
		this.type = config.type;
		this.performanceType = config.performanceType;
		this.performanceConfig = config.performanceConfig || {};
		this.config = config;
		this.pageVisibleState = getPageVisibleState();
		this.featureFlags = config.featureFlags || [];
		this.timings = config.timings || [];
		if (
			config.performanceType === ExperiencePerformanceTypes.PageLoad ||
			config.performanceType === ExperiencePerformanceTypes.PageSegmentLoad
		) {
			this.isSSROutputAsFMP = config.isSSROutputAsFMP || false;
		}
	}

	async transition(newState: UFOExperienceStateType, timestamp?: number): Promise<boolean> {
		ufolog('async transition', this.id, this.state.id, newState.id);
		if (canTransition(this.state, newState)) {
			ufolog(
				`TRANSITION: ${this.id} from ${this.state.id} to ${newState.id} successful`,
				this.state.final,
				!newState.final,
			);

			if (newState === UFOExperienceState.STARTED) {
				this._reset();
			}

			if (this.state.final && !newState.final) {
				this.metrics.startTime = perfNowOrTimestamp(timestamp);
				this.uuid = uuidv4();
			}

			this.state = newState;

			if (newState.final) {
				this.metrics.endTime = perfNowOrTimestamp(timestamp);
				if (!this._isManualStateEnabled()) {
					getGlobalEventStream().push(unsubscribeEvent(SUBSCRIBE_ALL, this.handleDoneBind));
				}

				const data = await this.exportData();
				ufolog('this.parent', this.parent);
				getGlobalEventStream().push(experiencePayloadEvent(data));
			}
			return true;
		}
		ufolog(`TRANSITION: ${this.id} from ${this.state.id} to ${newState.id} unsuccessful`);

		ufowarn(`transition of ${this.id} from ${this.state} to ${newState} is not possible`);
		return false;
	}

	async start(startTime?: number): Promise<void> {
		const transitionSuccessful = await this.transition(UFOExperienceState.STARTED, startTime);
		if (transitionSuccessful) {
			this.pageVisibleState = getPageVisibleState();
			visibilityChangeObserver.subscribe(this.setPageVisibleStateToMixed);
			if (!this._isManualStateEnabled()) {
				ufolog('subscribed', this.id);
				getGlobalEventStream().push(subscribeEvent(SUBSCRIBE_ALL, this.handleDoneBind));
			}
		}
	}

	mark(name: string, timestamp?: number): void {
		if (name !== FMP_MARK && name !== INLINE_RESPONSE_MARK) {
			this._mark(name, timestamp);
		} else {
			ufowarn('please use markFMP or markInlineResponse for specialised marks');
		}
	}

	private _mark(name: string, timestamp?: number) {
		this.metrics.marks.push({ name, time: perfNowOrTimestamp(timestamp) });
		this.transition(UFOExperienceState.IN_PROGRESS);
	}

	markFMP(timestamp?: number): void {
		this._mark(FMP_MARK, timestamp);
	}

	markInlineResponse(timestamp?: number): void {
		this._mark(INLINE_RESPONSE_MARK, timestamp);
	}

	private setPageVisibleStateToMixed = () => {
		this.pageVisibleState = PageVisibleState.MIXED;
		visibilityChangeObserver.unsubscribe(this.setPageVisibleStateToMixed);
	};

	private _isManualStateEnabled() {
		return this.until === null;
	}

	private _validateManualState() {
		if (!this._isManualStateEnabled()) {
			ufowarn('manual change of state not allowed as "until" is defined');
			return false;
		}
		return true;
	}

	private switchToEndState(state: UFOExperienceStateType, config?: EndStateConfig) {
		if (!config?.force && !this._validateManualState()) {
			return null;
		}
		if (config?.metadata) {
			this.addMetadata(config.metadata);
		}
		visibilityChangeObserver.unsubscribe(this.setPageVisibleStateToMixed);
		return this.transition(state);
	}

	async success(config?: EndStateConfig): Promise<boolean | null> {
		return this.switchToEndState(UFOExperienceState.SUCCEEDED, config);
	}

	async failure(config?: EndStateConfig): Promise<boolean | null> {
		return this.switchToEndState(UFOExperienceState.FAILED, config);
	}

	async abort(config?: EndStateConfig): Promise<boolean | null> {
		return this.switchToEndState(UFOExperienceState.ABORTED, config);
	}

	addMetadata(data: CustomData): void {
		Object.assign(this.metadata, data);
	}

	private _handleDoneExperience(data: ExperienceData) {
		ufolog('_handleDoneExperience in', this.id, data.state, data, this._until);
		if (data.state.final) {
			if (this._until !== null) {
				const { done, state } = this._until(data);
				if (done && !this.state.final) {
					this.transition(state);
				}
			}
		}
	}

	async getId(): Promise<string> {
		return this.id;
	}

	async exportData(): Promise<ExperienceData> {
		return {
			id: await this.getId(),
			uuid: this.uuid,
			type: this.type,
			schemaVersion: UFO_EXPERIMENTAL_BUILD_VERSION || 'unknown',
			performanceType: this.performanceType,
			category: this.category,
			state: this.state,
			metadata: { ...this.metadata },
			metrics: { ...this.metrics },
			children: [...this.childExperiences],
			result: {
				success: !!this.state.success,
				startTime: this.metrics.startTime,
				duration: (this.metrics.endTime || 0) - (this.metrics.startTime || 0),
			},
			platform: this.config.platform || null,
			pageVisibleState: this.pageVisibleState,
			featureFlags: this.featureFlags,
			isSSROutputAsFMP: this.isSSROutputAsFMP,
			timings: this.timings,
			explicitTimings: this.explicitTimings,
			performanceConfig: this.performanceConfig,
		};
	}

	private _reset() {
		this.parent = null;
		this.metadata = {};
		this.onDoneCallbacks = [];
		this.childExperiences = [];
		this.metrics = {
			startTime: null,
			endTime: null,
			marks: [],
		};
		this._until = this.until ? this.until() : null;
	}
}
