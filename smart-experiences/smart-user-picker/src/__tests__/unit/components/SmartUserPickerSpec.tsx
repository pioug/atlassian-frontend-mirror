import React from 'react';
import { screen, render, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';
import { type DefaultValue, type OptionData, type User } from '@atlaskit/user-picker';
import { AnalyticsListener, type AnalyticsEventPayload } from '@atlaskit/analytics-next';
// Commented due to HOT-111922
import { /* type ConcurrentExperience, */ type UFOExperience } from '@atlaskit/ufo';

import SmartUserPicker, { type Props } from '../../../index';
import MessagesIntlProvider from '../../../components/MessagesIntlProvider';

import { getUserRecommendations, hydrateDefaultValues } from '../../../service';
import {
	MockConcurrentExperienceInstance,
	flushPromises,
	temporarilySilenceActAndAtlaskitDeprecationWarnings,
} from '../_testUtils';

temporarilySilenceActAndAtlaskitDeprecationWarnings();

const mockPREFETCH_SESSION_ID = 'prefetch-session-id';

const mockMounted = new MockConcurrentExperienceInstance('smart-user-picker-rendered');
const mockOptionsShown = new MockConcurrentExperienceInstance('smart-user-picker-options-shown');
const mockUserPickerRendered = new MockConcurrentExperienceInstance('user-picker-rendered');
const mockUserPickerOptionsShown = new MockConcurrentExperienceInstance(
	'user-picker-options-shown',
);

jest.mock('@atlaskit/ufo', () => {
	const actualModule = jest.requireActual('@atlaskit/ufo');

	class MockConcurrentExperience {
		experienceId: string;
		constructor(experienceId: string) {
			this.experienceId = experienceId;
		}

		getInstance(instanceId: string): Partial<UFOExperience> {
			if (this.experienceId === 'smart-user-picker-rendered') {
				return mockMounted;
			} else if (this.experienceId === 'smart-user-picker-options-shown') {
				return mockOptionsShown;
			} else if (this.experienceId === 'user-picker-rendered') {
				return mockUserPickerRendered;
			} else if (this.experienceId === 'user-picker-options-shown') {
				return mockUserPickerOptionsShown;
			}
			throw new Error(
				`ConcurrentExperience used without id mocked in SmartUserPickerSpec: ${this.experienceId}`,
			);
		}
	}
	return {
		__esModule: true,
		...actualModule,
		ConcurrentExperience: MockConcurrentExperience,
	};
});

jest.mock('@atlaskit/select', () => ({
	__esModule: true,
	...jest.requireActual<Object>('@atlaskit/select'),
	CreatableSelect: () => {
		throw new Error('Error from inside CreatableSelect');
	},
}));

jest.mock('../../../components/MessagesIntlProvider', () => ({
	__esModule: true,
	default: jest.fn().mockImplementation((props) => props.children),
}));

jest.mock('uuid', () => ({
	__esModule: true, // needed for default imports
	v4: jest.fn(() => mockPREFETCH_SESSION_ID),
}));

jest.mock('../../../service', () => ({
	__esModule: true,
	getUserRecommendations: jest.fn(),
	hydrateDefaultValues: jest.fn(),
}));

interface DebounceFunction {
	cancel: jest.Mock;
}

jest.mock('lodash/debounce', () => (fn: DebounceFunction) => {
	fn.cancel = jest.fn();
	return fn;
});

jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn().mockImplementation((flag: string) => {
		if (flag === 'twcg-444-invite-usd-improvements-m2-gate') {
			return true;
		}
		return false;
	}),
}));

const defaultProps: Props = {
	fieldId: 'test',
	principalId: 'Context',
	productKey: 'jira',
	siteId: 'site-id',
	orgId: 'org-id',
};

const mockReturnOptions: OptionData[] = [
	{
		id: 'user1',
		name: 'user1',
		type: 'user',
	},
	{
		id: 'team1',
		name: 'team1',
		type: 'team',
	},
];

const mockConfluenceGuestUserOptions: OptionData[] = [
	{
		avatarUrl: 'someavatar.com',
		id: 'id1',
		name: 'Pranay Marella',
		type: 'user',
		lozenge: {
			text: 'GUEST',
			appearance: 'default',
		},
	},
];

const mockConfluenceGuestUserAndGroupOptions: OptionData[] = [
	{
		avatarUrl: 'someavatar.com',
		id: 'id1',
		name: 'Pranay Marella',
		type: 'user',
		lozenge: {
			text: 'GUEST',
			appearance: 'default',
		},
	},
	{
		id: 'id2',
		type: 'group',
		name: 'Group with Guests',
		lozenge: {
			text: 'GUEST',
			appearance: 'default',
		},
	},
];

const usersById: User[] = [
	{
		id: 'id1',
		type: 'user',
		avatarUrl: 'someavatar.com',
		name: 'Oliver Oldfield-Hodge',
		email: 'a@b.com',
	},
	{
		id: 'id2',
		type: 'user',
		avatarUrl: 'someavatar1.com',
		name: 'Ann Other',
		email: 'b@b.com',
	},
];
const userById = [usersById[0]];
const defaultValue: DefaultValue = [
	{
		id: 'id2',
		type: 'user',
	},
	{
		id: 'id1',
		type: 'user',
	},
];

const mockOnValueErrorDefaultValues: OptionData[] = [
	{
		id: 'id1',
		name: 'Hydrated User 1',
		type: 'user',
	},
	{
		id: 'id2',
		name: 'Hydrated User 2',
		type: 'user',
	},
];

const singleDefaultValue: DefaultValue = {
	id: 'id1',
	type: 'user',
};

const mockReturnOptionsForAnalytics = mockReturnOptions.map(({ id, type }) => ({
	id,
	type,
}));

