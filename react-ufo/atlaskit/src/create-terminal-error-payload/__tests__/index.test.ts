import type { TerminalErrorContext, TerminalErrorData } from '../../set-terminal-error';
import createTerminalErrorPayload from '../index';

jest.mock('../../config', () => ({
	getConfig: jest.fn(() => ({
		product: 'test-product',
		region: 'test-region',
	})),
}));

describe('createTerminalErrorPayload', () => {
	const mockTerminalErrorData: TerminalErrorData = {
		errorType: 'Error',
		errorMessage: 'Test error message',
		timestamp: 1000,
	};

	const mockTerminalErrorContext: TerminalErrorContext = {
		activeInteractionName: null,
		activeInteractionId: null,
		activeInteractionType: null,
		previousInteractionId: null,
		previousInteractionName: null,
		previousInteractionType: null,
		timeSincePreviousInteraction: null,
		labelStack: null,
		routeName: null,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should create payload with correct base structure', () => {
		const result = createTerminalErrorPayload(mockTerminalErrorData, mockTerminalErrorContext);

		expect(result).toEqual(
			expect.objectContaining({
				actionSubject: 'experience',
				action: 'measured',
				eventType: 'operational',
				source: 'measured',
				tags: ['observability'],
			}),
		);
	});

	it('should include correct event properties', () => {
		Object.defineProperty(global, 'window', {
			value: {
				location: { hostname: 'test-hostname.com' },
			},
			writable: true,
		});

		const result = createTerminalErrorPayload(mockTerminalErrorData, mockTerminalErrorContext);

		expect(result?.attributes.properties).toEqual(
			expect.objectContaining({
				'event:hostname': 'test-hostname.com',
				'event:product': 'test-product',
				'event:schema': '1.0.0',
				'event:source': {
					name: 'react-ufo/web',
					version: '1.0.1',
				},
				'event:region': 'test-region',
				'experience:key': 'custom.terminal-error',
			}),
		);
	});

	it('should include terminal error data in payload', () => {
		const result = createTerminalErrorPayload(mockTerminalErrorData, mockTerminalErrorContext);

		expect(result?.attributes.properties.terminalError).toEqual(mockTerminalErrorData);
	});

	it('should set activeInteractionName, activeInteractionId, and activeInteractionType to null when no active interaction in context', () => {
		const result = createTerminalErrorPayload(mockTerminalErrorData, mockTerminalErrorContext);

		expect(result?.attributes.properties.activeInteractionName).toBeNull();
		expect(result?.attributes.properties.activeInteractionId).toBeNull();
		expect(result?.attributes.properties.activeInteractionType).toBeNull();
	});

	it('should set previousInteractionId, previousInteractionName, previousInteractionType, and timeSincePreviousInteraction to null when no previous interaction in context', () => {
		const result = createTerminalErrorPayload(mockTerminalErrorData, mockTerminalErrorContext);

		expect(result?.attributes.properties.previousInteractionId).toBeNull();
		expect(result?.attributes.properties.previousInteractionName).toBeNull();
		expect(result?.attributes.properties.previousInteractionType).toBeNull();
		expect(result?.attributes.properties.timeSincePreviousInteraction).toBeNull();
	});

	it('should include active interaction details from context when available', () => {
		const contextWithInteraction: TerminalErrorContext = {
			...mockTerminalErrorContext,
			activeInteractionName: 'test-ufo-interaction',
			activeInteractionId: 'interaction-123',
			activeInteractionType: 'page_load',
		};

		const result = createTerminalErrorPayload(mockTerminalErrorData, contextWithInteraction);

		expect(result?.attributes.properties.activeInteractionName).toBe('test-ufo-interaction');
		expect(result?.attributes.properties.activeInteractionId).toBe('interaction-123');
		expect(result?.attributes.properties.activeInteractionType).toBe('page_load');
	});

	it('should include previous interaction details from context when available', () => {
		const contextWithPreviousInteraction: TerminalErrorContext = {
			...mockTerminalErrorContext,
			previousInteractionId: 'prev-interaction-456',
			previousInteractionName: 'previous-ufo-interaction',
			previousInteractionType: 'page_load',
			timeSincePreviousInteraction: 1500,
		};

		const result = createTerminalErrorPayload(
			mockTerminalErrorData,
			contextWithPreviousInteraction,
		);

		expect(result?.attributes.properties.previousInteractionId).toBe('prev-interaction-456');
		expect(result?.attributes.properties.previousInteractionName).toBe('previous-ufo-interaction');
		expect(result?.attributes.properties.previousInteractionType).toBe('page_load');
		expect(result?.attributes.properties.timeSincePreviousInteraction).toBe(1500);
	});

	it('should use "unknown" for hostname when window.location.hostname is not available', () => {
		Object.defineProperty(global, 'window', {
			value: {
				location: { hostname: '' },
			},
			writable: true,
		});

		const result = createTerminalErrorPayload(mockTerminalErrorData, mockTerminalErrorContext);

		expect(result?.attributes.properties['event:hostname']).toBe('unknown');
	});

	it('should include additional attributes from terminal error data', () => {
		const dataWithAttributes: TerminalErrorData = {
			...mockTerminalErrorData,
			teamName: 'test-team',
			packageName: 'test-package',
			errorBoundaryId: 'boundary-123',
			errorHash: 'hash-456',
			traceId: 'trace-789',
			fallbackType: 'page',
			statusCode: 500,
		};

		const result = createTerminalErrorPayload(dataWithAttributes, mockTerminalErrorContext);

		expect(result?.attributes.properties.terminalError).toEqual(dataWithAttributes);
	});

	it('should include labelStack from context in payload', () => {
		const labelStack = [
			{ name: 'app-root', segmentId: 'seg-1' },
			{ name: 'issue-navigator', segmentId: 'seg-2' },
			{ name: 'card' },
		];
		const contextWithLabelStack: TerminalErrorContext = {
			...mockTerminalErrorContext,
			labelStack,
		};

		const result = createTerminalErrorPayload(mockTerminalErrorData, contextWithLabelStack);

		expect(result?.attributes.properties.labelStack).toEqual(labelStack);
	});

	it('should set labelStack to null when not provided in context', () => {
		const result = createTerminalErrorPayload(mockTerminalErrorData, mockTerminalErrorContext);

		expect(result?.attributes.properties.labelStack).toBeNull();
	});

	it('should include routeName from context in payload', () => {
		const contextWithRouteName: TerminalErrorContext = {
			...mockTerminalErrorContext,
			routeName: 'test-route-name',
		};

		const result = createTerminalErrorPayload(mockTerminalErrorData, contextWithRouteName);

		expect(result?.attributes.properties.routeName).toBe('test-route-name');
	});

	it('should set routeName to null when not provided in context', () => {
		const result = createTerminalErrorPayload(mockTerminalErrorData, mockTerminalErrorContext);

		expect(result?.attributes.properties.routeName).toBeNull();
	});
});
