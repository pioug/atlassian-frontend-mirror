/* eslint-env jest */
/* eslint-disable no-console */

import { UFOExperience } from '@atlaskit/ufo/experience';
import { UFOExperienceState } from '@atlaskit/ufo/experience-state';
import { ExperienceTypes, ExperiencePerformanceTypes } from '@atlaskit/ufo/experience-types';

export const flushPromises = (): Promise<void> => {
	// eslint-disable-next-line @atlaskit/platform/no-set-immediate
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
export const temporarilySilenceActAndAtlaskitDeprecationWarnings = (): void => {
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

	async start(): Promise<void> {
		super.start();
		this.startSpy();
		this.transitions.push(this.state.id);
	}

	async success(): Promise<null> {
		super.success();
		this.successSpy();
		this.transitions.push(this.state.id);
		return null;
	}

	async failure(): Promise<null> {
		super.failure();
		this.failureSpy();
		this.transitions.push(this.state.id);
		return null;
	}

	async abort(): Promise<null> {
		super.abort();
		this.abortSpy();
		this.transitions.push(this.state.id);
		return null;
	}

	mockReset(): void {
		this.startSpy.mockReset();
		this.successSpy.mockReset();
		this.failureSpy.mockReset();
		this.abortSpy.mockReset();
		this.transitions = [UFOExperienceState.NOT_STARTED.id];
	}
}
