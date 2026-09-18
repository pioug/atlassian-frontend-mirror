import React from 'react';

import fetchMock from 'fetch-mock/cjs/client';
import { createIntl, createIntlCache, IntlProvider } from 'react-intl';
import 'es6-promise/auto'; // 'whatwg-fetch' needs a Promise polyfill

import { act, render, waitFor } from '@atlassian/testing-library';

// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { MentionResource } from '../../../api/MentionResource';
import { type Props } from '../../../components/MentionPicker';
import { MentionPicker } from '../../../components/MentionPicker/MentionPicker';
import { type MentionsResult } from '../../../types';
import * as fireAnalyticsMentionTypeaheadEventModule from '../../../util/fire-analytics-mention-typeahead-event';
import { resultC } from '../_mention-search-results';

const mentionResource = () =>
	new MentionResource({
		url: 'boo.com/mentions',
	});

type PickerProps = Omit<Props, 'resourceProvider'>;

const setupPicker = (props?: PickerProps) => {
	const resourceProvider = mentionResource();
	const intl = createIntl({ locale: 'en' }, createIntlCache());

	render(
		<IntlProvider locale="en">
			<MentionPicker
				resourceProvider={resourceProvider}
				query=""
				createAnalyticsEvent={jest.fn()}
				intl={intl}
				{...props}
			/>
		</IntlProvider>,
	);

	return resourceProvider;
};

describe('MentionPicker', () => {
	const query = 'c';
	const props = { query };
	const mentionsResult: MentionsResult = {
		mentions: resultC,
		query,
	};
	let fireAnalyticsMock: jest.SpyInstance;
	let fireAnalyticsReturn: jest.Mock;

	beforeEach(() => {
		fireAnalyticsReturn = jest.fn();
		fireAnalyticsMock = jest
			.spyOn(fireAnalyticsMentionTypeaheadEventModule, 'fireAnalyticsMentionTypeaheadEvent')
			.mockReturnValue(fireAnalyticsReturn);

		fetchMock.mock(/\/mentions\/search\?.*query=c(&|$)/, {
			body: {
				mentions: resultC,
			},
		});
	});

	afterEach(() => {
		fetchMock.restore();
		jest.restoreAllMocks();
	});

	it('should fire analytics when new mention data is fetched', async () => {
		const resourceProvider = setupPicker(props);

		act(() => {
			resourceProvider.notify(Date.now() + 1, mentionsResult, query);
		});

		await waitFor(() => {
			expect(fireAnalyticsReturn).toHaveBeenCalledWith(
				'rendered',
				expect.any(Number),
				[
					'1810620',
					'1293711',
					'2866665',
					'89149',
					'1122770',
					'1384515',
					'372531',
					'357702',
					'2011825',
					'84107',
				],
				query,
			);
		});

		expect(fireAnalyticsMock).toHaveBeenCalled();
		await expect(document.body).toBeAccessible();
	});
});
