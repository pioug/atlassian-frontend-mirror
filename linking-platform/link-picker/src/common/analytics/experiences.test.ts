import { UFOExperience } from '@atlaskit/ufo';
import {
  abortUfoExperience,
  failUfoExperience,
  startUfoExperience,
  succeedUfoExperience,
  ufoExperience,
} from './experiences';

const mockedSessionId = 'NEW_SESSION_ID';

describe('experiences', () => {
  it('startUfoExperience', () => {
    const mockedUFOExperience = jest.spyOn(UFOExperience.prototype, 'start');
    startUfoExperience(ufoExperience.mounted, mockedSessionId);
    expect(mockedUFOExperience).toHaveBeenCalled();
  });

  it('succeedUfoExperience', () => {
    const mockedUFOExperience = jest.spyOn(UFOExperience.prototype, 'success');
    succeedUfoExperience(ufoExperience.mounted, mockedSessionId);
    expect(mockedUFOExperience).toHaveBeenCalled();
  });

  it('failUfoExperience', () => {
    const mockedUFOExperience = jest.spyOn(UFOExperience.prototype, 'failure');
    failUfoExperience(ufoExperience.mounted, mockedSessionId);
    expect(mockedUFOExperience).toHaveBeenCalled();
  });

  it('abortUfoExperience', () => {
    const mockedUFOExperience = jest.spyOn(UFOExperience.prototype, 'abort');
    abortUfoExperience(ufoExperience.mounted, mockedSessionId);
    expect(mockedUFOExperience).toHaveBeenCalled();
  });
});
