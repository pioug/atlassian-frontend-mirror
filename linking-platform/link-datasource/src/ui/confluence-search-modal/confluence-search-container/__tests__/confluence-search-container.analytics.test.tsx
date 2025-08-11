import React, { useState } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { asMock } from '@atlaskit/link-test-helpers/jest';

import { EVENT_CHANNEL } from '../../../../analytics';
import { useCurrentUserInfo } from '../../basic-filters/hooks/useCurrentUserInfo';
import ConfluenceSearchContainer from '../index';

jest.mock('../../basic-filters/hooks/useCurrentUserInfo');

type MockConfluenceSearchContainerProps = Partial<
	React.ComponentProps<typeof ConfluenceSearchContainer>
> & { onSearch: jest.Mock };

const onAnalyticFireEvent = jest.fn();

const TestConfluenceSearchContainer = ({
	onSearch,
	...propsOverride
}: MockConfluenceSearchContainerProps) => {
	const [cloudId, setCloudId] = useState(propsOverride?.parameters?.cloudId ?? 'cloudId');
	const setNewCloudId = () => setCloudId(() => Math.random().toString());

	return (
		// TODO: further refactoring in EDM-9573
		// https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/pull-requests/82725/overview?commentId=6828131
		<AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
			<button data-testid="mock-set-new-cloudid" onClick={setNewCloudId}>
				New cloudid
			</button>
			<IntlProvider locale="en">
				<ConfluenceSearchContainer
					isSearching={false}
					onSearch={onSearch}
					{...propsOverride}
					parameters={{ cloudId, searchString: '', contributorAccountIds: [] }}
				/>
			</IntlProvider>
		</AnalyticsListener>
	);
};

const setup = (propsOverride?: Partial<React.ComponentProps<typeof ConfluenceSearchContainer>>) => {
	const onSearch = jest.fn();
	const container = render(
		<TestConfluenceSearchContainer {...propsOverride} onSearch={onSearch} />,
	);

	return {
		container,
		onSearch,
	};
};

const testIds = {
	searchInput: 'confluence-search-datasource-modal--basic-search-input',
	searchButton: 'confluence-search-datasource-modal--basic-search-button',
};

describe('Analytics: ConfluenceSearchContainer', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		asMock(useCurrentUserInfo).mockReturnValue({
			user: {
				accountId: '123',
			},
		});
	});

	describe('ui.form.submitted.basicSearch', () => {
		it('should fire event on search button click', async () => {
			const {
				container: { getByTestId },
			} = setup();

			const basicTextInput = getByTestId(testIds.searchInput);

			fireEvent.change(basicTextInput, {
				target: { value: 'testing' },
			});

			fireEvent.click(getByTestId(testIds.searchButton));

			expect(onAnalyticFireEvent).toHaveBeenLastCalledWith(
				expect.objectContaining({
					payload: {
						action: 'submitted',
						actionSubject: 'form',
						actionSubjectId: 'basicSearch',
						attributes: {},
						eventType: 'ui',
					},
				}),
				EVENT_CHANNEL,
			);
		});

		it('should fire event on enter key press', async () => {
			setup();

			const basicTextInput = await screen.findByTestId(testIds.searchInput);

			await userEvent.type(basicTextInput, 'testing{enter}');

			expect(onAnalyticFireEvent).toHaveBeenLastCalledWith(
				expect.objectContaining({
					payload: {
						action: 'submitted',
						actionSubject: 'form',
						actionSubjectId: 'basicSearch',
						attributes: {},
						eventType: 'ui',
					},
				}),
				EVENT_CHANNEL,
			);
		});
	});

	it('should capture and report a11y violations', async () => {
		const { container } = setup();

		await expect(container.container).toBeAccessible();
	});
});
