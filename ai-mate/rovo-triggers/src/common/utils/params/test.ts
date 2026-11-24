import * as featureFlags from '@atlaskit/platform-feature-flags/fg';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { ROVO_PARAM_PREFIX } from './constants';
import {
	addPrefix,
	addRovoParamsToUrl,
	encodeRovoParams,
	firstCharLower,
	firstCharUpper,
	getListOfRovoParams,
	getRovoParams,
	removePrefix,
	updatePageRovoParams,
} from './index';
import { type RovoChatParams, type ValidParam } from './types';

describe('Rovo Query', () => {
	beforeAll(() => {
		jest.spyOn(window.history, 'replaceState').mockImplementation(() => {});

		jsdom.reconfigure({
			url: 'http://example.com',
		});
		Object.defineProperty(window, 'history', {
			value: {
				pushState: jest.fn(),
				replaceState: jest.fn(),
			},
			writable: true,
		});
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('getRovoParams', () => {
		it('should return an empty object if no params are present', () => {
			const params = getRovoParams();
			expect(params).toEqual({});
		});

		it('should return the correct params', () => {
			const params = getRovoParams(`http://example.com/?rovoChatPathway=chat`);
			expect(params).toEqual({ pathway: 'chat' });
		});

		it('should decode rovoChatRovoJourneyId through the shared rovoJourneyId contract', () => {
			const params = getRovoParams(`http://example.com/?rovoChatRovoJourneyId=journey-123`);
			expect(params).toEqual({ rovoJourneyId: 'journey-123' });
		});

		it('leaves boolean params undefined when they are absent', () => {
			const params = getRovoParams(`http://example.com/?rovoChatPathway=chat`);
			expect(params).toEqual({ pathway: 'chat' });
		});

		describe.each([
			['rovoChatTriggerOpen', 'triggerOpen'],
			['rovoChatStagingAreaOpen', 'stagingAreaOpen'],
			['rovoChatPromptLibraryOpen', 'promptLibraryOpen'],
		] as const)('boolean param %s', (key, field) => {
			describe('with rovo_chat_strict_boolean_url_params on', () => {
				beforeEach(() => {
					passGate('rovo_chat_strict_boolean_url_params');
				});

				it.each([
					['true', true],
					['false', false],
					['', false],
					['banana', false],
					['TRUE', false],
					['1', false],
				])('parses %p as %p', (value, expected) => {
					const params = getRovoParams(`http://example.com/?${key}=${value}`);
					expect(params[field]).toBe(expected);
				});

				it('leaves non-boolean params as strings', () => {
					const params = getRovoParams(
						`http://example.com/?${key}=true&rovoChatPrompt=false&rovoChatInsertPrompt=highlight-action`,
					);
					expect(params).toEqual({
						[field]: true,
						prompt: 'false',
						insertPrompt: 'highlight-action',
					});
				});
			});

			describe('with rovo_chat_strict_boolean_url_params off', () => {
				beforeEach(() => {
					failGate('rovo_chat_strict_boolean_url_params');
				});

				it.each(['true', 'false', 'banana'])('keeps the raw value %p', (value) => {
					const params = getRovoParams(`http://example.com/?${key}=${value}`);
					expect(params[field]).toBe(value);
				});
			});
		});

		it('checks the strict boolean gate as often for three boolean params as for one, and not without one', () => {
			// passGate replaces fg with a jest-when mock, which records each fg call twice, so this
			// compares call counts instead of expecting exactly one call.
			passGate('rovo_chat_strict_boolean_url_params');
			const fgSpy = jest.mocked(featureFlags.fg);
			fgSpy.mockClear();
			const strictGateCalls = () =>
				fgSpy.mock.calls.filter(([name]) => name === 'rovo_chat_strict_boolean_url_params');

			getRovoParams('http://example.com/?rovoChatPrompt=hello');
			expect(strictGateCalls()).toHaveLength(0);

			getRovoParams('http://example.com/?rovoChatTriggerOpen=true');
			const callsForOneBooleanParam = strictGateCalls().length;
			expect(callsForOneBooleanParam).toBeGreaterThan(0);
			fgSpy.mockClear();

			getRovoParams(
				'http://example.com/?rovoChatTriggerOpen=true&rovoChatPromptLibraryOpen=true&rovoChatStagingAreaOpen=true',
			);
			expect(strictGateCalls()).toHaveLength(callsForOneBooleanParam);
		});
	});

	describe('encodeRovoParams', () => {
		it('should return the correct encoded params string', () => {
			const params: RovoChatParams = { pathway: 'chat' };
			const encoded = encodeRovoParams(params);
			expect(encoded).toEqual('rovoChatPathway=chat');
		});

		it('should return the correct encoded params string with object', () => {
			const params: RovoChatParams = { pathway: 'chat' };
			const encoded = encodeRovoParams(params, true);
			expect(encoded).toEqual({ rovoChatPathway: 'chat' });
		});
	});

	describe('updatePageRovoParams', () => {
		// Adding params is a user-initiated navigation, so it must keep pushing a new entry.
		it('should push the updated params by default', () => {
			const params: RovoChatParams = { pathway: 'chat' };
			updatePageRovoParams(params);
			expect(window.history.pushState).toHaveBeenCalledWith(
				{},
				'',
				addRovoParamsToUrl(window.location.pathname, params),
			);
			expect(window.history.replaceState).not.toHaveBeenCalled();
		});

		it('should push the updated params when historyMode is push', () => {
			const params: RovoChatParams = { pathway: 'chat' };
			updatePageRovoParams(params, { historyMode: 'push' });
			expect(window.history.pushState).toHaveBeenCalledWith(
				{},
				'',
				addRovoParamsToUrl(window.location.pathname, params),
			);
			expect(window.history.replaceState).not.toHaveBeenCalled();
		});

		it('should replace the updated params when historyMode is replace', () => {
			const params: RovoChatParams = { conversationId: undefined };
			updatePageRovoParams(params, { historyMode: 'replace' });
			expect(window.history.replaceState).toHaveBeenCalledWith(
				{},
				'',
				addRovoParamsToUrl(window.location.pathname, params),
			);
			expect(window.history.pushState).not.toHaveBeenCalled();
		});
	});

	describe('addRovoParamsToUrl', () => {
		it('should add the params to the URL', () => {
			const url = 'http://example.com/test';
			const params: RovoChatParams = { pathway: 'chat' };
			const newUrl = addRovoParamsToUrl(url, params);
			expect(newUrl).toEqual(`${url}?rovoChatPathway=chat`);
		});

		it('should update the params in the URL', () => {
			const url = 'http://example.com/test?existing=param';
			const params: RovoChatParams = { pathway: 'chat' };
			const newUrl = addRovoParamsToUrl(url, params);
			expect(newUrl).toEqual(`${url}&rovoChatPathway=chat`);
		});

		it('should update existing rovo params', () => {
			const url = `http://example.com/test?rovoChatPathway=chat`;
			const params: RovoChatParams = { pathway: 'agents-create', agentId: '123' };
			const newUrl = addRovoParamsToUrl(url, params);
			expect(newUrl).toEqual(
				`http://example.com/test?rovoChatPathway=agents-create&rovoChatAgentId=123`,
			);
		});

		it('should add search handoff params using the shared rovoChat prefix', () => {
			const url = 'http://example.com/test';
			const params: RovoChatParams = {
				rovoJourneyId: 'journey-123',
				searchQuery: 'quarterly planning & goals',
			};

			expect(addRovoParamsToUrl(url, params)).toEqual(
				`${url}?rovoChatRovoJourneyId=journey-123&rovoChatSearchQuery=quarterly%20planning%20%26%20goals`,
			);
		});

		describe('with an existing non-boolean value for a boolean param', () => {
			const url = 'http://example.com/x?rovoChatTriggerOpen=banana';

			it('keeps the raw value with rovo_chat_strict_boolean_url_params off', () => {
				failGate('rovo_chat_strict_boolean_url_params');
				expect(addRovoParamsToUrl(url, {})).toEqual(url);
			});

			it('rewrites the value as false with rovo_chat_strict_boolean_url_params on', () => {
				passGate('rovo_chat_strict_boolean_url_params');
				expect(addRovoParamsToUrl(url, {})).toEqual(
					'http://example.com/x?rovoChatTriggerOpen=false',
				);
			});
		});
	});

	describe('getListOfRovoParams', () => {
		it('should return a list of all rovoChat params', () => {
			const params = getListOfRovoParams();
			expect(params).toEqual([
				'rovoChatPathway',
				'rovoChatAgentId',
				'rovoChatConversationId',
				'rovoChatPrompt',
				'rovoChatCloudId',
				'rovoChatTriggerOpen',
				'rovoChatInsertPrompt',
				'rovoChatStagingAreaOpen',
				'rovoChatMessageIdSelectedForPreview',
				'rovoChatInvocationIdSelectedForPreview',
				'rovoChatPromptLibraryOpen',
				'rovoChatRovoJourneyId',
				'rovoChatSearchQuery',
			]);
		});

		it('should return a list of all rovoChat params including resourceRouterQuery', () => {
			const params = getListOfRovoParams({ resourceRouterQuery: true });
			expect(params).toEqual([
				'rovoChatPathway!=false',
				'rovoChatAgentId!=false',
				'rovoChatConversationId!=false',
				'rovoChatPrompt!=false',
				'rovoChatCloudId!=false',
				'rovoChatTriggerOpen!=false',
				'rovoChatInsertPrompt!=false',
				'rovoChatStagingAreaOpen!=false',
				'rovoChatMessageIdSelectedForPreview!=false',
				'rovoChatInvocationIdSelectedForPreview!=false',
				'rovoChatPromptLibraryOpen!=false',
				'rovoChatRovoJourneyId!=false',
				'rovoChatSearchQuery!=false',
			]);
		});
	});
});

describe('Prefix manipulation functions', () => {
	describe('addPrefix', () => {
		it('should add prefix with camel case', () => {
			const param = 'testParam';
			const result = addPrefix(param as ValidParam);
			expect(result).toBe(`${ROVO_PARAM_PREFIX}TestParam`);
		});
	});

	describe('removePrefix', () => {
		it('should remove prefix with camel case', () => {
			const param = `${ROVO_PARAM_PREFIX}TestParam`;
			const result = removePrefix(param);
			expect(result).toBe('testParam');
		});
	});
});

describe('String manipulation functions', () => {
	describe('firstCharUpper', () => {
		it('should uppercase the first character of a string', () => {
			expect(firstCharUpper('hello')).toBe('Hello');
		});

		it('should return an empty string if input is empty', () => {
			expect(firstCharUpper('')).toBe('');
		});

		it('should handle single character strings', () => {
			expect(firstCharUpper('a')).toBe('A');
		});

		it('should not change the rest of the string', () => {
			expect(firstCharUpper('hello world')).toBe('Hello world');
		});
	});

	describe('firstCharLower', () => {
		it('should lowercase the first character of a string', () => {
			expect(firstCharLower('Hello')).toBe('hello');
		});

		it('should return an empty string if input is empty', () => {
			expect(firstCharLower('')).toBe('');
		});

		it('should handle single character strings', () => {
			expect(firstCharLower('A')).toBe('a');
		});

		it('should not change the rest of the string', () => {
			expect(firstCharLower('Hello World')).toBe('hello World');
		});
	});
});
