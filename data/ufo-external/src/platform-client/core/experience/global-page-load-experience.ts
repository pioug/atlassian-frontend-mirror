import { PageLoadExperienceData } from '../../../types/types';
import { untilAll } from '../../utils/until-helpers';

import {
  AbstractExperienceConfig,
  perfNowOrTimestamp,
  UFOAbstractExperience,
} from './abstract-experience';
import { ExperienceTypes } from './experience-types';
import { PageSegmentExperienceTypes } from './page-segment-experience-types';

class UFOGlobalPageLoadExperience extends UFOAbstractExperience {
  loadingPageLoadId: string = 'UNKNOWN';

  type = ExperienceTypes.PageLoad;

  initial = true;

  startPageLoad(id: string, initial: boolean = false, startTime?: number) {
    const result = super.start(perfNowOrTimestamp(startTime));
    this.setPageLoadId(id);
    this.initial = initial;
    return result;
  }

  updateConfig(config: AbstractExperienceConfig) {
    Object.assign(this.config, config);
  }

  private setPageLoadId(id: string) {
    this.loadingPageLoadId = id;
  }

  async getId(): Promise<string> {
    return this.loadingPageLoadId;
  }

  async exportData(): Promise<PageLoadExperienceData> {
    const data = await super.exportData();
    return {
      ...data,
      initial: this.initial,
    };
  }
}

export const GlobalPageLoadExperience = new UFOGlobalPageLoadExperience(
  'UFO_GLOBAL_PAGE_LOAD',
  {
    type: ExperienceTypes.PageLoad,
    // this should come from global config
    until: untilAll([{ category: PageSegmentExperienceTypes.PRODUCT }]),
  },
);
