import { EditorView } from 'prosemirror-view';

import {
  ExperiencePerformanceTypes,
  ExperienceTypes,
  UFOExperience,
} from '@atlaskit/ufo';
import type { CustomData, ExperienceConfig } from '@atlaskit/ufo/types';

export const experienceConfig: ExperienceConfig = {
  type: ExperienceTypes.Operation,
  performanceType: ExperiencePerformanceTypes.Custom,
  platform: { component: 'editor' },
};

export enum EditorExperience {
  loadEditor = 'load',
  typing = 'type',
  interaction = 'interact',
}

export const RELIABILITY_INTERVAL = 30000;

type TypeOfEditorExperience = typeof EditorExperience;
type ValueOfEditorExperience = TypeOfEditorExperience[keyof TypeOfEditorExperience];

export class ExperienceStore {
  private static stores: WeakMap<EditorView, ExperienceStore> = new WeakMap();
  private experiences: Map<string, UFOExperience>;

  private constructor() {
    this.experiences = new Map();
    for (const experienceId of Object.values(EditorExperience)) {
      const experience = new UFOExperience(experienceId, experienceConfig);
      this.experiences.set(experienceId, experience);
    }
  }

  static getInstance(
    view: EditorView,
    options: { forceNewInstance?: boolean } = {},
  ): ExperienceStore {
    if (!this.stores.get(view) || options?.forceNewInstance) {
      const store = new ExperienceStore();
      this.stores.set(view, store);
    }
    return this.stores.get(view) as ExperienceStore;
  }

  get(experienceId: string) {
    return this.experiences.get(experienceId);
  }

  getActive(experienceId: string) {
    const experience = this.experiences.get(experienceId);
    if (!experience?.state.final) {
      return experience;
    }
  }

  getAll() {
    return Array.from(this.experiences.values());
  }

  start(experienceId: ValueOfEditorExperience, startTime?: number) {
    this.get(experienceId)?.start(startTime);
  }

  addMetadata(experienceId: string, metadata: CustomData) {
    this.get(experienceId)?.addMetadata(metadata);
  }

  mark(experienceId: string, mark: string, value: number) {
    this.get(experienceId)?.mark(mark, value);
  }

  success(experienceId: string, metadata?: CustomData) {
    this.getActive(experienceId)?.success({ metadata });
  }

  fail(experienceId: string, metadata?: CustomData) {
    this.getActive(experienceId)?.failure({ metadata });
  }

  abort(experienceId: string, metadata?: CustomData) {
    // We add this wait in here because when React catches an error it unmounts the component
    // before the error boundary's componentDidCatch is called
    // In this case we want to fail the experience, but without this wait, abort is called first
    setTimeout(() => {
      this.getActive(experienceId)?.abort({ metadata });
    }, 0);
  }

  abortAll(metadata?: CustomData) {
    this.experiences.forEach((experience) => {
      this.abort(experience.id, metadata);
    });
  }

  failAll(metadata?: CustomData) {
    this.experiences.forEach((experience) => {
      this.fail(experience.id, metadata);
    });
  }
}
