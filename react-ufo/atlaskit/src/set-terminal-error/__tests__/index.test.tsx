import React, { type ReactNode } from 'react';

import { renderHook } from '@testing-library/react';

import UFOInteractionContext, { type UFOInteractionContextType } from '../../interaction-context';
import * as interactionMetricsModule from '../../interaction-metrics';
import {
	setTerminalError,
	sinkTerminalErrorHandler,
	type TerminalErrorAdditionalAttributes,
	useReportTerminalError,
} from '../index';

jest.mock('../../interaction-metrics');

const mockGetActiveInteraction = interactionMetricsModule.getActiveInteraction as jest.Mock;

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
		sinkTerminalErrorHandler(mockSink);
		mockGetActiveInteraction.mockReturnValue(undefined);
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
	});
});
