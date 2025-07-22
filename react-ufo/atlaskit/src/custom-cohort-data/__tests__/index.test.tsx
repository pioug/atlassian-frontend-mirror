import React from 'react';

import { render } from '@testing-library/react';

import UFOInteractionContext from '../../interaction-context';
import { getInteractionId } from '../../interaction-id-context';
import { addCohortingCustomData } from '../../interaction-metrics';
import UFOCustomCohortData, { addUFOCustomCohortData } from '../index';

jest.mock('../../interaction-id-context');
jest.mock('../../interaction-metrics');

const mockGetInteractionId = getInteractionId as jest.MockedFunction<typeof getInteractionId>;
const mockAddCohortingCustomData = addCohortingCustomData as jest.MockedFunction<
	typeof addCohortingCustomData
>;

describe('UFOCustomCohortData', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockGetInteractionId.mockReturnValue({ current: 'test-interaction-id' });
	});

	it('should call addCohortingCustomData with key and value', () => {
		const mockContext = {
			labelStack: [],
			segmentIdMap: new Map(),
			addMark: jest.fn(),
			addCustomData: jest.fn(),
			addCustomTimings: jest.fn(),
			addApdex: jest.fn(),
			hold: jest.fn(),
			tracePress: jest.fn(),
		};

		render(
			<UFOInteractionContext.Provider value={mockContext}>
				<UFOCustomCohortData dataKey="user_type" value="premium" />
			</UFOInteractionContext.Provider>,
		);

		expect(mockAddCohortingCustomData).toHaveBeenCalledWith(
			'test-interaction-id',
			'user_type',
			'premium',
		);
		expect(mockAddCohortingCustomData).toHaveBeenCalledTimes(1);
	});

	it('should handle null and undefined values', () => {
		const mockContext = {
			labelStack: [],
			segmentIdMap: new Map(),
			addMark: jest.fn(),
			addCustomData: jest.fn(),
			addCustomTimings: jest.fn(),
			addApdex: jest.fn(),
			hold: jest.fn(),
			tracePress: jest.fn(),
		};

		render(
			<UFOInteractionContext.Provider value={mockContext}>
				<UFOCustomCohortData dataKey="nullValue" value={null} />
			</UFOInteractionContext.Provider>,
		);

		expect(mockAddCohortingCustomData).toHaveBeenCalledWith(
			'test-interaction-id',
			'nullValue',
			null,
		);
		expect(mockAddCohortingCustomData).toHaveBeenCalledTimes(1);
	});

	it('should handle different primitive types', () => {
		const mockContext = {
			labelStack: [],
			segmentIdMap: new Map(),
			addMark: jest.fn(),
			addCustomData: jest.fn(),
			addCustomTimings: jest.fn(),
			addApdex: jest.fn(),
			hold: jest.fn(),
			tracePress: jest.fn(),
		};

		render(
			<UFOInteractionContext.Provider value={mockContext}>
				<UFOCustomCohortData dataKey="ticketCount" value={38} />
			</UFOInteractionContext.Provider>,
		);

		expect(mockAddCohortingCustomData).toHaveBeenCalledWith(
			'test-interaction-id',
			'ticketCount',
			38,
		);
		expect(mockAddCohortingCustomData).toHaveBeenCalledTimes(1);
	});

	it('should handle null interaction context gracefully', () => {
		render(<UFOCustomCohortData dataKey="user_type" value="premium" />);

		expect(mockAddCohortingCustomData).not.toHaveBeenCalled();
	});

	it('should handle null interaction ID gracefully', () => {
		mockGetInteractionId.mockReturnValue({ current: null });

		const mockContext = {
			labelStack: [],
			segmentIdMap: new Map(),
			addMark: jest.fn(),
			addCustomData: jest.fn(),
			addCustomTimings: jest.fn(),
			addApdex: jest.fn(),
			hold: jest.fn(),
			tracePress: jest.fn(),
		};

		render(
			<UFOInteractionContext.Provider value={mockContext}>
				<UFOCustomCohortData dataKey="user_type" value="premium" />
			</UFOInteractionContext.Provider>,
		);

		expect(mockAddCohortingCustomData).not.toHaveBeenCalled();
	});
});

describe('addUFOCustomCohortData', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockGetInteractionId.mockReturnValue({ current: 'test-interaction-id' });
	});

	it('should call addCohortingCustomData with key and value', () => {
		addUFOCustomCohortData('user_type', 'premium');

		expect(mockAddCohortingCustomData).toHaveBeenCalledWith(
			'test-interaction-id',
			'user_type',
			'premium',
		);
		expect(mockAddCohortingCustomData).toHaveBeenCalledTimes(1);
	});

	it('should handle null and undefined values', () => {
		addUFOCustomCohortData('nullValue', null);

		expect(mockAddCohortingCustomData).toHaveBeenCalledWith(
			'test-interaction-id',
			'nullValue',
			null,
		);
		expect(mockAddCohortingCustomData).toHaveBeenCalledTimes(1);
	});

	it('should handle different primitive types', () => {
		addUFOCustomCohortData('ticketCount', 38);
		addUFOCustomCohortData('isEnterprise', true);
		addUFOCustomCohortData('plan', 'enterprise');

		expect(mockAddCohortingCustomData).toHaveBeenCalledWith(
			'test-interaction-id',
			'ticketCount',
			38,
		);
		expect(mockAddCohortingCustomData).toHaveBeenCalledWith(
			'test-interaction-id',
			'isEnterprise',
			true,
		);
		expect(mockAddCohortingCustomData).toHaveBeenCalledWith(
			'test-interaction-id',
			'plan',
			'enterprise',
		);
		expect(mockAddCohortingCustomData).toHaveBeenCalledTimes(3);
	});

	it('should handle null interaction ID gracefully', () => {
		mockGetInteractionId.mockReturnValue({ current: null });

		addUFOCustomCohortData('user_type', 'premium');

		expect(mockAddCohortingCustomData).not.toHaveBeenCalled();
	});
});
