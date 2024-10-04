import { type FrontendExperimentsResponse } from '@atlaskit/feature-gate-fetcher';

import { getFrontendExperimentsResult } from '../utils';

describe('utils', () => {
	describe('getFrontendExperimentsResult', () => {
		test('all fields', () => {
			const response: FrontendExperimentsResponse = {
				experimentValues: {
					test: {
						value: '1',
					},
				},
				customAttributes: {
					attribute: 'something',
				},
				clientSdkKey: 'key',
			};

			expect(getFrontendExperimentsResult(response)).toStrictEqual({
				experimentValues: {
					test: {
						value: '1',
					},
				},
				customAttributesFromFetch: {
					attribute: 'something',
				},
				clientSdkKey: 'key',
			});
		});

		test('missing sdk key', () => {
			const response: FrontendExperimentsResponse = {
				experimentValues: {
					test: {
						value: '1',
					},
				},
				customAttributes: {
					attribute: 'something',
				},
			};

			expect(getFrontendExperimentsResult(response)).toStrictEqual({
				experimentValues: {
					test: {
						value: '1',
					},
				},
				customAttributesFromFetch: {
					attribute: 'something',
				},
				clientSdkKey: undefined,
			});
		});
	});
});
