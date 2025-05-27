import { type SmartLinkResponse } from '@atlaskit/linking-types';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { SmartLinkStatus } from '../../../constants';
import { mocks } from '../../../utils/mocks';
import {
	TEST_DOCUMENT,
	TEST_NAME,
	TEST_RESOLVED_META_DATA,
	TEST_RESPONSE,
	TEST_URL,
} from '../../common/__mocks__/jsonld';
import extractLinkTitle from '../extract-link-title';

describe('extractLinkTitle', () => {
	const propUrl = 'https://props-url';
	const onClick = jest.fn();

	ffTest.both('smart_links_noun_support', 'with fg', () => {
		it('should return link title data', () => {
			const data = extractLinkTitle(SmartLinkStatus.Resolved, propUrl, TEST_RESPONSE, onClick);
			expect(data).toEqual({ onClick, text: TEST_NAME, url: TEST_URL });
		});

		it('should return url as text if name is not available', () => {
			const data = extractLinkTitle(
				SmartLinkStatus.Resolved,
				propUrl,
				{ data: { ...TEST_DOCUMENT, name: undefined }, meta: TEST_RESOLVED_META_DATA },
				onClick,
			);
			expect(data?.text).toEqual(TEST_DOCUMENT.url);
		});

		it('should return prop url if response url is not available', () => {
			const data = extractLinkTitle(
				SmartLinkStatus.Resolved,
				propUrl,
				{ data: { ...TEST_DOCUMENT, url: undefined }, meta: TEST_RESOLVED_META_DATA },
				onClick,
			);
			expect(data?.url).toEqual(propUrl);
		});

		it('should return prop url for both text and url if response name and url is not available', () => {
			const data = extractLinkTitle(
				SmartLinkStatus.Resolved,
				propUrl,
				{
					data: { ...TEST_DOCUMENT, name: undefined, url: undefined },
					meta: TEST_RESOLVED_META_DATA,
				},
				onClick,
			);
			expect(data?.text).toEqual(propUrl);
			expect(data?.url).toEqual(propUrl);
		});

		it('should return prop url for both text and url if data is not available', () => {
			// @ts-ignore For testing purpose
			const data = extractLinkTitle(SmartLinkStatus.Resolved, propUrl, {}, onClick);
			expect(data).toEqual({ onClick, text: propUrl, url: propUrl });
		});

		it('should return prop url for both text and url if response is not defined', () => {
			const data = extractLinkTitle(SmartLinkStatus.Resolved, propUrl, undefined, onClick);
			expect(data).toEqual({ onClick, text: propUrl, url: propUrl });
		});

		it.each([
			SmartLinkStatus.Errored,
			SmartLinkStatus.Fallback,
			SmartLinkStatus.Forbidden,
			SmartLinkStatus.NotFound,
			SmartLinkStatus.Resolving,
			SmartLinkStatus.Unauthorized,
		])('should return prop url if status is not resolved', (status) => {
			const data = extractLinkTitle(status, propUrl, TEST_RESPONSE, onClick);
			expect(data?.url).toEqual(propUrl);
		});
	});

	ffTest.on('smart_links_noun_support', 'with fg', () => {
		describe('with entity', () => {
			const entityText = 'I love cheese'; // mocks.nounDataSuccess.nounData?.displayName
			const entityUrl = 'https://some.url'; // mocks.nounDataSuccess.nounData?.url

			it('should return link title data', () => {
				const data = extractLinkTitle(
					SmartLinkStatus.Resolved,
					propUrl,
					mocks.nounDataSuccess,
					onClick,
				);
				expect(data).toEqual({ onClick, text: entityText, url: entityUrl });
			});

			it('should return url as text if name is not available', () => {
				const data = extractLinkTitle(
					SmartLinkStatus.Resolved,
					propUrl,
					{
						...mocks.nounDataSuccess,
						nounData: { ...mocks.nounDataSuccess.nounData, displayName: undefined },
					} as unknown as SmartLinkResponse,
					onClick,
				);
				expect(data?.text).toEqual(entityUrl);
			});

			it('should return prop url if response url is not available', () => {
				const data = extractLinkTitle(
					SmartLinkStatus.Resolved,
					propUrl,
					{
						...mocks.nounDataSuccess,
						nounData: { ...mocks.nounDataSuccess.nounData, url: undefined },
					} as unknown as SmartLinkResponse,
					onClick,
				);
				expect(data?.url).toEqual(propUrl);
			});

			it('should return prop url for both text and url if response name and url is not available', () => {
				const data = extractLinkTitle(
					SmartLinkStatus.Resolved,
					propUrl,
					{
						...mocks.nounDataSuccess,
						nounData: { ...mocks.nounDataSuccess.nounData, displayName: undefined, url: undefined },
					} as unknown as SmartLinkResponse,
					onClick,
				);
				expect(data).toEqual({ onClick, text: propUrl, url: propUrl });
			});

			it('should return prop url for both text and url if response is not defined', () => {
				const data = extractLinkTitle(SmartLinkStatus.Resolved, propUrl, undefined, onClick);
				expect(data).toEqual({ onClick, text: propUrl, url: propUrl });
			});

			it.each([
				SmartLinkStatus.Errored,
				SmartLinkStatus.Fallback,
				SmartLinkStatus.Forbidden,
				SmartLinkStatus.NotFound,
				SmartLinkStatus.Resolving,
				SmartLinkStatus.Unauthorized,
			])('should return prop url if status is not resolved', (status) => {
				const data = extractLinkTitle(status, propUrl, mocks.nounDataSuccess, onClick);
				expect(data?.url).toEqual(propUrl);
			});
		});
	});
});
