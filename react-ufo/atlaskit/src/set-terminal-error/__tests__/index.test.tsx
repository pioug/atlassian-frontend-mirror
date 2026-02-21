import React, { type ReactNode } from 'react';

import { renderHook } from '@testing-library/react';

import UFOInteractionContext, { type UFOInteractionContextType } from '../../interaction-context';
import * as interactionMetricsModule from '../../interaction-metrics';
import UFORouteName from '../../route-name-context';
import {
	setTerminalError,
	sinkTerminalErrorHandler,
	type TerminalErrorAdditionalAttributes,
	useReportTerminalError,
} from '../index';

jest.mock('../../interaction-metrics', () => ({
	getActiveInteraction: jest.fn(),
	PreviousInteractionLog: {
		id: undefined,
		name: undefined,
		type: undefined,
		isAborted: undefined,
		timestamp: undefined,
	},
}));

jest.mock('../../route-name-context', () => ({
	__esModule: true,
	default: { current: null },
}));

// Mock performance.now() for consistent testing
const mockPerformanceNow = jest.fn(() => 1000);
Object.defineProperty(global.performance, 'now', {
	writable: true,
	value: mockPerformanceNow,
});

const mockGetActiveInteraction = interactionMetricsModule.getActiveInteraction as jest.Mock;
const mockPreviousInteractionLog =
	interactionMetricsModule.PreviousInteractionLog as interactionMetricsModule.PreviousInteractionLogType;

const createMockContext = (
	overrides: Partial<UFOInteractionContextType> = {},
): UFOInteractionContextType => ({
	hold: jest.fn(),
	tracePress: jest.fn(),
	labelStack: [],
	segmentIdMap: new Map(),
	addMark: jest.fn(),
	addCustomData: jest.fn(),
	addCustomTimings: jest.fn(),
	addApdex: jest.fn(),
	holdExperimental: jest.fn(),
	...overrides,
});

const createWrapper =
	(context: UFOInteractionContextType) =>
	({ children }: { children: ReactNode }) => (
		<UFOInteractionContext.Provider value={context}>{children}</UFOInteractionContext.Provider>
	);

