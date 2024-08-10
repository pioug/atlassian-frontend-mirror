/* eslint-disable */
import React from 'react';
import * as jestExtendedMatchers from 'jest-extended';

import '@atlaskit/link-test-helpers/jest';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { renderWithIntl as render } from '@atlaskit/link-test-helpers';
import { ConcurrentExperience } from '@atlaskit/ufo';

import { ANALYTICS_CHANNEL } from '../../../common/constants';
import LinkPicker, { type LinkPickerProps } from '../../../index';
import { testIds } from '../../link-picker';
import { MockLinkPickerPromisePlugin } from '../../../__tests__/__helpers/mock-plugins';
import { ffTest } from '@atlassian/feature-flags-test-utils';

const mockUfoStart = jest.fn();
const mockUfoSuccess = jest.fn();
const mockUfoFailure = jest.fn();
const mockUfoAbort = jest.fn();

jest.mock('@atlaskit/ufo', () => ({
	__esModule: true,
	...jest.requireActual<Object>('@atlaskit/ufo'),
	ConcurrentExperience: jest.fn().mockImplementation(
		(): Partial<ConcurrentExperience> => ({
			getInstance: jest.fn().mockImplementation((id: string) => ({
				start: mockUfoStart,
				success: mockUfoSuccess,
				failure: mockUfoFailure,
				abort: mockUfoAbort,
			})),
		}),
	),
}));

jest.mock('use-debounce', () => ({
	__esModules: true,
	...jest.requireActual<Object>('use-debounce'),
	useDebounce: <T extends unknown>(val: T) => [val],
}));

expect.extend(jestExtendedMatchers);

interface LinkPickerTestProps extends Partial<LinkPickerProps> {
	spy: jest.Mock<any, any>;
	onSubmit: jest.Mock<any, any>;
}

const mockJiraPlugin = new MockLinkPickerPromisePlugin({
	tabKey: 'jira',
	tabTitle: 'Jira',
	action: {
		label: 'Create New',
		callback: () => {
			console.log('clicked create');
		},
	},
});

const mockConfluencePlugin = new MockLinkPickerPromisePlugin({
	tabKey: 'confluence',
	tabTitle: 'Confluence',
	action: {
		label: 'Create New',
		callback: () => {
			console.log('clicked create');
		},
	},
});

