import React, { useContext, useEffect } from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { render } from '@atlassian/testing-library/render';

import type { EnhancedUFOInteractionContextType } from '../../common';
import UFOInteractionContext from '../../interaction-context';
import UFOInteractionIDContext from '../../interaction-id-context';
import scheduleNormalPriorityTask from '../schedule-normal-priority-task';
import UFOSegment from '../segment';

const GATE = 'platform_ufo_native_task_scheduling';

jest.mock('../../interaction-metrics', () => ({
	abortByNewInteraction: jest.fn(),
	addApdex: jest.fn(),
	addCustomData: jest.fn(),
	addCustomTiming: jest.fn(),
	addHold: jest.fn(() => () => {}),
	addHoldByID: jest.fn(),
	addMark: jest.fn(),
	addNewInteraction: jest.fn(),
	addProfilerTimings: jest.fn(),
	addRequestInfo: jest.fn(),
	addSegment: jest.fn(),
	addSpan: jest.fn(),
	getActiveInteraction: jest.fn(() => null),
	removeHoldByID: jest.fn(),
	removeSegment: jest.fn(),
	tryComplete: jest.fn(),
}));

jest.mock('../schedule-normal-priority-task', () => ({
	__esModule: true,
	default: jest.fn(),
}));

/** Calls `complete()` on the nearest UFO interaction context once mounted. */
const CompleteOnMount = () => {
	const context = useContext(UFOInteractionContext) as EnhancedUFOInteractionContextType | null;
	useEffect(() => {
		context?.complete();
	}, [context]);
	return null;
};

const renderTopLevelSegment = () =>
	render(
		<UFOInteractionIDContext.Provider value={{ current: 'test-interaction-id' }}>
			<UFOSegment name="root">
				<CompleteOnMount />
			</UFOSegment>
		</UFOInteractionIDContext.Provider>,
	);

describe('UFOSegment complete() task scheduling', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('schedules completion with native task scheduling when the gate is enabled', () => {
		passGate(GATE);

		renderTopLevelSegment();

		expect(scheduleNormalPriorityTask).toHaveBeenCalledTimes(1);
		expect(scheduleNormalPriorityTask).toHaveBeenCalledWith(expect.any(Function));
	});

	it('renders accessibly with native task scheduling enabled', async () => {
		passGate(GATE);

		renderTopLevelSegment();

		await expect(document.body).toBeAccessible();
	});

	it('does not use native task scheduling when the gate is disabled', () => {
		failGate(GATE);

		renderTopLevelSegment();

		expect(scheduleNormalPriorityTask).not.toHaveBeenCalled();
	});
});
