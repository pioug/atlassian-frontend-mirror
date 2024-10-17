import React, { useState } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { asMock } from '@atlaskit/link-test-helpers/jest';

import { EVENT_CHANNEL } from '../../../../analytics';
import { mockTransformedUserHydrationResponse } from '../../../../services/mocks';
import {
	type BasicFilterHydrationState,
	useBasicFilterHydration,
} from '../../basic-filters/hooks/useBasicFilterHydration';
import { useCurrentUserInfo } from '../../basic-filters/hooks/useCurrentUserInfo';
import useRecommendation from '../../basic-filters/hooks/useRecommendation';
import ConfluenceSearchContainer from '../index';

jest.mock('../../basic-filters/hooks/useCurrentUserInfo');
jest.mock('../../basic-filters/hooks/useRecommendation');
jest.mock('../../basic-filters/hooks/useBasicFilterHydration');

type MockConfluenceSearchContainerProps = Partial<
	React.ComponentProps<typeof ConfluenceSearchContainer>
> & { onSearch: jest.Mock; hookOverrides?: BasicFilterHydrationState };

const onAnalyticFireEvent = jest.fn();

const TestConfluenceSearchContainer = ({
	onSearch,
	hookOverrides,
	...propsOverride
}: MockConfluenceSearchContainerProps) => {
	const [cloudId, setCloudId] = useState(propsOverride?.parameters?.cloudId ?? '');

	const setNewCloudId = () => setCloudId(() => Math.random().toString());

	asMock(useBasicFilterHydration).mockReturnValue(
		hookOverrides || {
			reset: () => {},
		},
	);

	const parameters = {
		cloudId,
		searchString: propsOverride?.parameters?.searchString ?? '',
		contributorAccountIds: propsOverride?.parameters?.contributorAccountIds ?? [],
	};

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
					parameters={parameters}
				/>
			</IntlProvider>
		</AnalyticsListener>
	);
};
const mockOptions = [
	{
		optionType: 'avatarLabel',
		label: 'Job Bob',
		value: '5ffe1efc34847e0069446bf8',
	},
	{
		optionType: 'avatarLabel',
		label: 'Mike Scott',
		value: '62df272c3aaeedcae755c533',
	},
];
const mockUserRecommendationHook = {
	filterOptions: [],
	status: 'empty',
	fetchFilterOptions: jest.fn(),
};

const setup = (
	propsOverride?: Partial<React.ComponentProps<typeof ConfluenceSearchContainer>> & {
		hookOverrides?: BasicFilterHydrationState;
	},
) => {
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
	mockSetNewCloudId: 'mock-set-new-cloudid',
	searchInput: 'confluence-search-datasource-modal--basic-search-input',
	searchButton: 'confluence-search-datasource-modal--basic-search-button',
	editedOrCreatedByTriggerButton: 'clol-basic-filter-editedOrCreatedBy-trigger--button',
	editedOrCreatedByFilterDropdownLoader: 'clol-basic-filter-editedOrCreatedBy--loading-message',
	editedOrCreatedByFilterDropdownEmpty: 'clol-basic-filter-editedOrCreatedBy--no-options-message',
	editedOrCreatedByFilterDropdownError: 'clol-basic-filter-editedOrCreatedBy--error-message',
};

