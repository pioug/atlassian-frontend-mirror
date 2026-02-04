import { context } from '@opentelemetry/api';

import { fg } from '@atlaskit/platform-feature-flags';

import { setContextManager, UFOContextManager } from '../context-manager';
import {
	clearActiveTrace,
	generateSpanId,
	getActiveTraceAsQueryParams,
	getActiveTraceHttpRequestHeaders,
	setActiveTrace,
} from '../index';


jest.mock('@atlaskit/platform-feature-flags');
const mockFg = fg as jest.Mock;

const fg_combinations = [
	[],
	['platform_ufo_enable_otel_context_manager']
]

// Configure global context manager or the OTel Context API will just undefined for the tests
const contextManager = new UFOContextManager();
// set the contextmanager somewhere we can reference it later
setContextManager(contextManager);
// Register the context manager with the global OTel API
contextManager.enable();
context.setGlobalContextManager(contextManager);


describe(`Trace context operation test suite`, () => {
	for (const fg_set of fg_combinations) {
		describe(`Feature gates: ${fg_set}`, () => {
			// beforeEach runs BEFORE each test, with access to fg_set from the closure
			beforeEach(() => {
				mockFg.mockReset(); // Clear any previous mock state

				if (fg_set.length > 0) {
					mockFg.mockImplementation((flag: string) => {
						return fg_set.includes(flag);
					});
				} else {
					// For empty fg_set, return false for all flags
					mockFg.mockImplementation(() => false);
				}
			});

			test('Should generate 64bit spanId in hex format with 16 chars in length', () => {
				for (let i = 0; i < 1000; i++) {
					// given
					// when
					const actual = generateSpanId();

					// then
					expect(actual).toMatch(/^[a-f0-9]{16}$/);
				}
			});

			test('Generate query params shall match the given trace info', () => {
				// given
				setActiveTrace('trace-id', 'span-id', 'type');
				// when
				const params = getActiveTraceAsQueryParams('url placeholder');
				// then
				expect(params).toMatch('x-b3-traceid=trace-id&x-b3-spanid=span-id');
			});

			test('Query params shall be null when no active trace presents', () => {
				// given
				clearActiveTrace();
				// when
				const params = getActiveTraceAsQueryParams('url placeholder');
				// then
				expect(params).toBeNull();
			});

			test('Active Trace Http headers shall match the active trace', () => {
				// given
				setActiveTrace('trace-id', 'span-id', 'type');
				// when
				const headers = getActiveTraceHttpRequestHeaders('url placeholder');
				// then
				expect(headers).toMatchObject({
					'X-B3-TraceId': 'trace-id',
					'X-B3-SpanId': 'span-id'
				});
			});

			test('Active Trace Http headers shall be null when no active trace presents', () => {
				// given
				clearActiveTrace();
				// when
				const headers = getActiveTraceHttpRequestHeaders('url placeholder');
				// then
				expect(headers).toBeNull();
			});
		});
	}
});