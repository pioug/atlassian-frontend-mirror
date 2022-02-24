/* eslint-env jest */
/* eslint-disable no-console */

import { ReactWrapper } from 'enzyme';
import {
  UFOExperienceState,
  UFOExperience,
  ExperienceTypes,
  ExperiencePerformanceTypes,
} from '@atlaskit/ufo';

export const flushPromises = () => {
  return new Promise((resolve) => setImmediate(resolve));
};

/**
 * Remove this silencing once our dependencies have been bumped to include at least react-dom@16.9.x
 * See: https://github.com/testing-library/react-testing-library/issues/281#issuecomment-480349256
 * @atlaskit warnings come from the implementation of various @atlaskit components. This can be removed
 * when the implementation's stop using deprecated packages.
 *
 * Should be used above imports of deprecated packages, or packages that import those deprecated
 * packages (e.g. @forge/ui), since the warning is logged when the code is loaded.
 */
export const temporarilySilenceActAndAtlaskitDeprecationWarnings = () => {
  const originalError = console.error;
  const originalWarn = console.warn;

  console.error = (...args: any[]) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return;
    }
    originalError.call(console, ...args);
  };
  console.warn = (...args: any[]) => {
    if (/@atlaskit.*has been deprecated/.test(args[0])) {
      return;
    }
    originalWarn.call(console, ...args);
  };

  afterAll(() => {
    console.error = originalError;
    console.warn = originalWarn;
  });
};

export const waitForUpdate = async (wrapper: ReactWrapper) => {
  // Wait for promises to run and component to be updated
  await new Promise(setImmediate);
  wrapper.update();
};

export class MockConcurrentExperienceInstance extends UFOExperience {
  startSpy: jest.Mock;
  successSpy: jest.Mock;
  failureSpy: jest.Mock;
  abortSpy: jest.Mock;
  transitions: string[];

  constructor(id: string) {
    super(
      id,
      {
        type: ExperienceTypes.Load,
        performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
      },
      `${id}-instance`,
    );
    this.startSpy = jest.fn();
    this.successSpy = jest.fn();
    this.failureSpy = jest.fn();
    this.abortSpy = jest.fn();
    this.transitions = [UFOExperienceState.NOT_STARTED.id];
  }

  async start() {
    super.start();
    this.startSpy();
    this.transitions.push(this.state.id);
  }

  async success() {
    super.success();
    this.successSpy();
    this.transitions.push(this.state.id);
    return null;
  }

  async failure() {
    super.failure();
    this.failureSpy();
    this.transitions.push(this.state.id);
    return null;
  }

  async abort() {
    super.abort();
    this.abortSpy();
    this.transitions.push(this.state.id);
    return null;
  }

  mockReset() {
    this.startSpy.mockReset();
    this.successSpy.mockReset();
    this.failureSpy.mockReset();
    this.abortSpy.mockReset();
    this.transitions = [UFOExperienceState.NOT_STARTED.id];
  }
}