describe('ConfluenceSearchContainer', () => {
	beforeEach(() => {
		asMock(useRecommendation).mockReturnValue(mockUserRecommendationHook);
		asMock(useCurrentUserInfo).mockReturnValue({
			user: {
				accountId: '123',
			},
		});
	});

	it('should set a loading indicator if isSearching is true', async () => {
		setup({ isSearching: true });

		const searchButton = await screen.findByTestId(testIds.searchButton);
		expect(searchButton.getAttribute('aria-disabled')).toBe('true');
	});

	it('should set the initial search value based on initialSearch prop', async () => {
		setup({
			parameters: { cloudId: 'cloudId', searchString: 'blah' },
		});

		const searchInput = await screen.findByTestId(testIds.searchInput);
		expect(searchInput.getAttribute('value')).toEqual('blah');
	});

	it('should allow user to enter a value into text field, submit it, which triggers onSearch()', async () => {
		const { onSearch } = setup({
			parameters: { cloudId: 'cloudId', searchString: 'blah' },
		});

		const searchInput = await screen.findByTestId(testIds.searchInput);
		const searchButton = await screen.findByTestId(testIds.searchButton);

		await userEvent.clear(searchInput);
		await userEvent.type(searchInput, 'newvalue');
		await userEvent.keyboard('{Enter}');

		expect(searchInput.getAttribute('value')).toEqual('newvalue');

		await userEvent.click(searchButton);
		expect(onSearch).toHaveBeenCalledWith('newvalue');
	});

	it('should reset search string to "" when cloudId is changed', async () => {
		setup({
			parameters: { cloudId: 'cloudId', searchString: 'blah' },
		});

		const searchInput = await screen.findByTestId(testIds.searchInput);
		expect(searchInput.getAttribute('value')).toEqual('blah');
		await userEvent.click(await screen.findByTestId(testIds.mockSetNewCloudId));

		expect(searchInput.getAttribute('value')).toEqual('');
	});

	describe('Testing: Basic Filters', () => {
		it('should show basic filter container', async () => {
			setup();
			expect(await screen.findByTestId('clol-basic-filter-container')).toBeInTheDocument();
		});

		describe('testing "Edited/Created by" filter', () => {
			it('should render the trigger button text correctly', async () => {
				setup();

				const editedOrCreatedByTriggerButton = await screen.findByTestId(
					testIds.editedOrCreatedByTriggerButton,
				);

				expect(editedOrCreatedByTriggerButton).toHaveTextContent('Edited or created by');
			});

			it('should be disabled when cloudId is not set', async () => {
				setup({ parameters: { cloudId: '' } });

				const editedOrCreatedByTriggerButton = await screen.findByTestId(
					testIds.editedOrCreatedByTriggerButton,
				);
				expect(editedOrCreatedByTriggerButton).toBeDisabled();
			});

			it('should be disabled when userId is not set', async () => {
				asMock(useCurrentUserInfo).mockReturnValue({
					user: {},
				});

				setup({ parameters: { cloudId: 'sdf' } });

				const editedOrCreatedByTriggerButton = await screen.findByTestId(
					testIds.editedOrCreatedByTriggerButton,
				);
				expect(editedOrCreatedByTriggerButton).toBeDisabled();
			});

			it('should be enabled when cloudId and userId is present', async () => {
				setup({ parameters: { cloudId: 'abc' } });

				const editedOrCreatedByTriggerButton = await screen.findByTestId(
					testIds.editedOrCreatedByTriggerButton,
				);

				expect(editedOrCreatedByTriggerButton).toBeEnabled();
			});

			it('should show popup loader when clicking the dropdown button initially', async () => {
				asMock(useRecommendation).mockReturnValue({
					...mockUserRecommendationHook,
					status: 'loading',
				});

				setup({ parameters: { cloudId: 'abc' } });

				const editedOrCreatedByTriggerButton = await screen.findByTestId(
					testIds.editedOrCreatedByTriggerButton,
				);

				await userEvent.click(editedOrCreatedByTriggerButton);

				const filterDropdownLoader = await screen.findByTestId(
					testIds.editedOrCreatedByFilterDropdownLoader,
				);

				expect(filterDropdownLoader).toBeInTheDocument();
			});

			it('should show popup empty state when no results are avaialble', async () => {
				asMock(useRecommendation).mockReturnValue({
					...mockUserRecommendationHook,
					status: 'resolved',
				});

				setup({ parameters: { cloudId: 'abc' } });

				const editedOrCreatedByTriggerButton = await screen.findByTestId(
					testIds.editedOrCreatedByTriggerButton,
				);

				await userEvent.click(editedOrCreatedByTriggerButton);

				const filterDropdownEmpty = await screen.findByTestId(
					testIds.editedOrCreatedByFilterDropdownEmpty,
				);

				expect(filterDropdownEmpty).toBeInTheDocument();
			});

			it('should show popup error state when filter request has an error', async () => {
				asMock(useRecommendation).mockReturnValue({
					...mockUserRecommendationHook,
					status: 'rejected',
				});

				setup({ parameters: { cloudId: 'abc' } });

				const editedOrCreatedByTriggerButton = await screen.findByTestId(
					testIds.editedOrCreatedByTriggerButton,
				);

				await userEvent.click(editedOrCreatedByTriggerButton);

				const filterDropdownError = await screen.findByTestId(
					testIds.editedOrCreatedByFilterDropdownError,
				);

				expect(filterDropdownError).toBeInTheDocument();
			});

			it('should render options correctly', async () => {
				asMock(useRecommendation).mockReturnValue({
					...mockUserRecommendationHook,
					status: 'resolved',
					filterOptions: mockOptions,
				});

				setup({ parameters: { cloudId: 'abc' } });

				const editedOrCreatedByTriggerButton = await screen.findByTestId(
					testIds.editedOrCreatedByTriggerButton,
				);

				await userEvent.click(editedOrCreatedByTriggerButton);

				const [firstOption, secondOption] = await screen.findAllByTestId(
					'basic-filter-popup-select-option--avatar',
				);

				expect(firstOption).toHaveTextContent('Job Bob');
				expect(secondOption).toHaveTextContent('Mike Scott');
			});

			it('should update trigger button text when a single selection is made', async () => {
				asMock(useRecommendation).mockReturnValue({
					...mockUserRecommendationHook,
					status: 'resolved',
					filterOptions: mockOptions,
				});

				setup({ parameters: { cloudId: 'abc' } });

				const editedOrCreatedByTriggerButton = await screen.findByTestId(
					testIds.editedOrCreatedByTriggerButton,
				);

				await userEvent.click(editedOrCreatedByTriggerButton);

				const [firstOption] = screen.queryAllByTestId('basic-filter-popup-select-option--avatar');

				await userEvent.click(firstOption);

				const editedOrCreatedByTriggerButtonReRendered = await screen.findByTestId(
					testIds.editedOrCreatedByTriggerButton,
				);

				expect(editedOrCreatedByTriggerButtonReRendered).toHaveTextContent(
					'Edited or created by: Job Bob',
				);
			});

			it('should update trigger button text when multiple selections are made', async () => {
				asMock(useRecommendation).mockReturnValue({
					...mockUserRecommendationHook,
					status: 'resolved',
					filterOptions: mockOptions,
				});

				setup({ parameters: { cloudId: 'abc' } });

				const editedOrCreatedByTriggerButton = await screen.findByTestId(
					testIds.editedOrCreatedByTriggerButton,
				);

				await userEvent.click(editedOrCreatedByTriggerButton);

				const [firstOption, secondOption] = await screen.findAllByTestId(
					'basic-filter-popup-select-option--avatar',
				);

				await userEvent.click(firstOption);
				await userEvent.click(secondOption);

				const editedOrCreatedByTriggerButtonReRendered = await screen.findByTestId(
					testIds.editedOrCreatedByTriggerButton,
				);

				expect(editedOrCreatedByTriggerButtonReRendered).toHaveTextContent(
					'Edited or created by: Job Bob+1',
				);
			});

			it('should call the hydration function when intial filter value is available', () => {
				const mockHydrateUsersFromAccountIds = jest.fn();

				setup({
					parameters: {
						cloudId: 'abc',
						contributorAccountIds: ['655363:d8dff7fe-efb7-4073-a3cd-12463ac79e1c'],
					},
					hookOverrides: {
						status: 'empty',
						hydrateUsersFromAccountIds: mockHydrateUsersFromAccountIds,
						users: [],
						reset: () => {},
					},
				});

				expect(mockHydrateUsersFromAccountIds).toHaveBeenCalledTimes(1);
				expect(mockHydrateUsersFromAccountIds).toHaveBeenCalledWith([
					'655363:d8dff7fe-efb7-4073-a3cd-12463ac79e1c',
				]);
			});

			it('should not call the hydration function when intial filter value is not available', () => {
				const mockHydrateUsersFromAccountIds = jest.fn();

				setup({
					parameters: { cloudId: 'abc', contributorAccountIds: [] },
					hookOverrides: {
						status: 'empty',
						hydrateUsersFromAccountIds: mockHydrateUsersFromAccountIds,
						users: [],
						reset: () => {},
					},
				});

				expect(mockHydrateUsersFromAccountIds).toHaveBeenCalledTimes(0);
			});

			it('should hydrate and populate correct values in the filter', async () => {
				setup({
					parameters: { cloudId: 'abc', contributorAccountIds: [] },
					hookOverrides: {
						status: 'resolved',
						hydrateUsersFromAccountIds: () => {},
						users: mockTransformedUserHydrationResponse,
						reset: () => {},
					},
				});

				const editedOrCreatedByTriggerButton = await screen.findByTestId(
					testIds.editedOrCreatedByTriggerButton,
				);

				expect(editedOrCreatedByTriggerButton).toHaveTextContent(
					'Edited or created by: Peter Grasevski+3',
				);
			});

			it('should populate filter values along with the hydrated values correctly', async () => {
				asMock(useRecommendation).mockReturnValue({
					...mockUserRecommendationHook,
					status: 'resolved',
					filterOptions: mockOptions,
				});

				setup({
					parameters: { cloudId: 'abc', contributorAccountIds: [] },
					hookOverrides: {
						status: 'resolved',
						hydrateUsersFromAccountIds: () => {},
						users: [mockTransformedUserHydrationResponse[0]],
						reset: () => {},
					},
				});

				const editedOrCreatedByTriggerButton = await screen.findByTestId(
					testIds.editedOrCreatedByTriggerButton,
				);

				await userEvent.click(editedOrCreatedByTriggerButton);
				expect(await screen.findByRole('option', { name: 'Peter Grasevski' })).toBeInTheDocument();
				expect(await screen.findByRole('option', { name: 'Job Bob' })).toBeInTheDocument();
				expect(await screen.findByRole('option', { name: 'Mike Scott' })).toBeInTheDocument();
			});
		});
	});
});
