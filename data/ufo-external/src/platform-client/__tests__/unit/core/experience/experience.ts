import { UFOExperience } from '../../../../core/experience/experience';
import { ExperienceTypes } from '../../../../core/experience/experience-types';

test('experience instantiates without error', () => {
  const experience = new UFOExperience('test', {
    type: ExperienceTypes.Custom,
  });
  expect(experience).not.toBe(null);
});
