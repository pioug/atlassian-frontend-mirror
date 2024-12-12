import { ROVO_PARAM_PREFIX } from './constants';
import { type RovoChatParams, type ValidParam } from './types';

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

	describe('getRovoParams', () => {
		it('should return an empty object if no params are present', () => {
			const params = getRovoParams();
			expect(params).toEqual({});
		});

		it('should return the correct params', () => {
			const params = getRovoParams(`http://example.com/?rovoChatPathway=chat`);
			expect(params).toEqual({ pathway: 'chat' });
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
		it('should update the params in the URL', () => {
			const params: RovoChatParams = { pathway: 'chat' };
			updatePageRovoParams(params);
			expect(window.history.pushState).toHaveBeenCalledWith(
				{},
				'',
				addRovoParamsToUrl(window.location.pathname, params),
			);
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
