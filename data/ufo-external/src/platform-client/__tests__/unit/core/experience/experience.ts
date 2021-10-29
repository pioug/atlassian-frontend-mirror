import { UFOExperience } from '../../../../core/experience/experience';
import {
  ExperiencePerformanceTypes,
  ExperienceTypes,
} from '../../../../core/experience/experience-types';

test('experience instantiates without error', () => {
  const experience = new UFOExperience('test', {
    performanceType: ExperiencePerformanceTypes.Custom,
    type: ExperienceTypes.Operation,
  });
  expect(experience).not.toBe(null);
});