describe('SmartUserPicker', () => {
	let getUserRecommendationsMock = getUserRecommendations as jest.Mock;
	let getUsersByIdMock = hydrateDefaultValues as jest.Mock;

	const getSmartUserPicker = (initialProps: Partial<Props> = {}) => (
		<IntlProvider locale="en">
			<SmartUserPicker {...defaultProps} {...initialProps} />
		</IntlProvider>
	);

	const renderSmartUserPicker = (initialProps: Partial<Props> = {}) =>
		render(getSmartUserPicker(initialProps));

	beforeEach(() => {
		getUserRecommendationsMock.mockReturnValue(Promise.resolve([]));
		getUsersByIdMock.mockReturnValue(Promise.resolve([]));
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('default value hydration', () => {
		it('should hydrate defaultValues for jira on mount', async () => {
			getUsersByIdMock.mockReturnValue(Promise.resolve(usersById));

			renderSmartUserPicker({
				defaultValue,
				isMulti: true,
			});

			expect(getUsersByIdMock).toHaveBeenCalledTimes(1);

			for (const user of usersById) {
				expect(await screen.findByText(user.name)).toBeInTheDocument();
			}
		});

		it('should hydrate single defaultValue for confluence on mount', async () => {
			getUsersByIdMock.mockReturnValue(Promise.resolve(userById));

			renderSmartUserPicker({
				defaultValue: singleDefaultValue,
				productKey: 'confluence',
			});

			expect(getUsersByIdMock).toHaveBeenCalledTimes(1);

			expect(await screen.findByText(userById[0].name)).toBeInTheDocument();
		});

		it('should use the overrideByline to set bylines for options', async () => {
			getUserRecommendationsMock.mockReturnValue(Promise.resolve(mockReturnOptions));

			const bylineFn = (user: any) => `byline for ${user.name}`;
			const overrideByline = jest.fn(bylineFn);

			renderSmartUserPicker({
				prefetch: true,
				overrideByline,
			});

			await waitFor(() => expect(getUserRecommendationsMock).toHaveBeenCalledTimes(1));
			expect(overrideByline).toHaveBeenCalledTimes(2);
			expect(overrideByline).toHaveBeenNthCalledWith(1, mockReturnOptions[0]);
		});

		it('should set nothing if empty', async () => {
			getUsersByIdMock.mockReturnValue(Promise.resolve([]));
			renderSmartUserPicker({
				defaultValue: [],
				productKey: 'people',
			});
			// trigger on focus
			const input = screen.getByRole('combobox');
			await userEvent.click(input);

			expect(getUsersByIdMock).toHaveBeenCalledTimes(1);
			expect(await screen.findByText('No options')).toBeInTheDocument();
		});

		it('should execute onValueError if internal hydration fails', async () => {
			const mockError = new Error();
			getUsersByIdMock.mockImplementation(() => {
				throw mockError;
			});

			const onValueError = jest.fn((error) => {
				expect(error).toEqual(mockError);
				return Promise.resolve(mockOnValueErrorDefaultValues);
			});

			renderSmartUserPicker({ defaultValue, onValueError });

			expect(onValueError).toHaveBeenCalledWith(mockError, defaultValue);
		});

		it('should fetch users on focus', async () => {
			renderSmartUserPicker();
			const input = screen.getByRole('combobox');
			await userEvent.click(input);
			expect(getUserRecommendationsMock).toHaveBeenCalledTimes(1);
		});

		it('should fetch users on query change', async () => {
			renderSmartUserPicker();

			const input = screen.getByRole('combobox');
			await userEvent.type(input, 'a');

			expect(getUserRecommendationsMock).toHaveBeenCalledTimes(2);
			expect(getUserRecommendationsMock).toHaveBeenNthCalledWith(
				1,
				expect.objectContaining({ query: '' }),
				expect.objectContaining({ defaultLocale: 'en' }),
			);
			expect(getUserRecommendationsMock).toHaveBeenNthCalledWith(
				2,
				expect.objectContaining({ query: 'a' }),
				expect.objectContaining({ defaultLocale: 'en' }),
			);
		});

		it('should use requests in submit order', async () => {
			type Deferrable<T> = Promise<T> & {
				resolve: (value: T) => void;
				reject: (err: any) => void;
			};

			const defer = <T,>(): Deferrable<T> => {
				let resolve: (value: T) => void;
				let reject: (err: any) => void;

				const p = new Promise((_resolve, _reject) => {
					resolve = _resolve;
					reject = _reject;
				});

				(p as any).resolve = (value: T) => resolve(value);
				(p as any).reject = (err: any) => reject(err);
				return p as any;
			};

			const queries = new Map<string, Deferrable<OptionData[]>>();

			/**
			 * Simulate a requst race for two queries
			 * 1. query ''
			 * 2. query 'a'
			 * 3. response 'a' ➞ [{}, {}]
			 * 4. response '' ➞ []
			 */
			getUserRecommendationsMock.mockImplementation(({ query }) => {
				if (query === '') {
					const empty = defer<OptionData[]>();
					queries.set(query, empty);
					return empty;
				}

				if (query === 'a') {
					const empty = queries.get('');
					return Promise.resolve(mockConfluenceGuestUserOptions).then((results) => {
						setTimeout(() => empty?.resolve([]), 0);
						return results;
					});
				}

				return Promise.resolve([]);
			});

			renderSmartUserPicker();
			const input = screen.getByRole('combobox');
			await userEvent.type(input, 'a');

			// wait until the deferrable for the initial request has been resolved
			await queries.get('');

			expect(await screen.findByText(mockConfluenceGuestUserOptions[0].name)).toBeInTheDocument();
		});

		it('should fetch a confluence guest user and guest group', async () => {
			getUserRecommendationsMock.mockReturnValue(
				Promise.resolve(mockConfluenceGuestUserAndGroupOptions),
			);

			const guestUser: OptionData[] = [
				{
					avatarUrl: 'someavatar.com',
					id: 'id1',
					name: 'Pranay Marella',
					type: 'user',
					lozenge: {
						text: 'GUEST',
						appearance: 'default',
					},
				},
				{
					id: 'id2',
					type: 'group',
					name: 'Group with Guests',
					lozenge: {
						text: 'GUEST',
						appearance: 'default',
					},
				},
			];

			const filterOptions = jest.fn(() => {
				return guestUser;
			});

			renderSmartUserPicker({
				filterOptions,
				productKey: 'confluence',
			});

			// trigger on focus
			const input = screen.getByRole('combobox');
			await userEvent.click(input);

			// expect api to run and fetch a guest user
			expect(getUserRecommendationsMock).toHaveBeenCalledTimes(1);

			// expect filterOptions to be called, mocks the response of a guest user
			expect(filterOptions).toHaveBeenCalled();

			for (const option of mockConfluenceGuestUserAndGroupOptions) {
				expect(await screen.findByText(option.name)).toBeInTheDocument();
			}
		});

		it('should execute onError when recommendations client returns with error', async () => {
			const request = {
				baseUrl: '',
				context: {
					childObjectId: undefined,
					containerId: undefined,
					contextType: 'test',
					objectId: undefined,
					principalId: 'Context',
					productAttributes: undefined,
					productKey: 'jira',
					sessionId: mockPREFETCH_SESSION_ID,
					siteId: 'site-id',
					organizationId: 'org-id',
				},
				includeGroups: false,
				includeTeams: false,
				includeUsers: true,
				includeNonLicensedUsers: false,
				maxNumberOfResults: 100,
				query: '',
				searchQueryFilter: undefined,
			};

			const mockError = new Error();
			getUserRecommendationsMock.mockImplementation(() => {
				throw mockError;
			});
			const onError = jest.fn((error) => {
				expect(error).toEqual(mockError);
				return Promise.resolve(mockReturnOptions);
			});

			renderSmartUserPicker({
				onError,
			});

			const input = screen.getByRole('combobox');
			await userEvent.click(input);

			expect(onError).toHaveBeenCalledWith(mockError, request);
		});

		it('should prefetch users when prefetch props is true', async () => {
			getUserRecommendationsMock.mockReturnValue(Promise.resolve(mockReturnOptions));
			renderSmartUserPicker({ prefetch: true });

			const input = screen.getByRole('combobox');
			await userEvent.click(input);
			await act(() => input.blur());

			expect(getUserRecommendationsMock).toHaveBeenCalledTimes(1);
			jest.clearAllMocks();
			await userEvent.click(input);

			expect(getUserRecommendationsMock).not.toHaveBeenCalled();
		});

		it('should not call onEmpty when picker has some results', async () => {
			getUserRecommendationsMock.mockReturnValue(Promise.resolve(mockReturnOptions));

			const user3: OptionData = {
				id: 'user3',
				name: 'user3',
				type: 'user',
			};
			const onEmpty = jest.fn(() => Promise.resolve([user3]));

			renderSmartUserPicker({ onEmpty });
			// trigger on focus
			const input = screen.getByRole('combobox');
			await userEvent.click(input);

			// expect load items from server
			expect(getUserRecommendationsMock).toHaveBeenCalledTimes(1);

			// expect on Empty to be called
			expect(onEmpty).toHaveBeenCalledTimes(0);

			for (const option of mockReturnOptions) {
				expect(await screen.findByText(option.name)).toBeInTheDocument();
			}
		});

		it('should use provided promise onEmpty', async () => {
			getUserRecommendationsMock.mockReturnValue(Promise.resolve([]));

			const user3: OptionData = {
				id: 'user3',
				name: 'user3',
				type: 'user',
			};
			const onEmpty = jest.fn(() => Promise.resolve([user3]));

			renderSmartUserPicker({
				onEmpty,
			});

			// trigger on focus
			const input = screen.getByRole('combobox');
			await userEvent.click(input);

			// expect load items from server
			expect(getUserRecommendationsMock).toHaveBeenCalledTimes(1);

			// expect on Empty to be called
			expect(onEmpty).toHaveBeenCalledTimes(1);

			expect(await screen.findByText(user3.name)).toBeInTheDocument();
		});

		it('should use provided promise transformOptions', async () => {
			getUserRecommendationsMock.mockReturnValue(Promise.resolve([]));

			const user3: OptionData = {
				id: 'user3',
				name: 'user3',
				type: 'user',
			};

			const transformOptions = jest.fn(() => Promise.resolve([user3]));

			renderSmartUserPicker({
				transformOptions,
			});

			// trigger on focus
			const input = screen.getByRole('combobox');
			await userEvent.click(input);

			// expect load items from server
			expect(getUserRecommendationsMock).toHaveBeenCalledTimes(1);

			// expect on transformOptions to be called
			expect(transformOptions).toHaveBeenCalledTimes(1);
			expect(transformOptions).toHaveBeenCalledWith([], '');

			expect(await screen.findByText(user3.name)).toBeInTheDocument();
		});

		it('should call both transformOptions and onEmpty when transformOptions returns empty array', async () => {
			getUserRecommendationsMock.mockReturnValue(Promise.resolve([]));

			const user3: OptionData = {
				id: 'user3',
				name: 'user3',
				type: 'user',
			};

			const transformOptions = jest.fn(() => Promise.resolve([]));
			const onEmpty = jest.fn(() => Promise.resolve([user3]));

			renderSmartUserPicker({
				transformOptions,
				onEmpty,
			});

			// trigger on focus
			const input = screen.getByRole('combobox');
			await userEvent.click(input);

			// expect load items from server
			expect(getUserRecommendationsMock).toHaveBeenCalledTimes(1);

			// expect transformOptions to be called first
			expect(transformOptions).toHaveBeenCalledTimes(1);
			expect(transformOptions).toHaveBeenCalledWith([], '');

			// expect onEmpty to be called since transformOptions returned empty array
			expect(onEmpty).toHaveBeenCalledTimes(1);
			expect(onEmpty).toHaveBeenCalledWith('');

			expect(await screen.findByText(user3.name)).toBeInTheDocument();
		});

		it('should call only transformOptions when transformOptions returns non-empty array', async () => {
			getUserRecommendationsMock.mockReturnValue(Promise.resolve([]));

			const user3: OptionData = {
				id: 'user3',
				name: 'user3',
				type: 'user',
			};

			const user4: OptionData = {
				id: 'user4',
				name: 'user4',
				type: 'user',
			};

			const transformOptions = jest.fn(() => Promise.resolve([user3]));
			const onEmpty = jest.fn(() => Promise.resolve([user4]));

			renderSmartUserPicker({
				transformOptions,
				onEmpty,
			});

			// trigger on focus
			const input = screen.getByRole('combobox');
			await userEvent.click(input);

			// expect load items from server
			expect(getUserRecommendationsMock).toHaveBeenCalledTimes(1);

			// expect transformOptions to be called
			expect(transformOptions).toHaveBeenCalledTimes(1);
			expect(transformOptions).toHaveBeenCalledWith([], '');

			// expect onEmpty NOT to be called since transformOptions returned non-empty array
			expect(onEmpty).toHaveBeenCalledTimes(0);

			expect(await screen.findByText(user3.name)).toBeInTheDocument();
			expect(screen.queryByText(user4.name)).not.toBeInTheDocument();
		});

		it('should not use provided promise transformOptions when not provided', async () => {
			getUserRecommendationsMock.mockReturnValue(Promise.resolve(mockReturnOptions));

			const user3: OptionData = {
				id: 'user3',
				name: 'user3',
				type: 'user',
			};

			const transformOptions = jest.fn(() => Promise.resolve([user3]));

			renderSmartUserPicker({});

			// trigger on focus
			const input = screen.getByRole('combobox');
			await userEvent.click(input);

			// expect load items from server
			expect(getUserRecommendationsMock).toHaveBeenCalledTimes(1);

			// expect on transformOptions to be not be called
			expect(transformOptions).toHaveBeenCalledTimes(0);
			for (const option of mockReturnOptions) {
				expect(await screen.findByText(option.name)).toBeInTheDocument();
			}
		});

		it('should pass query parameter to transformOptions', async () => {
			getUserRecommendationsMock.mockReturnValue(Promise.resolve([]));

			const user3: OptionData = {
				id: 'user3',
				name: 'user3',
				type: 'user',
			};

			const transformOptions = jest.fn(() => Promise.resolve([user3]));

			renderSmartUserPicker({
				transformOptions,
			});

			// trigger on focus and type
			const input = screen.getByRole('combobox');
			await userEvent.click(input);
			await userEvent.type(input, 'test query');

			// expect load items from server, called for each character typed
			expect(getUserRecommendationsMock).toHaveBeenCalledTimes(11);

			// expect transformOptions to be called with the query matching the input
			expect(transformOptions).toHaveBeenCalledWith([], 'test query');

			expect(await screen.findByText(user3.name)).toBeInTheDocument();
		});

		describe('filterOptions', () => {
			it('should filter options from suggested options', async () => {
				getUserRecommendationsMock.mockReturnValue(Promise.resolve(mockReturnOptions));
				const filterOptions = jest.fn((options: OptionData[]) => {
					return options.filter((option) => option.type === 'user');
				});

				renderSmartUserPicker({ filterOptions });

				// trigger on focus
				const input = screen.getByRole('combobox');
				await userEvent.type(input, 'user');

				expect(filterOptions).toHaveBeenCalledWith(mockReturnOptions, 'user');

				for (const option of filterOptions(mockReturnOptions)) {
					expect(await screen.findByText(option.name)).toBeInTheDocument();
				}
			});

			it('should apply new filterOptions if filterOptions changes', async () => {
				getUserRecommendationsMock.mockReturnValue(Promise.resolve(mockReturnOptions));
				const filterOptions = jest.fn((options: OptionData[]) => {
					return options.filter((option) => option.type === 'user');
				});
				const changedFilterOptions = jest.fn((options: OptionData[]) => {
					return options.filter((option) => option.type === 'team');
				});

				const { rerender } = renderSmartUserPicker({ filterOptions });

				// trigger on focus
				const input = screen.getByRole('combobox');
				await userEvent.type(input, 'user');

				expect(changedFilterOptions).toHaveBeenCalledTimes(0);

				rerender(getSmartUserPicker({ filterOptions: changedFilterOptions }));

				await userEvent.type(input, 'team');

				for (const option of changedFilterOptions(mockReturnOptions)) {
					expect(await screen.findByText(option.name)).toBeInTheDocument();
				}
			});

			it('should override onError when recommendations client returns with error', async () => {
				const mockError = new Error();
				getUserRecommendationsMock.mockImplementation(() => {
					throw mockError;
				});
				const filterOptions = jest.fn(() => mockReturnOptions);
				const onError = jest.fn((error) => {
					expect(error).toEqual(mockError);
					return Promise.resolve([]);
				});
				renderSmartUserPicker({
					filterOptions,
					onError,
				});

				// trigger on focus
				const input = screen.getByRole('combobox');
				await userEvent.click(input);

				expect(onError).toHaveBeenCalled();
				expect(filterOptions).toHaveBeenCalled();

				for (const option of mockReturnOptions) {
					expect(await screen.findByText(option.name)).toBeInTheDocument();
				}
			});

			it('should apply filter to onEmpty results', async () => {
				getUserRecommendationsMock.mockReturnValue(Promise.resolve(mockReturnOptions));

				const user3: OptionData = {
					id: 'user3',
					name: 'user3',
					type: 'user',
				};
				const onEmpty = jest.fn(() => Promise.resolve([user3]));
				const filterOptions = jest.fn(() => []);

				renderSmartUserPicker({
					filterOptions,
					onEmpty,
				});

				// trigger on focus
				const input = screen.getByRole('combobox');
				await userEvent.click(input);

				expect(await screen.findByText('No options')).toBeInTheDocument();
			});

			it('should apply filterOptions to bootstrap', async () => {
				const bootstrapOptions = mockReturnOptions;
				const filterOptions = jest.fn((options: OptionData[]) => {
					return options.filter((option) => option.type === 'user');
				});

				renderSmartUserPicker({
					bootstrapOptions,
					filterOptions,
				});

				// trigger on focus
				const input = screen.getByRole('combobox');
				await userEvent.click(input);

				expect(getUserRecommendationsMock).toHaveBeenCalledTimes(0);
				expect(filterOptions).toHaveBeenCalled();

				for (const option of filterOptions(mockReturnOptions)) {
					expect(await screen.findByText(option.name)).toBeInTheDocument();
				}
			});
		});

		it('should pass default principalId if principalId not provided as props', async () => {
			renderSmartUserPicker({ principalId: undefined });

			// trigger on focus
			const input = screen.getByRole('combobox');
			await userEvent.click(input);

			expect(getUserRecommendationsMock).toHaveBeenCalledTimes(1);
			expect(getUserRecommendationsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					context: expect.objectContaining({ principalId: 'Context' }),
				}),
				expect.objectContaining({ defaultLocale: 'en' }),
			);
		});

		describe('userResolvers', () => {
			const mockUserResolverResults: OptionData[] = [
				{
					id: 'resolver-user1',
					name: 'Resolver User 1',
					type: 'user',
				},
				{
					id: 'resolver-user2',
					name: 'Resolver User 2',
					type: 'user',
				},
			];

			const mockAdditionalResolverResults: OptionData[] = [
				{
					id: 'resolver-user3',
					name: 'Resolver User 3',
					type: 'user',
				},
			];

			it('should call userResolvers with the query and merge results', async () => {
				getUserRecommendationsMock.mockReturnValue(Promise.resolve(mockReturnOptions));

				const mockResolver = jest.fn().mockResolvedValue(mockUserResolverResults);
				Object.defineProperty(mockResolver, 'name', { value: 'TestResolver' });

				renderSmartUserPicker({
					userResolvers: [mockResolver],
				});

				// trigger on focus
				const input = screen.getByRole('combobox');
				await userEvent.click(input);

				expect(mockResolver).toHaveBeenCalledWith('');
				expect(getUserRecommendationsMock).toHaveBeenCalledTimes(1);

				for (const option of mockReturnOptions) {
					expect(await screen.findByText(option.name)).toBeInTheDocument();
				}
				for (const option of mockUserResolverResults) {
					expect(await screen.findByText(option.name)).toBeInTheDocument();
				}
			});

			it('should call userResolvers with typed query', async () => {
				getUserRecommendationsMock.mockReturnValue(Promise.resolve([]));

				const mockResolver = jest.fn().mockResolvedValue(mockUserResolverResults);
				Object.defineProperty(mockResolver, 'name', { value: 'TestResolver' });

				renderSmartUserPicker({
					userResolvers: [mockResolver],
				});

				const input = screen.getByRole('combobox');
				await userEvent.type(input, 'test query');

				expect(mockResolver).toHaveBeenCalledWith('test query');
			});

			it('should work with multiple userResolvers', async () => {
				getUserRecommendationsMock.mockReturnValue(Promise.resolve([]));

				const mockResolver1 = jest.fn().mockResolvedValue(mockUserResolverResults);
				Object.defineProperty(mockResolver1, 'name', { value: 'TestResolver1' });

				const mockResolver2 = jest.fn().mockResolvedValue(mockAdditionalResolverResults);
				Object.defineProperty(mockResolver2, 'name', { value: 'TestResolver2' });

				renderSmartUserPicker({
					userResolvers: [mockResolver1, mockResolver2],
				});

				const input = screen.getByRole('combobox');
				await userEvent.click(input);

				expect(mockResolver1).toHaveBeenCalledWith('');
				expect(mockResolver2).toHaveBeenCalledWith('');

				for (const option of mockUserResolverResults) {
					expect(await screen.findByText(option.name)).toBeInTheDocument();
				}
				for (const option of mockAdditionalResolverResults) {
					expect(await screen.findByText(option.name)).toBeInTheDocument();
				}
			});

			it('should handle userResolver errors gracefully', async () => {
				getUserRecommendationsMock.mockReturnValue(Promise.resolve(mockReturnOptions));

				const mockResolver = jest.fn().mockRejectedValue(new Error('Resolver failed'));
				Object.defineProperty(mockResolver, 'name', { value: 'FailingResolver' });

				renderSmartUserPicker({
					userResolvers: [mockResolver],
				});

				const input = screen.getByRole('combobox');
				await userEvent.click(input);

				expect(mockResolver).toHaveBeenCalledWith('');

				for (const option of mockReturnOptions) {
					expect(await screen.findByText(option.name)).toBeInTheDocument();
				}
			});

			it('should work when userResolvers is undefined', async () => {
				getUserRecommendationsMock.mockReturnValue(Promise.resolve(mockReturnOptions));

				renderSmartUserPicker({
					userResolvers: undefined,
				});

				const input = screen.getByRole('combobox');
				await userEvent.click(input);

				for (const option of mockReturnOptions) {
					expect(await screen.findByText(option.name)).toBeInTheDocument();
				}
			});

			it('should work when userResolvers is empty array', async () => {
				getUserRecommendationsMock.mockReturnValue(Promise.resolve(mockReturnOptions));

				renderSmartUserPicker({
					userResolvers: [],
				});

				const input = screen.getByRole('combobox');
				await userEvent.click(input);

				for (const option of mockReturnOptions) {
					expect(await screen.findByText(option.name)).toBeInTheDocument();
				}
			});

			it('should track userResolver names in analytics for successful requests', async () => {
				const onEvent = jest.fn();
				getUserRecommendationsMock.mockReturnValue(Promise.resolve(mockReturnOptions));

				const mockResolver1 = jest.fn().mockResolvedValue(mockUserResolverResults);
				Object.defineProperty(mockResolver1, 'name', { value: 'CustomResolver1' });

				const mockResolver2 = jest.fn().mockResolvedValue([]);
				Object.defineProperty(mockResolver2, 'name', { value: 'CustomResolver2' });

				render(
					<IntlProvider locale="en">
						<AnalyticsListener channel="fabric-elements" onEvent={onEvent}>
							<SmartUserPicker {...defaultProps} userResolvers={[mockResolver1, mockResolver2]} />
						</AnalyticsListener>
					</IntlProvider>,
				);

				const input = screen.getByRole('combobox');
				await userEvent.click(input);

				await waitFor(() => {
					expect(onEvent).toHaveBeenCalledWith(
						expect.objectContaining({
							payload: expect.objectContaining({
								action: 'successful',
								actionSubject: 'usersRequest',
								attributes: expect.objectContaining({
									userResolvers: ['CustomResolver1', 'CustomResolver2'],
								}),
							}),
						}),
						'fabric-elements',
					);
				});
			});

			it('should track empty userResolvers array in analytics when none provided', async () => {
				const onEvent = jest.fn();
				getUserRecommendationsMock.mockReturnValue(Promise.resolve(mockReturnOptions));

				render(
					<IntlProvider locale="en">
						<AnalyticsListener channel="fabric-elements" onEvent={onEvent}>
							<SmartUserPicker {...defaultProps} />
						</AnalyticsListener>
					</IntlProvider>,
				);

				const input = screen.getByRole('combobox');
				await userEvent.click(input);

				await waitFor(() => {
					expect(onEvent).toHaveBeenCalledWith(
						expect.objectContaining({
							payload: expect.objectContaining({
								action: 'successful',
								actionSubject: 'usersRequest',
								attributes: expect.objectContaining({
									userResolvers: [],
								}),
							}),
						}),
						'fabric-elements',
					);
				});
			});

			it('should handle userResolvers that return different types of options', async () => {
				getUserRecommendationsMock.mockReturnValue(Promise.resolve([]));

				const mockTeamResolverResults: OptionData[] = [
					{
						id: 'resolver-team1',
						name: 'Resolver Team 1',
						type: 'team',
					},
				];

				const mockResolver = jest.fn().mockResolvedValue(mockTeamResolverResults);
				Object.defineProperty(mockResolver, 'name', { value: 'TeamResolver' });

				renderSmartUserPicker({
					userResolvers: [mockResolver],
				});

				const input = screen.getByRole('combobox');
				await userEvent.click(input);

				expect(mockResolver).toHaveBeenCalledWith('');

				for (const option of mockTeamResolverResults) {
					expect(await screen.findByText(option.name)).toBeInTheDocument();
				}
			});
		});

		describe('analytics', () => {
			const onEvent = jest.fn();

			const constructPayload = (
				action: string,
				actionSubject: string,
				attributes = {},
			): AnalyticsEventPayload => {
				return expect.objectContaining({
					eventType: 'operational',
					action,
					actionSubject,
					source: 'smart-user-picker',
					attributes: expect.objectContaining({
						context: 'test',
						prefetch: false,
						packageName: expect.any(String),
						sessionId: mockPREFETCH_SESSION_ID,
						queryLength: 0,
						...attributes,
					}),
				});
			};

			const constructPayloadWithQueryAttributes = (
				action: string,
				actionSubject: string,
				attributes = {},
			): AnalyticsEventPayload => {
				const defaultQueryAttributes = {
					principalId: 'Context',
					productKey: 'jira',
					siteId: 'site-id',
					orgId: 'org-id',
				};
				return constructPayload(action, actionSubject, {
					...defaultQueryAttributes,
					...attributes,
				});
			};

			const renderAnalyticsTestComponent = (props: Partial<Props> = {}) =>
				render(
					<IntlProvider locale="en">
						<AnalyticsListener channel="fabric-elements" onEvent={onEvent}>
							<SmartUserPicker {...defaultProps} {...props} />
						</AnalyticsListener>
					</IntlProvider>,
				);

			beforeEach(() => {
				getUserRecommendationsMock.mockReturnValue(Promise.resolve(mockReturnOptions));
			});

			afterEach(() => {
				onEvent.mockClear();
			});

			it('should trigger users requested event', async () => {
				renderAnalyticsTestComponent();

				// trigger on focus
				const input = screen.getByRole('combobox');
				await userEvent.click(input);

				expect(onEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						payload: constructPayloadWithQueryAttributes('requested', 'users'),
					}),
					'fabric-elements',
				);

				await userEvent.type(input, 'a');
				expect(onEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						payload: constructPayloadWithQueryAttributes('requested', 'users', {
							queryLength: 1,
						}),
					}),
					'fabric-elements',
				);
			});

			it('should trigger users filtered event', async () => {
				renderAnalyticsTestComponent();

				// trigger on focus
				const input = screen.getByRole('combobox');
				await userEvent.click(input);

				// initial filter when no reults returned
				expect(onEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						payload: constructPayload('filtered', 'users', {
							all: [],
							filtered: [],
						}),
					}),
					'fabric-elements',
				);

				// don't wait so that filter can be applied while loading is true
				await userEvent.type(input, 'u');
				expect(onEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						payload: constructPayload('filtered', 'users', {
							queryLength: 1,
							filtered: [{ id: 'user1', type: 'user' }],
							all: mockReturnOptionsForAnalytics,
						}),
					}),
					'fabric-elements',
				);
			});

			it('should trigger user request successful event', async () => {
				const productAttributes = {
					isEntitledConfluenceExternalCollaborator: false,
				};
				const filterOptions = jest.fn((options: OptionData[]) => {
					return options.filter((option) => option.type === 'user');
				});

				renderAnalyticsTestComponent({ filterOptions, productAttributes });

				// trigger on focus
				const input = screen.getByRole('combobox');
				await userEvent.click(input);

				expect(onEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						payload: constructPayloadWithQueryAttributes('successful', 'usersRequest', {
							users: mockReturnOptionsForAnalytics,
							productAttributes,
						}),
					}),
					'fabric-elements',
				);
			});

			it('should trigger prefetch mounted event', async () => {
				renderAnalyticsTestComponent({ prefetch: true });

				// trigger on focus
				const input = screen.getByRole('combobox');
				await userEvent.click(input);

				expect(onEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						payload: constructPayloadWithQueryAttributes('mounted', 'prefetch', {
							prefetch: true,
							sessionId: mockPREFETCH_SESSION_ID,
						}),
					}),
					'fabric-elements',
				);

				expect(onEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						payload: constructPayloadWithQueryAttributes('successful', 'usersRequest', {
							prefetch: true,
							users: mockReturnOptionsForAnalytics,
							sessionId: mockPREFETCH_SESSION_ID,
						}),
					}),
					'fabric-elements',
				);
			});

			it('should trigger user request failed event', async () => {
				renderAnalyticsTestComponent();

				const mockError = new Error();
				getUserRecommendationsMock.mockImplementation(() => {
					throw mockError;
				});

				// trigger on focus
				const input = screen.getByRole('combobox');
				await userEvent.click(input);

				expect(onEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						payload: constructPayloadWithQueryAttributes('failed', 'usersRequest'),
					}),
					'fabric-elements',
				);
			});

			it('should return the options that it was passed in bootstrapOptions', async () => {
				getUserRecommendationsMock.mockReturnValue(Promise.resolve(mockReturnOptions));

				const exampleUsers: OptionData[] = [
					{
						id: 'id2',
						avatarUrl: 'someavatar1.com',
						name: 'Ann Other',
					},
					{
						id: 'id1',
						avatarUrl: 'someavatar.com',
						name: 'Oliver Oldfield-Hodge',
					},
					{
						id: 'id2',
						avatarUrl: 'someavatar.com',
						name: 'Kira Molloy',
					},
				];
				const bootstrapOptions = exampleUsers;

				renderAnalyticsTestComponent({
					bootstrapOptions,
				});

				// trigger on focus
				const input = screen.getByRole('combobox');
				await userEvent.click(input);

				expect(getUserRecommendationsMock).toHaveBeenCalledTimes(0);

				for (const option of exampleUsers) {
					expect(await screen.findByText(option.name)).toBeInTheDocument();
				}
			});

			it('should return the empty options that it was passed in bootstrapOptions', async () => {
				getUserRecommendationsMock.mockReturnValue(Promise.resolve(mockReturnOptions));

				const exampleUsers: OptionData[] = [];
				const bootstrapOptions = exampleUsers;

				renderAnalyticsTestComponent({
					bootstrapOptions,
				});

				// trigger on focus
				const input = screen.getByRole('combobox');
				await userEvent.click(input);

				expect(getUserRecommendationsMock).toHaveBeenCalledTimes(0);

				for (const option of exampleUsers) {
					expect(await screen.findByText(option.name)).toBeInTheDocument();
				}
			});

			it('should trigger preparedUsers loaded event', async () => {
				renderAnalyticsTestComponent({ prefetch: true });

				await act(flushPromises);

				// trigger on focus
				const input = screen.getByRole('combobox');
				await userEvent.type(input, 'a');

				expect(onEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						payload: constructPayloadWithQueryAttributes('loaded', 'preparedUsers', {
							prefetch: true,
							preparedSessionId: mockPREFETCH_SESSION_ID,
							sessionId: mockPREFETCH_SESSION_ID,
						}),
					}),
					'fabric-elements',
				);
			});
		});
	});

	describe('UFO metrics', () => {
		beforeEach(() => {
			jest.spyOn(console, 'error');
			// @ts-ignore
			// eslint-disable-next-line no-console
			console.error.mockImplementation(() => {});
			mockMounted.mockReset();
			mockOptionsShown.mockReset();
		});

		afterEach(() => {
			// @ts-ignore
			// eslint-disable-next-line no-console
			console.error.mockRestore();
			// @ts-ignore
			MessagesIntlProvider.mockImplementation((props) => props.children);
		});

		describe('initial mount UFO event', () => {
			it('should send a UFO success metric when mounted successfully', async () => {
				renderSmartUserPicker();
				expect(mockMounted.startSpy).toHaveBeenCalled();
				expect(mockMounted.successSpy).toHaveBeenCalled();
				expect(mockOptionsShown.startSpy).not.toHaveBeenCalled();
				expect(mockMounted.transitions).toStrictEqual([
					'NOT_STARTED',
					// Initial mount
					'STARTED',
					'SUCCEEDED',
				]);
			});

			it('should send a UFO failure metric when mount fails', async () => {
				// @ts-ignore
				MessagesIntlProvider.mockImplementation(() => {
					throw new Error('Mount error1');
				});

				renderSmartUserPicker();

				expect(mockMounted.startSpy).toHaveBeenCalled();
				expect(mockMounted.failureSpy).toHaveBeenCalled();
				expect(mockOptionsShown.startSpy).not.toHaveBeenCalled();

				expect(mockMounted.transitions).toStrictEqual([
					'NOT_STARTED',
					// Initial mount
					'STARTED',
					'STARTED', // RTL calls render twice
					'FAILED',
				]);
			});
		});

		[true, false].forEach((isPrefetch) => {
			describe(`when showing list after focusing in input (prefetch=${isPrefetch})`, () => {
				it('should send a UFO success when the list of users are shown after focus', async () => {
					getUserRecommendationsMock.mockReturnValue(Promise.resolve(mockReturnOptions));

					renderSmartUserPicker({ prefetch: isPrefetch });

					// Focus in the user picker so the user list is shown
					const input = screen.getByRole('combobox');
					await userEvent.click(input);

					await waitFor(() => expect(mockOptionsShown.startSpy).toHaveBeenCalled());
					expect(mockOptionsShown.successSpy).toHaveBeenCalled();
					expect(mockOptionsShown.failureSpy).not.toHaveBeenCalled();
					expect(mockOptionsShown.transitions).toStrictEqual([
						'NOT_STARTED',
						// Initial focus
						'STARTED',
						'SUCCEEDED',
					]);
				});

				it('should send a UFO failure when the list of users cannot be shown after focus', async () => {
					getUserRecommendationsMock.mockImplementation(() =>
						Promise.reject({
							message: `Cannot call getUserRecommendations`,
							statusCode: 500,
						}),
					);
					renderSmartUserPicker({ prefetch: isPrefetch });

					// await act(flushPromises);

					// Focus in the user picker so the user list is shown
					const input = screen.getByRole('combobox');
					await act(() => input.focus());

					// await act(flushPromises);

					expect(mockOptionsShown.startSpy).toHaveBeenCalled();
					expect(mockOptionsShown.failureSpy).toHaveBeenCalled();
					expect(mockOptionsShown.successSpy).not.toHaveBeenCalled();

					expect(mockOptionsShown.transitions).toStrictEqual([
						'NOT_STARTED',
						// Initial focus
						'STARTED',
						'FAILED',
					]);
				});

				it('should not send a UFO failure when the list of users cannot be shown after focus but the error is not a 5xx', async () => {
					getUserRecommendationsMock.mockImplementation(() =>
						Promise.reject({
							message: `Cannot call getUserRecommendations`,
							statusCode: 400,
						}),
					);
					renderSmartUserPicker({ prefetch: isPrefetch });

					// Focus in the user picker so the user list is shown
					// @ts-ignore in this case UserPicker.onFocus is not undefined
					const input = screen.getByRole('combobox');
					await act(() => input.focus());

					expect(mockOptionsShown.startSpy).toHaveBeenCalled();
					expect(mockOptionsShown.failureSpy).not.toHaveBeenCalled();
					expect(mockOptionsShown.successSpy).not.toHaveBeenCalled();
					expect(mockOptionsShown.abortSpy).toHaveBeenCalled();

					expect(mockOptionsShown.transitions).toStrictEqual([
						'NOT_STARTED',
						// Initial focus
						'STARTED',
						'ABORTED',
					]);
				});

				it('should send a UFO success when URS request fails but the onError fallback succeeds, so the list of users can be shown after focus', async () => {
					getUserRecommendationsMock.mockImplementationOnce(() => {
						throw new Error('Cannot call getUserRecommendations');
					});
					renderSmartUserPicker({
						prefetch: isPrefetch,
						onError: async () => [],
					});

					// Focus in the user picker so the user list is shown
					const input = screen.getByRole('combobox');
					await act(() => input.focus());

					expect(mockOptionsShown.startSpy).toHaveBeenCalled();
					expect(mockOptionsShown.failureSpy).not.toHaveBeenCalled();
					expect(mockOptionsShown.successSpy).toHaveBeenCalled();

					expect(mockOptionsShown.transitions).toStrictEqual([
						'NOT_STARTED',
						// Initial focus
						'STARTED',
						'SUCCEEDED',
					]);
				});

				it('should send a UFO failure when both the URS and fallback onError requests fail, so the list of users cannot be shown after focus', async () => {
					getUserRecommendationsMock.mockImplementation(() =>
						Promise.reject({
							message: `Cannot call getUserRecommendations`,
							statusCode: 500,
						}),
					);
					renderSmartUserPicker({
						prefetch: isPrefetch,
						onError: async () => {
							throw new Error('Fallback lookup failed');
						},
					});

					// Focus in the user picker so the user list is shown
					const input = screen.getByRole('combobox');
					await act(() => input.focus());

					expect(mockOptionsShown.startSpy).toHaveBeenCalled();
					expect(mockOptionsShown.failureSpy).toHaveBeenCalled();
					expect(mockOptionsShown.successSpy).not.toHaveBeenCalled();

					expect(mockOptionsShown.transitions).toStrictEqual([
						'NOT_STARTED',
						// Initial focus
						'STARTED',
						'FAILED',
					]);
				});

				it('should not send a UFO failure when both the URS and fallback onError requests fail, so the list of users cannot be shown after focus but the error is not a 5xx', async () => {
					getUserRecommendationsMock.mockImplementation(() =>
						Promise.reject({
							message: `Cannot call getUserRecommendations`,
							statusCode: 400,
						}),
					);
					renderSmartUserPicker({
						prefetch: isPrefetch,
						onError: async () => {
							throw new Error('Fallback lookup failed');
						},
					});

					// Focus in the user picker so the user list is shown
					const input = screen.getByRole('combobox');
					await act(() => input.focus());

					expect(mockOptionsShown.startSpy).toHaveBeenCalledTimes(1);
					expect(mockOptionsShown.failureSpy).not.toHaveBeenCalled();
					expect(mockOptionsShown.successSpy).not.toHaveBeenCalled();
					expect(mockOptionsShown.abortSpy).toHaveBeenCalledTimes(1);

					expect(mockOptionsShown.transitions).toStrictEqual([
						'NOT_STARTED',
						// Initial focus
						'STARTED',
						'ABORTED',
					]);
				});
			});
		});

		describe('when showing list after typing input', () => {
			it('should send a UFO success when the list of users are shown after typing', async () => {
				getUserRecommendationsMock.mockReturnValue(Promise.resolve(mockReturnOptions));
				renderSmartUserPicker({ prefetch: true });

				// Focus in the user picker so the user list is shown
				const input = screen.getByRole('combobox');
				await act(() => input.focus());

				expect(mockOptionsShown.startSpy).toHaveBeenCalledTimes(1);
				expect(mockOptionsShown.successSpy).toHaveBeenCalledTimes(1);
				expect(mockOptionsShown.failureSpy).toHaveBeenCalledTimes(0);

				// Now that the options list is shown, type "user" to filter:
				await userEvent.type(input, 'u');

				expect(mockOptionsShown.startSpy).toHaveBeenCalledTimes(2);
				expect(mockOptionsShown.successSpy).toHaveBeenCalledTimes(2);
				expect(mockOptionsShown.failureSpy).toHaveBeenCalledTimes(0);

				expect(mockOptionsShown.transitions).toStrictEqual([
					'NOT_STARTED',
					// Initial focus
					'STARTED',
					'SUCCEEDED',
					// First onInputChange which succeeds
					'STARTED',
					'SUCCEEDED',
				]);
			});

			it('should send a UFO failure when the list of users cannot be shown after typing', async () => {
				getUserRecommendationsMock.mockImplementation(() =>
					Promise.reject({
						message: `Cannot call getUserRecommendations`,
						statusCode: 500,
					}),
				);
				renderSmartUserPicker({ prefetch: true });

				// Focus in the user picker so the user list is shown
				const input = screen.getByRole('combobox');
				await act(() => input.focus());

				expect(mockOptionsShown.startSpy).toHaveBeenCalledTimes(1);
				expect(mockOptionsShown.failureSpy).toHaveBeenCalledTimes(1);
				expect(mockOptionsShown.successSpy).toHaveBeenCalledTimes(0);

				// Now that the options list is shown, type "user" to filter:
				await userEvent.type(input, 'u');

				expect(mockOptionsShown.startSpy).toHaveBeenCalledTimes(2);
				expect(mockOptionsShown.failureSpy).toHaveBeenCalledTimes(2);
				expect(mockOptionsShown.successSpy).toHaveBeenCalledTimes(0);

				expect(mockOptionsShown.transitions).toStrictEqual([
					'NOT_STARTED',
					// Initial focus which fails user lookup
					'STARTED',
					'FAILED',
					// First onInputChange which also fails user lookup
					'STARTED',
					'FAILED',
				]);
			});

			it('should not send a UFO failure when the list of users cannot be shown after typing but the error is not a 5xx', async () => {
				getUserRecommendationsMock.mockImplementation(() =>
					Promise.reject({
						message: `Cannot call getUserRecommendations`,
						statusCode: 400,
					}),
				);
				renderSmartUserPicker({ prefetch: true });

				// Focus in the user picker so the user list is shown
				const input = screen.getByRole('combobox');
				await act(() => input.focus());

				expect(mockOptionsShown.startSpy).toHaveBeenCalledTimes(1);
				expect(mockOptionsShown.failureSpy).toHaveBeenCalledTimes(0);
				expect(mockOptionsShown.successSpy).toHaveBeenCalledTimes(0);
				expect(mockOptionsShown.abortSpy).toHaveBeenCalledTimes(1);

				// Now that the options list is shown, type "user" to filter:
				await userEvent.type(input, 'u');

				expect(mockOptionsShown.startSpy).toHaveBeenCalledTimes(2);
				expect(mockOptionsShown.failureSpy).toHaveBeenCalledTimes(0);
				expect(mockOptionsShown.successSpy).toHaveBeenCalledTimes(0);
				expect(mockOptionsShown.abortSpy).toHaveBeenCalledTimes(2);

				expect(mockOptionsShown.transitions).toStrictEqual([
					'NOT_STARTED',
					// Initial focus which fails user lookup
					'STARTED',
					'ABORTED',
					// First onInputChange which also fails user lookup
					'STARTED',
					'ABORTED',
				]);
			});

			it('should send a UFO success when URS returns an error but the onError prop is used to show fallback users', async () => {
				getUserRecommendationsMock.mockImplementation(() =>
					Promise.reject({
						message: `Cannot call getUserRecommendations`,
						statusCode: 500,
					}),
				);
				renderSmartUserPicker({
					prefetch: true,
					onError: async (error, request) => {
						return [{ id: 'fallback-user-1', name: 'Fallback User 1' }].filter((user) =>
							request.query ? user.name.toLowerCase().includes(request.query.toLowerCase()) : true,
						);
					},
				});

				// Focus in the user picker so the user list is shown
				const input = screen.getByRole('combobox');
				await act(() => input.focus());

				expect(mockOptionsShown.startSpy).toHaveBeenCalledTimes(1);
				expect(mockOptionsShown.failureSpy).toHaveBeenCalledTimes(0);
				expect(mockOptionsShown.successSpy).toHaveBeenCalledTimes(1);

				// Now that the options list is shown, type "F" to filter:
				await userEvent.type(input, 'F');

				expect(mockOptionsShown.startSpy).toHaveBeenCalledTimes(2);
				expect(mockOptionsShown.failureSpy).toHaveBeenCalledTimes(0);
				expect(mockOptionsShown.successSpy).toHaveBeenCalledTimes(2);

				expect(mockOptionsShown.transitions).toStrictEqual([
					'NOT_STARTED',
					// Initial focus which fails URS lookup but succeeds with fallback lookup from onError
					'STARTED',
					'SUCCEEDED',
					// First onInputChange which fails URS lookup but succeeds with fallback lookup from onError
					'STARTED',
					'SUCCEEDED',
				]);
			});

			it('should send a UFO failure when URS returns an error and the onError prop used for fallback users also returns an error', async () => {
				getUserRecommendationsMock.mockImplementation(() =>
					Promise.reject({
						message: `Cannot call getUserRecommendations`,
						statusCode: 500,
					}),
				);
				renderSmartUserPicker({
					prefetch: true,
					onError: async () => {
						throw new Error('Fallback lookup failed');
					},
				});

				// Focus in the user picker so the user list is shown
				const input = screen.getByRole('combobox');
				await act(() => input.focus());

				expect(mockOptionsShown.startSpy).toHaveBeenCalledTimes(1);
				expect(mockOptionsShown.failureSpy).toHaveBeenCalledTimes(1);
				expect(mockOptionsShown.successSpy).toHaveBeenCalledTimes(0);

				// Now that the options list is shown, type "F" to filter:
				await userEvent.type(input, 'u');

				expect(mockOptionsShown.startSpy).toHaveBeenCalledTimes(2);
				expect(mockOptionsShown.failureSpy).toHaveBeenCalledTimes(2);
				expect(mockOptionsShown.successSpy).toHaveBeenCalledTimes(0);

				expect(mockOptionsShown.transitions).toStrictEqual([
					'NOT_STARTED',
					// Initial focus which fails URS lookup and also fails fallback lookup from onError
					'STARTED',
					'FAILED',
					// First onInputChange which fails URS lookup and also fails fallback lookup from onError
					'STARTED',
					'FAILED',
				]);
			});

			it('should not send a UFO failure when URS returns an error and the onError prop used for fallback users also returns an error but the error is not a 5xx', async () => {
				getUserRecommendationsMock.mockImplementation(() =>
					Promise.reject({
						message: `Cannot call getUserRecommendations`,
						statusCode: 400,
					}),
				);
				renderSmartUserPicker({
					prefetch: true,
					onError: async () => {
						throw new Error('Fallback lookup failed');
					},
				});

				// Focus in the user picker so the user list is shown
				const input = screen.getByRole('combobox');
				await act(() => input.focus());

				expect(mockOptionsShown.startSpy).toHaveBeenCalledTimes(1);
				expect(mockOptionsShown.failureSpy).toHaveBeenCalledTimes(0);
				expect(mockOptionsShown.successSpy).toHaveBeenCalledTimes(0);
				expect(mockOptionsShown.abortSpy).toHaveBeenCalledTimes(1);

				// Now that the options list is shown, type "F" to filter:
				await userEvent.type(input, 'u');

				expect(mockOptionsShown.startSpy).toHaveBeenCalledTimes(2);
				expect(mockOptionsShown.failureSpy).toHaveBeenCalledTimes(0);
				expect(mockOptionsShown.successSpy).toHaveBeenCalledTimes(0);
				expect(mockOptionsShown.abortSpy).toHaveBeenCalledTimes(2);

				expect(mockOptionsShown.transitions).toStrictEqual([
					'NOT_STARTED',
					// Initial focus which fails URS lookup and also fails fallback lookup from onError
					'STARTED',
					'ABORTED',
					// First onInputChange which fails URS lookup and also fails fallback lookup from onError
					'STARTED',
					'ABORTED',
				]);
			});

			it('should abort the UFO show options request if a new query is typed while a previous query is already loading', async () => {
				renderSmartUserPicker({ prefetch: true });

				// Focus in the user picker so the user list is shown
				const input = screen.getByRole('combobox');
				// Now that the options list is shown, type "use" to filter:
				await userEvent.type(input, 'u');

				expect(mockOptionsShown.startSpy).toHaveBeenCalledTimes(2);
				expect(mockOptionsShown.successSpy).toHaveBeenCalledTimes(1);
				expect(mockOptionsShown.abortSpy).toHaveBeenCalledTimes(1);
				expect(mockOptionsShown.failureSpy).toHaveBeenCalledTimes(0);

				expect(mockOptionsShown.transitions).toStrictEqual([
					'NOT_STARTED',
					// Initial focus
					'STARTED',
					'ABORTED',
					// First onInputChange which gets aborted
					'STARTED',
					'SUCCEEDED',
				]);
			});
		});
	});
});
