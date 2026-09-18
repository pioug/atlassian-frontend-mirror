import { addHold, getActiveInteraction, tryComplete } from '../interaction-metrics';
import scheduleOnPaint from '../segment/schedule-on-paint';
import { startDataFetchHold } from './index';

jest.mock('../interaction-metrics', () => ({
	addHold: jest.fn(),
	getActiveInteraction: jest.fn(),
	tryComplete: jest.fn(),
}));
jest.mock('../segment/schedule-on-paint', () => ({
	__esModule: true,
	default: jest.fn(),
}));

const mockAddHold = addHold as jest.MockedFunction<typeof addHold>;
const mockGetActiveInteraction = getActiveInteraction as jest.MockedFunction<
	typeof getActiveInteraction
>;
const mockScheduleOnPaint = scheduleOnPaint as jest.MockedFunction<typeof scheduleOnPaint>;
const mockTryComplete = tryComplete as jest.MockedFunction<typeof tryComplete>;

describe('startDataFetchHold', () => {
	const releaseHold = jest.fn();
	const options = { label: 'graphql-query', name: 'WorkItemsQuery' };

	beforeEach(() => {
		jest.clearAllMocks();
		mockAddHold.mockReturnValue(releaseHold);
	});

	it('does not start a hold without an active interaction', () => {
		mockGetActiveInteraction.mockReturnValue(undefined);

		expect(startDataFetchHold(options)).toBeUndefined();
		expect(mockAddHold).not.toHaveBeenCalled();
	});

	it('does not start a hold for an interaction that has already ended', () => {
		mockGetActiveInteraction.mockReturnValue({
			id: 'interaction-id',
			end: 100,
		} as NonNullable<ReturnType<typeof getActiveInteraction>>);

		expect(startDataFetchHold(options)).toBeUndefined();
		expect(mockAddHold).not.toHaveBeenCalled();
	});

	it.each(['page_load', 'press', 'typing', 'transition', 'segment'] as const)(
		'starts a hold for an active %s interaction',
		(type) => {
			mockGetActiveInteraction.mockReturnValue({
				id: 'interaction-id',
				end: 0,
				type,
			} as NonNullable<ReturnType<typeof getActiveInteraction>>);

			expect(startDataFetchHold(options)).toEqual(expect.any(Function));
			expect(mockAddHold).toHaveBeenCalledWith(
				'interaction-id',
				[{ name: 'graphql-query' }],
				'WorkItemsQuery',
				false,
			);
		},
	);

	it('releases after paint, completes the captured interaction, and is idempotent', () => {
		mockGetActiveInteraction.mockReturnValue({
			id: 'interaction-id',
			end: 0,
		} as NonNullable<ReturnType<typeof getActiveInteraction>>);
		let onPaint: (() => void) | undefined;
		mockScheduleOnPaint.mockImplementation((callback) => {
			onPaint = callback;
		});

		const release = startDataFetchHold(options);
		release?.();
		release?.();

		expect(mockScheduleOnPaint).toHaveBeenCalledTimes(1);
		expect(releaseHold).not.toHaveBeenCalled();
		expect(mockTryComplete).not.toHaveBeenCalled();

		onPaint?.();

		expect(releaseHold).toHaveBeenCalledTimes(1);
		expect(mockTryComplete).toHaveBeenCalledWith('interaction-id');
	});
});