describe('terminal-error', () => {
	const mockSink = jest.fn();
	const mockError = new TypeError('Test error message');

	beforeEach(() => {
		mockSink.mockClear();
		mockPerformanceNow.mockReturnValue(1000);
		sinkTerminalErrorHandler(mockSink);
		mockGetActiveInteraction.mockReturnValue(undefined);

		// Reset PreviousInteractionLog
		mockPreviousInteractionLog.id = undefined;
		mockPreviousInteractionLog.name = undefined;
		mockPreviousInteractionLog.type = undefined;
		mockPreviousInteractionLog.isAborted = undefined;
		mockPreviousInteractionLog.timestamp = undefined;

		// Reset UFORouteName
		UFORouteName.current = null;
	});

	describe('setTerminalError', () => {
		it('should call sink handler with error data and context', () => {
			setTerminalError(mockError);

			expect(mockSink).toHaveBeenCalledTimes(1);
			expect(mockSink).toHaveBeenCalledWith(
				expect.objectContaining({
					errorType: mockError.name,
					errorMessage: mockError.message,
					timestamp: expect.any(Number),
				}),
				expect.objectContaining({
					activeInteractionName: null,
					activeInteractionId: null,
				}),
			);
		});

		it('should truncate error messages longer than 100 characters', () => {
			const longMessage = 'a'.repeat(150);
			const error = new Error(longMessage);

			setTerminalError(error);

			expect(mockSink.mock.calls[0][0]).toEqual(
				expect.objectContaining({
					errorMessage: longMessage.slice(0, 100),
				}),
			);
		});

		it('should include additional attributes in errorData when provided', () => {
			setTerminalError(mockError, {
				teamName: 'test-team',
				packageName: 'test-package',
				errorBoundaryId: 'boundary-123',
				errorHash: 'abc123',
				traceId: 'trace-456',
				fallbackType: 'page',
				statusCode: 500,
			});

			expect(mockSink.mock.calls[0][0]).toEqual(
				expect.objectContaining({
					teamName: 'test-team',
					packageName: 'test-package',
					errorBoundaryId: 'boundary-123',
					errorHash: 'abc123',
					traceId: 'trace-456',
					fallbackType: 'page',
					statusCode: 500,
				}),
			);
		});

		it('should not call sink handler when isClientNetworkError is true', () => {
			setTerminalError(mockError, {
				isClientNetworkError: true,
				teamName: 'test-team',
			});

			expect(mockSink).not.toHaveBeenCalled();
		});

		it('should include labelStack in context when provided as third argument', () => {
			const labelStack = [
				{ name: 'app-root', segmentId: 'seg-1' },
				{ name: 'issue-navigator', segmentId: 'seg-2' },
				{ name: 'card' },
			];

			setTerminalError(mockError, undefined, labelStack);

			expect(mockSink.mock.calls[0][1]).toEqual(
				expect.objectContaining({
					labelStack,
				}),
			);
		});

		it('should include activeInteractionName, activeInteractionId, and activeInteractionType as null in context when no active interaction', () => {
			mockGetActiveInteraction.mockReturnValue(undefined);
			setTerminalError(mockError);

			expect(mockSink.mock.calls[0][1]).toEqual(
				expect.objectContaining({
					activeInteractionName: null,
					activeInteractionId: null,
					activeInteractionType: null,
					previousInteractionId: null,
					previousInteractionName: null,
					previousInteractionType: null,
					timeSincePreviousInteraction: null,
					routeName: null,
				}),
			);
		});

		it('should include previous interaction data in context when PreviousInteractionLog has values', () => {
			mockPerformanceNow.mockReturnValue(5000);

			mockPreviousInteractionLog.id = 'prev-interaction-123';
			mockPreviousInteractionLog.name = 'previous-ufo-interaction';
			mockPreviousInteractionLog.type = 'page_load';
			mockPreviousInteractionLog.timestamp = 4000;

			setTerminalError(mockError);

			expect(mockSink.mock.calls[0][1]).toEqual(
				expect.objectContaining({
					previousInteractionId: 'prev-interaction-123',
					previousInteractionName: 'previous-ufo-interaction',
					previousInteractionType: 'page_load',
					timeSincePreviousInteraction: 1000,
				}),
			);
		});

		it('should calculate timeSincePreviousInteraction as null when no previous interaction timestamp', () => {
			mockPreviousInteractionLog.id = 'prev-interaction-123';
			mockPreviousInteractionLog.name = 'previous-ufo-interaction';
			mockPreviousInteractionLog.type = 'transition';
			mockPreviousInteractionLog.timestamp = undefined;

			setTerminalError(mockError);

			expect(mockSink.mock.calls[0][1]).toEqual(
				expect.objectContaining({
					previousInteractionId: 'prev-interaction-123',
					previousInteractionName: 'previous-ufo-interaction',
					previousInteractionType: 'transition',
					timeSincePreviousInteraction: null,
				}),
			);
		});

		it('should include activeInteractionName, activeInteractionId, and activeInteractionType in context from active interaction', () => {
			mockGetActiveInteraction.mockReturnValue({
				id: 'interaction-123',
				ufoName: 'test-ufo-interaction',
				type: 'page_load',
			});

			setTerminalError(mockError);

			expect(mockSink.mock.calls[0][1]).toEqual(
				expect.objectContaining({
					activeInteractionName: 'test-ufo-interaction',
					activeInteractionId: 'interaction-123',
					activeInteractionType: 'page_load',
				}),
			);
		});

		it('should include routeName in context when UFORouteName has a value', () => {
			UFORouteName.current = 'test-route-name';

			setTerminalError(mockError);

			expect(mockSink.mock.calls[0][1]).toEqual(
				expect.objectContaining({
					routeName: 'test-route-name',
				}),
			);
		});

		it('should include routeName as null in context when UFORouteName is null', () => {
			UFORouteName.current = null;

			setTerminalError(mockError);

			expect(mockSink.mock.calls[0][1]).toEqual(
				expect.objectContaining({
					routeName: null,
				}),
			);
		});
	});

	describe('useReportTerminalError', () => {
		it('should call setTerminalError with error and labelStack from context', () => {
			const labelStack = [{ name: 'app-root', segmentId: 'seg-1' }, { name: 'card' }];
			const mockContext = createMockContext({ labelStack });

			renderHook(() => useReportTerminalError(mockError), {
				wrapper: createWrapper(mockContext),
			});

			expect(mockSink).toHaveBeenCalledTimes(1);
			expect(mockSink.mock.calls[0][0]).toEqual(
				expect.objectContaining({
					errorType: mockError.name,
					errorMessage: mockError.message,
				}),
			);
			expect(mockSink.mock.calls[0][1]).toEqual(
				expect.objectContaining({
					labelStack,
				}),
			);
		});

		it('should not call setTerminalError when error is null', () => {
			const mockContext = createMockContext();

			renderHook(() => useReportTerminalError(null), {
				wrapper: createWrapper(mockContext),
			});

			expect(mockSink).not.toHaveBeenCalled();
		});

		it('should only call setTerminalError once even on re-renders', () => {
			const mockContext = createMockContext();

			const { rerender } = renderHook(() => useReportTerminalError(mockError), {
				wrapper: createWrapper(mockContext),
			});

			expect(mockSink).toHaveBeenCalledTimes(1);

			rerender();

			expect(mockSink).toHaveBeenCalledTimes(1);
		});

		it('should include additional attributes in errorData when provided', () => {
			const mockContext = createMockContext();
			const additionalAttributes: TerminalErrorAdditionalAttributes = {
				teamName: 'test-team',
				packageName: 'test-package',
			};

			renderHook(() => useReportTerminalError(mockError, additionalAttributes), {
				wrapper: createWrapper(mockContext),
			});

			expect(mockSink.mock.calls[0][0]).toEqual(
				expect.objectContaining({
					teamName: additionalAttributes.teamName,
					packageName: additionalAttributes.packageName,
				}),
			);
		});

		it('should not call sink handler when isClientNetworkError is true', () => {
			const mockContext = createMockContext();
			const additionalAttributes: TerminalErrorAdditionalAttributes = {
				isClientNetworkError: true,
				teamName: 'test-team',
			};

			renderHook(() => useReportTerminalError(mockError, additionalAttributes), {
				wrapper: createWrapper(mockContext),
			});

			expect(mockSink).not.toHaveBeenCalled();
		});
	});
});
