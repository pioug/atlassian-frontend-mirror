import { getDocument } from '@atlaskit/browser-apis';

import { ANONYMOUS_ASSETS } from '../../src/common/utils/anonymous-assets';
import { getIntl } from '../../src/common/utils/intl';

jest.mock('@atlaskit/browser-apis');

describe('getIntl', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('should return default when no lang in document', async () => {
		(getDocument as jest.Mock).mockImplementation(() => undefined);
		const intl = await getIntl();

		expect(intl.locale).toEqual('en-US');
	});

	test('should return lang from document ', async () => {
		(getDocument as jest.Mock).mockImplementation(() => ({
			documentElement: {
				lang: 'en-GB',
			},
		}));

		const intl = await getIntl();

		expect(intl.locale).toEqual('en-GB');
	});

	test('should translate to en if locale file does not exist ', async () => {
		(getDocument as jest.Mock).mockImplementation(() => ({
			documentElement: {
				lang: 'ZZ',
			},
		}));

		const intl = await getIntl();

		expect(intl.formatMessage(ANONYMOUS_ASSETS[0].messageDescriptor)).toEqual(
			'Anonymous Alligator',
		);
	});
});
