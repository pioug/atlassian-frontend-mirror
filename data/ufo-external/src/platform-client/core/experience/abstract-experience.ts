import { v4 as uuidv4 } from 'uuid';

import {
  experiencePayloadEvent,
  getGlobalEventStream,
  subscribeEvent,
  unsubscribeEvent,
} from '../../../global-stream-buffer';
import { ufolog, ufowarn } from '../../../logger';
import {
  CustomData,
  ExperienceData,
  ExperienceMetrics,
  SUBSCRIBE_ALL,
  SubscribeCallback,
} from '../../../types/types';
import { roundPerfNow } from '../../utils/round-perf-now';

import { UFOExperienceState, UFOExperienceStateType } from './experience-state';
import { canTransition } from './experience-state-transitions';
import { ExperienceTypes } from './experience-types';

export const perfNowOrTimestamp = (timestamp?: number) => {
  if (timestamp !== undefined) {
    return ~~timestamp;
  }
  return roundPerfNow();
};

export type AbstractExperienceConfig = {
  category?: string | null;
  until?: Function | null;
  type: ExperienceTypes;
  platform?: { component: string };
};

export type EndStateConfig = {
  force?: boolean;
  metadata?: CustomData;
};

export class UFOAbstractExperience {
  state = UFOExperienceState.NOT_STARTED;

  id: string;

  instanceId: null | string = null; // for concurrent

  parent: null | UFOAbstractExperience = null;

  category: null | string = null;

  type: ExperienceTypes;

  metadata: CustomData = {};

  onDoneCallbacks = [];

  childExperiences = [];

  handleDoneBind: SubscribeCallback;

  uuid: string | null = null;

  until: Function | null;

  private _until: Function | null = null;

  metrics: ExperienceMetrics = {
    startTime: null,
    endTime: null,
    marks: [],
  };

  config: AbstractExperienceConfig;

  constructor(
    id: string,
    config: AbstractExperienceConfig,
    instanceId: null | string = null,
  ) {
    this.id = id;
    this.category = config?.category || null;
    this.until = config?.until || null;
    this.instanceId = instanceId;
    this.handleDoneBind = this._handleDoneExperience.bind(this);
    this.type = config.type;
    this.config = config;
  }

  async transition(newState: UFOExperienceStateType, timestamp?: number) {
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
          getGlobalEventStream().push(
            unsubscribeEvent(SUBSCRIBE_ALL, this.handleDoneBind),
          );
        }

        const data = await this.exportData();
        ufolog('this.parent', this.parent);
        //this.parent?._handleDoneExperience(data);
        getGlobalEventStream().push(experiencePayloadEvent(data));
      }
      return true;
    }
    ufolog(
      `TRANSITION: ${this.id} from ${this.state.id} to ${newState.id} unsuccessful`,
    );

    ufowarn(
      `transition of ${this.id} from ${this.state} to ${newState} is not possible`,
    );
    return false;
  }

  async start(startTime?: number) {
    if (
      (await this.transition(UFOExperienceState.STARTED, startTime)) &&
      !this._isManualStateEnabled()
    ) {
      ufolog('subscribed', this.id);
      getGlobalEventStream().push(
        subscribeEvent(SUBSCRIBE_ALL, this.handleDoneBind),
      );
    }
  }

  mark(name: string, timestamp?: number) {
    this.metrics.marks.push({ name, time: perfNowOrTimestamp(timestamp) });
    this.transition(UFOExperienceState.IN_PROGRESS);
  }

  _isManualStateEnabled() {
    return this.until === null;
  }

  _validateManualState() {
    if (!this._isManualStateEnabled()) {
      ufowarn('manual change of state not allowed as "until" is defined');
      return false;
    }
    return true;
  }

  async success(config?: EndStateConfig) {
    if (!config?.force && !this._validateManualState()) {
      return null;
    }
    if (config?.metadata) {
      this.addMetadata(config.metadata);
    }
    return this.transition(UFOExperienceState.SUCCEEDED);
  }

  async failure(config?: EndStateConfig) {
    if (!config?.force && !this._validateManualState()) {
      return null;
    }
    if (config?.metadata) {
      this.addMetadata(config.metadata);
    }
    return this.transition(UFOExperienceState.FAILED);
  }

  async abort(config?: EndStateConfig) {
    if (!config?.force && !this._validateManualState()) {
      return null;
    }
    if (config?.metadata) {
      this.addMetadata(config.metadata);
    }
    return this.transition(UFOExperienceState.ABORTED);
  }

  addMetadata(data: CustomData) {
    Object.assign(this.metadata, data);
  }

  _handleDoneExperience(data: ExperienceData) {
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
    };
  }

  _reset() {
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
