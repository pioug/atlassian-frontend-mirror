import React from 'react';

import { render, screen } from '@testing-library/react';

import { getTypingPerformanceTracingMethod } from '../../../config';
import { addMetadata, addNewInteraction, tryComplete } from '../../../interaction-metrics';
import useUFOTypingPerformanceTracing from '../../index';

jest.mock('@atlaskit/react-ufo/interaction-metrics');
jest.mock('uuid', () => ({
	v4: jest.fn().mockReturnValue('id'),
}));
jest.mock('@atlaskit/react-ufo/config', () => ({
	getTypingPerformanceTracingMethod: jest.fn(),
	getInteractionRate: jest.fn().mockReturnValue(1),
}));

jest.mock('scheduler', () => {
	const original = jest.requireActual('scheduler');

	return {
		...original,
		unstable_scheduleCallback: jest.fn((_priority, callback) => {
			callback();
		}),
	};
});

type mockedTypingMethod = jest.MockedFunction<typeof getTypingPerformanceTracingMethod>;

describe('use typing performance tracing', () => {
	function TypingPerformanceTracingTestComponent() {
		const ref = useUFOTypingPerformanceTracing<HTMLInputElement>('ufo-key');
		return <input type="text" ref={ref} />;
	}

	let inputWrapper: Element;
	const keypressX = new KeyboardEvent('keypress', { key: 'x' });
	Object.defineProperty(keypressX, 'timeStamp', {
		value: 1, // first keypress start time
	});
	const keypressY = new KeyboardEvent('keypress', { key: 'y' });
	Object.defineProperty(keypressY, 'timeStamp', {
		value: 5, // second keypress start time
	});
	const keypressZ = new KeyboardEvent('keypress', { key: 'z' });
	Object.defineProperty(keypressZ, 'timeStamp', {
		value: 15, // third keypress start time
	});

	beforeEach(() => {
		jest.useFakeTimers();
		// @ts-expect-error - TS2740 - Type '{ now: () => number; }' is missing the following properties from type 'Performance': navigation, onresourcetimingbufferfull, timeOrigin, timing, and 13 more.
		global.performance = {
			now: jest
				.fn()
				.mockReturnValueOnce(0) // interaction start time
				.mockReturnValueOnce(4) // first key press end time
				.mockReturnValueOnce(15) // second key press end time
				.mockReturnValueOnce(65) // third key press end time
				.mockReturnValueOnce(70) // compute start time
				.mockReturnValueOnce(80), // compute end time
		};
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('when method is typeTracingTimeout', () => {
		beforeEach(() => {
			(getTypingPerformanceTracingMethod as mockedTypingMethod).mockReturnValue('timeout');
		});

		it('should capture and report a11y violations', async () => {
			const { container } = render(<TypingPerformanceTracingTestComponent />);

			await expect(container).toBeAccessible({
				violationCount: 1,
			});
		});

		it('should send interaction with meta data after 1 key press', () => {
			render(<TypingPerformanceTracingTestComponent />);
			inputWrapper = screen.getByRole('textbox');
			inputWrapper.dispatchEvent(keypressX);
			expect(addNewInteraction).toHaveBeenCalledWith('id', 'ufo-key', 'typing', 0, 1, null, null);
			jest.runAllTimers();

			expect(addMetadata).toHaveBeenCalledWith('id', {
				typing: {
					min: 3,
					max: 3,
					avg: 3,
					count: 1,
					below50count: 1,
					compute: 50,
					typeTracingMethod: 'timeout',
				},
			});
			expect(tryComplete).toHaveBeenCalledWith('id');
		});

		it('should send interaction with meta data after multiple key presses', () => {
			render(<TypingPerformanceTracingTestComponent />);
			inputWrapper = screen.getByRole('textbox');
			inputWrapper.dispatchEvent(keypressX);
			expect(addNewInteraction).toHaveBeenCalledWith('id', 'ufo-key', 'typing', 0, 1, null, null);
			inputWrapper.dispatchEvent(keypressY);
			expect(addNewInteraction).toHaveBeenCalledTimes(1);
			inputWrapper.dispatchEvent(keypressZ);
			jest.runAllTimers();

			expect(addMetadata).toHaveBeenCalledWith('id', {
				typing: {
					min: 3,
					max: 50,
					avg: 21,
					count: 3,
					below50count: 2,
					compute: 10,
					typeTracingMethod: 'timeout',
				},
			});
			expect(tryComplete).toHaveBeenCalledWith('id');
		});
	});

	describe('when method is typeTracingTimeoutNoAlloc', () => {
		beforeEach(() => {
			(getTypingPerformanceTracingMethod as mockedTypingMethod).mockReturnValue('timeoutNoAlloc');
		});

		it('should capture and report a11y violations', async () => {
			const { container } = render(<TypingPerformanceTracingTestComponent />);

			await expect(container).toBeAccessible({
				violationCount: 1,
			});
		});

		it('should send interaction with meta data after 1 key press', () => {
			render(<TypingPerformanceTracingTestComponent />);
			inputWrapper = screen.getByRole('textbox');
			inputWrapper.dispatchEvent(keypressX);
			expect(addNewInteraction).toHaveBeenCalledWith('id', 'ufo-key', 'typing', 0, 1, null, null);
			jest.runAllTimers();

			expect(addMetadata).toHaveBeenCalledWith('id', {
				typing: {
					min: 3,
					max: 3,
					avg: 3,
					count: 1,
					below50count: 1,
					typeTracingMethod: 'timeoutNoAlloc',
				},
			});
			expect(tryComplete).toHaveBeenCalledWith('id');
		});

		it('should send interaction with meta data after multiple key presses', () => {
			render(<TypingPerformanceTracingTestComponent />);
			inputWrapper = screen.getByRole('textbox');
			inputWrapper.dispatchEvent(keypressX);
			expect(addNewInteraction).toHaveBeenCalledWith('id', 'ufo-key', 'typing', 0, 1, null, null);
			inputWrapper.dispatchEvent(keypressY);
			expect(addNewInteraction).toHaveBeenCalledTimes(1);
			inputWrapper.dispatchEvent(keypressZ);
			jest.runAllTimers();

			expect(addMetadata).toHaveBeenCalledWith('id', {
				typing: {
					min: 3,
					max: 50,
					avg: 21,
					count: 3,
					below50count: 2,
					typeTracingMethod: 'timeoutNoAlloc',
				},
			});
			expect(tryComplete).toHaveBeenCalledWith('id');
		});
	});

	describe('when method is typeTracingMutationObserver', () => {
		beforeEach(() => {
			(getTypingPerformanceTracingMethod as mockedTypingMethod).mockReturnValue('mutationObserver');
		});

		it('should capture and report a11y violations', async () => {
			global.MutationObserver = jest
				.fn<MutationObserver, [MutationCallback]>()
				.mockImplementation(() => ({
					observe: jest.fn(),
					disconnect: jest.fn(),
					takeRecords: jest.fn(),
				}));
			const { container } = render(<TypingPerformanceTracingTestComponent />);

			await expect(container).toBeAccessible({
				violationCount: 1,
			});
		});

		it('should send interaction with meta data after 1 key press', () => {
			const mutationObserverMock = jest
				.fn<MutationObserver, [MutationCallback]>()
				.mockImplementation(() => ({
					observe: jest.fn(),
					disconnect: jest.fn(),
					takeRecords: jest.fn(),
				}));
			global.MutationObserver = mutationObserverMock;

			render(<TypingPerformanceTracingTestComponent />);
			inputWrapper = screen.getByRole('textbox');
			inputWrapper.dispatchEvent(keypressX);
			expect(addNewInteraction).toHaveBeenCalledWith('id', 'ufo-key', 'typing', 0, 1, null, null);
			expect(mutationObserverMock).toHaveBeenCalledTimes(1);
		});
	});
});