describe('Link Picker Jira Create Discovery (pulse)', () => {
	// Any date, as long as it's in the past
	const now = new Date('April 1, 2022 00:00:00').getTime();

	let user: ReturnType<typeof userEvent.setup>;
	beforeEach(() => {
		// Clear before each test - to assume we haven't seen the feature discovery before
		localStorage.clear();
		user = userEvent.setup();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	const setupLinkPicker = ({ url = '', plugins }: Partial<LinkPickerProps> = {}) => {
		const spy = jest.fn();
		const onSubmit = jest.fn();

		jest.useFakeTimers({ legacyFakeTimers: true });

		/** Date spy to be able to "see" the feature discovery pulse for a given amount of time */
		const dateSpy = jest.spyOn(Date, 'now').mockImplementation(() => now);

		const linkPickerDom = ({ url, plugins, spy, onSubmit }: LinkPickerTestProps) => (
			<AnalyticsListener channel={ANALYTICS_CHANNEL} onEvent={spy}>
				<LinkPicker
					url={url}
					onSubmit={onSubmit}
					plugins={plugins ?? []}
					onCancel={jest.fn()}
					onContentResize={jest.fn()}
				/>
			</AnalyticsListener>
		);

		const wrappedLinkPicker = render(linkPickerDom({ url, plugins, spy, onSubmit }));

		const rerenderLinkPicker = ({ url, plugins, spy, onSubmit }: LinkPickerTestProps) => {
			wrappedLinkPicker.rerender(
				<IntlProvider locale="en">{linkPickerDom({ url, plugins, spy, onSubmit })}</IntlProvider>,
			);
		};

		return {
			dateSpy,
			spy,
			onSubmit,
			testIds,
			wrappedLinkPicker,
			rerenderLinkPicker,
			urlField: () => screen.findByTestId(testIds.urlInputField),
		};
	};

	describe('should display pulse when only one plugin that is a jira tab', () => {
		ffTest(
			'platform.linking-platform.link-picker.enable-jira-create',
			async () => {
				const { urlField } = setupLinkPicker({ plugins: [mockJiraPlugin] });
				expect(await urlField()).toHaveFocus();

				// Expect no tabs to be shown as only one plugin is provided
				expect(screen.queryAllByRole('tab', { name: 'Jira' })).toEqual([]);

				// Pulsing link picker discovery is visible
				expect(await screen.findByTestId('link-picker-action-button-discovery-discovery'));
			},
			async () => {
				const { urlField } = setupLinkPicker({ plugins: [mockJiraPlugin] });
				expect(await urlField()).toHaveFocus();
				// Expect no tabs to be shown as only one plugin is provided
				expect(screen.queryAllByRole('tab', { name: 'Jira' })).toEqual([]);

				expect(
					screen.queryAllByTestId('link-picker-action-button-discovery-discovery'),
				).toBeEmpty();
			},
		);
	});

	describe('should display discovery testid on jira tab when multiple tabs', () => {
		ffTest(
			'platform.linking-platform.link-picker.enable-jira-create',
			async () => {
				const { urlField } = setupLinkPicker({
					plugins: [
						new MockLinkPickerPromisePlugin({
							tabKey: 'jira',
							tabTitle: 'Jira',
							action: {
								label: 'Create New',
								callback: () => {
									console.log('clicked create');
								},
							},
						}),
						new MockLinkPickerPromisePlugin({
							tabKey: 'confluence',
							tabTitle: 'Confluence',
							action: {
								label: 'Create New',
								callback: () => {
									console.log('clicked create');
								},
							},
						}),
					],
				});

				expect(await urlField()).toHaveFocus();

				// First tab is loaded
				expect(await screen.findByRole('tab', { name: 'Jira' })).toBeInTheDocument();

				// Pulsing link picker discovery is visible
				expect(await screen.findByTestId('link-picker-action-button-discovery-discovery'));
			},
			async () => {
				const { urlField } = setupLinkPicker({
					plugins: [
						new MockLinkPickerPromisePlugin({
							tabKey: 'jira',
							tabTitle: 'Jira',
							action: {
								label: 'Create New',
								callback: () => {
									console.log('clicked create');
								},
							},
						}),
						new MockLinkPickerPromisePlugin({
							tabKey: 'confluence',
							tabTitle: 'Confluence',
							action: {
								label: 'Create New',
								callback: () => {
									console.log('clicked create');
								},
							},
						}),
					],
				});

				expect(await urlField()).toHaveFocus();

				// First tab is loaded
				expect(await screen.findByRole('tab', { name: 'Jira' })).toBeInTheDocument();

				expect(
					screen.queryAllByTestId('link-picker-action-button-discovery-discovery'),
				).toBeEmpty();
			},
		);
	});

	describe('should not display discovery testid after moving from Jira to Confluence tab', () => {
		ffTest(
			'platform.linking-platform.link-picker.enable-jira-create',
			async () => {
				const { urlField } = setupLinkPicker({
					plugins: [mockJiraPlugin, mockConfluencePlugin],
				});

				expect(await urlField()).toHaveFocus();

				// First tab is loaded
				expect(await screen.findByRole('tab', { name: 'Jira' })).toBeInTheDocument();

				// Pulsing link picker discovery visible
				expect(await screen.findByTestId('link-picker-action-button-discovery-discovery'));

				// Not running all timers (don't wait for CSS pulse)

				// click on confluence tab
				user.click(
					await screen.findByRole('tab', {
						selected: false,
						name: 'Confluence',
					}),
				);

				// Expect tab to be selected
				await screen.findByRole('tab', { selected: true, name: 'Confluence' });

				// Pulsing link picker discovery is not visible on other tabs
				expect(
					screen.queryAllByTestId('link-picker-action-button-discovery-discovery'),
				).toBeEmpty();
			},
			async () => {
				const { urlField } = setupLinkPicker({
					plugins: [mockJiraPlugin, mockConfluencePlugin],
				});

				expect(await urlField()).toHaveFocus();

				// First tab is loaded
				expect(await screen.findByRole('tab', { name: 'Jira' })).toBeInTheDocument();

				// Pulsing link picker discovery is not visible on Jira tab when FF off
				expect(
					screen.queryAllByTestId('link-picker-action-button-discovery-discovery'),
				).toBeEmpty();

				// Not running all timers (don't wait for CSS pulse)

				// click on confluence tab
				user.click(
					await screen.findByRole('tab', {
						selected: false,
						name: 'Confluence',
					}),
				);

				// Expect tab to be selected
				await screen.findByRole('tab', { selected: true, name: 'Confluence' });

				// Pulsing link picker discovery is not visible on other tabs
				expect(
					screen.queryAllByTestId('link-picker-action-button-discovery-discovery'),
				).toBeEmpty();
			},
		);
	});

	describe('should not show discovery on Jira tab after changing tabs and back, when previously viewed for less than 2 seconds', () => {
		ffTest(
			'platform.linking-platform.link-picker.enable-jira-create',
			async () => {
				const { urlField, dateSpy } = setupLinkPicker({
					plugins: [mockJiraPlugin, mockConfluencePlugin],
				});

				expect(await urlField()).toHaveFocus();

				// First tab is loaded
				expect(await screen.findByRole('tab', { name: 'Jira' })).toBeInTheDocument();

				// Pulsing link picker discovery visible
				expect(await screen.findByTestId('link-picker-action-button-discovery-discovery'));

				jest.runAllTimers();

				// Only wait for 1 second (not long enough)
				dateSpy.mockReturnValue(now + 1000);

				// click on confluence tab
				user.click(
					await screen.findByRole('tab', {
						selected: false,
						name: 'Confluence',
					}),
				);
				// Expect tab to be selected
				await screen.findByRole('tab', { selected: true, name: 'Confluence' });

				// Pulsing link picker discovery is not visible on other tab
				expect(
					screen.queryAllByTestId('link-picker-action-button-discovery-discovery'),
				).toBeEmpty();

				// click on jira tab again
				user.click(
					await screen.findByRole('tab', {
						selected: false,
						name: 'Jira',
					}),
				);
				// Wait for tab to be selected
				await screen.findByRole('tab', { selected: true, name: 'Jira' });

				expect(
					screen.queryAllByTestId('link-picker-action-button-discovery-discovery'),
				).toBeEmpty();
			},
			async () => {
				const { urlField, dateSpy } = setupLinkPicker({
					plugins: [mockJiraPlugin, mockConfluencePlugin],
				});

				expect(await urlField()).toHaveFocus();

				// First tab is loaded
				expect(await screen.findByRole('tab', { name: 'Jira' })).toBeInTheDocument();

				expect(
					screen.queryAllByTestId('link-picker-action-button-discovery-discovery'),
				).toBeEmpty();

				jest.runAllTimers();

				// Only wait for 1 second (not long enough)
				dateSpy.mockReturnValue(now + 1000);

				// click on confluence tab
				user.click(
					await screen.findByRole('tab', {
						selected: false,
						name: 'Confluence',
					}),
				);
				// Expect tab to be selected
				await screen.findByRole('tab', { selected: true, name: 'Confluence' });

				// Pulsing link picker discovery is not visible on other tab
				expect(
					screen.queryAllByTestId('link-picker-action-button-discovery-discovery'),
				).toBeEmpty();

				// click on jira tab again
				user.click(
					await screen.findByRole('tab', {
						selected: false,
						name: 'Jira',
					}),
				);
				// Wait for tab to be selected
				await screen.findByRole('tab', { selected: true, name: 'Jira' });

				expect(
					screen.queryAllByTestId('link-picker-action-button-discovery-discovery'),
				).toBeEmpty();
			},
		);
	});
});
