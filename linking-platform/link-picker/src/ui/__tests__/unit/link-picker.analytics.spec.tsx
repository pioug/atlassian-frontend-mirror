/* eslint-disable */
import React from 'react';
import * as jestExtendedMatchers from 'jest-extended';

import '@atlaskit/link-test-helpers/jest';
import { screen, waitForElementToBeRemoved } from '@testing-library/dom';
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { ManualPromise, renderWithIntl as render } from '@atlaskit/link-test-helpers';
import { MockLinkPickerPlugin } from '../../../__tests__/__helpers/mock-plugins';
import mockedPluginData from '../../../__tests__/__helpers/mock-plugin-data';
import { ConcurrentExperience } from '@atlaskit/ufo';

import { ANALYTICS_CHANNEL } from '../../../common/constants';
import type { LinkPickerProps } from '../../../common/types';
import LinkPicker from '../../index';
import { PACKAGE_DATA as ROOT_CONTEXT } from '../../main';
import { testIds } from '../../link-picker';
import { MockLinkPickerPromisePlugin } from '../../../__tests__/__helpers/mock-plugins';

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

let shouldReturnEmptyResponse = false;

jest.mock('@atlaskit/link-provider', () => ({
	CardClient: jest.fn().mockImplementation(() => ({
		fetchData: jest.fn().mockImplementation(async (url, force) => {
			if (shouldReturnEmptyResponse) {
				return { data: {} }; // Return an empty object for the first test
			}
			const mockResponse = { data: { preview: { type: 'link' } }, status: 200 };
			return mockResponse;
		}),
	})),
}));

expect.extend(jestExtendedMatchers);

interface LinkPickerTestProps extends Partial<LinkPickerProps> {
	spy: jest.Mock<any, any>;
	onSubmit: jest.Mock<any, any>;
}

jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));

describe('LinkPicker analytics', () => {
	let user: ReturnType<typeof userEvent.setup>;
	beforeEach(() => {
		user = userEvent.setup();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	const setupLinkPicker = ({
		url = '',
		plugins,
		previewableLinksOnly = false,
		additionalError,
	}: Partial<LinkPickerProps> = {}) => {
		const spy = jest.fn();
		const onSubmit = jest.fn();

		const linkPickerDom = ({
			url,
			plugins,
			spy,
			onSubmit,
			previewableLinksOnly,
			additionalError,
		}: LinkPickerTestProps) => (
			<AnalyticsListener channel={ANALYTICS_CHANNEL} onEvent={spy}>
				<LinkPicker
					url={url}
					onSubmit={onSubmit}
					plugins={plugins ?? []}
					onCancel={jest.fn()}
					onContentResize={jest.fn()}
					previewableLinksOnly={previewableLinksOnly}
					additionalError={additionalError}
				/>
			</AnalyticsListener>
		);

		const wrappedLinkPicker = render(
			linkPickerDom({ url, plugins, spy, onSubmit, previewableLinksOnly, additionalError }),
		);

		const rerenderLinkPicker = ({
			url,
			plugins,
			spy,
			onSubmit,
			previewableLinksOnly,
			additionalError,
		}: LinkPickerTestProps) => {
			wrappedLinkPicker.rerender(
				<IntlProvider locale="en">
					{linkPickerDom({ url, plugins, spy, onSubmit, previewableLinksOnly, additionalError })}
				</IntlProvider>,
			);
		};

		return {
			spy,
			onSubmit,
			testIds,
			wrappedLinkPicker,
			rerenderLinkPicker,
			urlField: () => screen.findByTestId(testIds.urlInputField),
		};
	};

	it('should fire `ui.form.submitted.linkPicker` and emit a clone of the `ui.form.submitted.linkPicker` event on form submission', async () => {
		const { onSubmit, spy, urlField } = setupLinkPicker();

		await user.type(await urlField(), 'www.atlassian.com');
		spy.mockClear();
		fireEvent.submit(await urlField());

		const payload = {
			action: 'submitted',
			eventType: 'ui',
			actionSubject: 'form',
			actionSubjectId: 'linkPicker',
			attributes: {
				displayTextFieldContent: null,
				displayTextFieldContentInputMethod: null,
				linkFieldContent: 'text_string',
				linkFieldContentInputMethod: 'manual',
				linkFieldContentInputSource: null,
				linkState: 'newLink',
				tab: null,
			},
		};

		const context = [ROOT_CONTEXT];

		expect(spy).toBeFiredWithAnalyticEventOnce({
			hasFired: true,
			context,
			payload,
		});

		// Second onSubmit argument should be a `UIAnalyticsEvent` match the event dispatched
		// except it should not yet have been fired (`hasFired` = false)
		expect(onSubmit).toHaveBeenCalledWith<[{}, UIAnalyticsEvent]>(
			expect.objectContaining({
				url: 'http://www.atlassian.com',
			}),
			expect.any(UIAnalyticsEvent),
		);
		expect(onSubmit.mock.calls[0][1]).toStrictEqual(
			expect.objectContaining({
				hasFired: false,
				context,
				payload,
			}),
		);
	});

	it('should fire `ui.inlineDialog.viewed.linkPicker` once on picker mounting', async () => {
		const { spy } = setupLinkPicker();

		expect(spy).toBeFiredWithAnalyticEventOnce({
			hasFired: true,
			context: [ROOT_CONTEXT],
			payload: {
				action: 'viewed',
				eventType: 'ui',
				actionSubject: 'inlineDialog',
				actionSubjectId: 'linkPicker',
				attributes: {
					linkState: 'newLink',
				},
			},
		});
	});

	it('should fire `ui.inlineDialog.closed.linkPicker` once on picker unmounting', async () => {
		const { spy, wrappedLinkPicker } = setupLinkPicker();

		wrappedLinkPicker.unmount();

		expect(spy).toBeFiredWithAnalyticEventOnce({
			hasFired: true,
			context: [ROOT_CONTEXT],
			payload: {
				action: 'closed',
				eventType: 'ui',
				actionSubject: 'inlineDialog',
				actionSubjectId: 'linkPicker',
				attributes: {
					linkState: 'newLink',
				},
			},
		});
	});

	describe('linkState attribute', () => {
		it('should be `newLink` when URL prop is NOT provided', async () => {
			const { spy, urlField } = setupLinkPicker();

			await user.type(await urlField(), 'www.atlassian.com');
			fireEvent.submit(await urlField());

			expect(spy).toBeFiredWithAnalyticEventOnce({
				hasFired: true,
				context: [ROOT_CONTEXT],
				payload: {
					action: 'submitted',
					eventType: 'ui',
					actionSubject: 'form',
					actionSubjectId: 'linkPicker',
					attributes: {
						linkState: 'newLink',
						linkFieldContent: 'text_string',
						linkFieldContentInputMethod: 'manual',
						displayTextFieldContent: null,
						displayTextFieldContentInputMethod: null,
					},
				},
			});
		});

		it('should be `editLink` when URL prop IS provided', async () => {
			const { spy, urlField } = setupLinkPicker({
				url: 'https://atlassian.com',
			});

			spy.mockClear();
			fireEvent.submit(await urlField());

			expect(spy).toBeFiredWithAnalyticEventOnce({
				hasFired: true,
				payload: {
					action: 'submitted',
					eventType: 'ui',
					actionSubject: 'form',
					actionSubjectId: 'linkPicker',
					attributes: {
						linkState: 'editLink',
						linkFieldContent: 'url',
						linkFieldContentInputMethod: null,
						displayTextFieldContent: null,
						displayTextFieldContentInputMethod: null,
					},
				},
			});
		});
	});

	describe('input tracking', () => {
		it('should correctly track url input field even when immediately submitting after input change', async () => {
			const { spy, urlField } = setupLinkPicker({
				url: 'https://google.com',
			});

			await user.clear(await urlField());
			await user.type(await urlField(), 'www.atlassian.com');
			fireEvent.submit(await urlField());

			expect(spy).toBeFiredWithAnalyticEventOnce({
				payload: {
					action: 'submitted',
					eventType: 'ui',
					actionSubject: 'form',
					actionSubjectId: 'linkPicker',
					attributes: {
						linkState: 'editLink',
						linkFieldContent: 'text_string',
						linkFieldContentInputMethod: 'manual',
						displayTextFieldContent: null,
						displayTextFieldContentInputMethod: null,
					},
				},
			});
		});

		it('should track url input field content as `url` when the field has a valid url', async () => {
			const { spy, urlField } = setupLinkPicker();

			await user.type(await urlField(), 'www.atlassian.com');
			spy.mockClear();
			fireEvent.submit(await urlField());

			expect(spy).toBeFiredWithAnalyticEventOnce({
				hasFired: true,
				payload: {
					action: 'submitted',
					eventType: 'ui',
					actionSubject: 'form',
					actionSubjectId: 'linkPicker',
					attributes: {
						linkState: 'newLink',
						linkFieldContent: 'text_string',
						linkFieldContentInputMethod: 'manual',
						displayTextFieldContent: null,
						displayTextFieldContentInputMethod: null,
					},
				},
			});
		});

		it('should fire `field updated` event when focus leaves url input field', async () => {
			const { spy, urlField } = setupLinkPicker({
				url: 'https://google.com',
			});

			await user.type(await urlField(), 'https://www.atlassian.com');
			spy.mockClear();
			await user.tab();

			expect(spy).toBeFiredWithAnalyticEventOnce({
				payload: {
					action: 'updated',
					eventType: 'ui',
					actionSubject: 'textField',
					actionSubjectId: 'linkField',
					attributes: {
						linkState: 'editLink',
						linkFieldContent: 'url',
						linkFieldContentInputMethod: 'manual',
						displayTextFieldContent: null,
						displayTextFieldContentInputMethod: null,
					},
				},
			});
		});

		it('should not fire `field updated` event even if there is onChange events if the value net value change between focus and blur is no change', async () => {
			const { spy, urlField } = setupLinkPicker({
				url: 'https://google.com',
			});

			await user.clear(await urlField());
			await user.keyboard('https://www.atlassian.com');
			await user.tab();
			await user.keyboard('https://google.com');

			expect(spy).not.toBeFiredWithAnalyticEventOnce({
				payload: {
					action: 'updated',
					eventType: 'ui',
					actionSubject: 'field',
					actionSubjectId: 'linkField',
				},
			});
		});

		it('should track the displayText field', async () => {
			const { spy } = setupLinkPicker();

			// Tab to displayText field
			await user.tab();
			spy.mockClear();
			await user.type(screen.getByTestId(testIds.textInputField), 'Custom Display Text');
			// Blur display text
			await user.tab();

			expect(spy).toBeFiredWithAnalyticEventOnce({
				payload: {
					action: 'updated',
					eventType: 'ui',
					actionSubject: 'textField',
					actionSubjectId: 'displayTextField',
					attributes: {
						linkState: 'newLink',
						linkFieldContent: null,
						linkFieldContentInputMethod: null,
						displayTextFieldContent: 'text_string',
						displayTextFieldContentInputMethod: 'manual',
					},
				},
			});
		});

		it('should track insertFromPaste input events as `paste` input method', async () => {
			const { spy, urlField } = setupLinkPicker();

			const url = 'https://atlassian.com';
			await urlField();

			spy.mockClear();

			fireEvent.input(await urlField(), {
				inputType: 'insertFromPaste',
				target: { value: url },
			});

			// Tab to clear button
			await user.tab();

			expect(spy).toBeFiredWithAnalyticEventOnce({
				payload: {
					action: 'updated',
					eventType: 'ui',
					actionSubject: 'textField',
					actionSubjectId: 'linkField',
					attributes: {
						linkState: 'newLink',
						linkFieldContent: 'url',
						linkFieldContentInputMethod: 'paste',
						displayTextFieldContent: null,
						displayTextFieldContentInputMethod: null,
					},
				},
			});

			spy.mockClear();

			// Tab to displayText field
			await user.tab();

			fireEvent.input(await screen.findByTestId(testIds.textInputField), {
				inputType: 'insertFromPaste',
				target: { value: 'Custom Title' },
			});

			// Blur display text
			await user.tab();

			expect(spy).toBeFiredWithAnalyticEventOnce({
				payload: {
					action: 'updated',
					eventType: 'ui',
					actionSubject: 'textField',
					actionSubjectId: 'displayTextField',
					attributes: {
						linkState: 'newLink',
						linkFieldContent: 'url',
						linkFieldContentInputMethod: 'paste',
						displayTextFieldContent: 'text_string',
						displayTextFieldContentInputMethod: 'paste',
					},
				},
			});
		});
	});

	describe('with plugins', () => {
		const setupWithPlugins: typeof setupLinkPicker = (props = {}) =>
			setupLinkPicker({
				plugins: [new MockLinkPickerPlugin()],
				...props,
			});

		it('should track the url field value as `url` when submitting by clicking a result', async () => {
			const { spy } = setupWithPlugins();

			await user.click((await screen.findAllByTestId(testIds.searchResultItem))[0]);

			// Should not have fired a text field update
			expect(spy).not.toBeFiredWithAnalyticEventOnce(
				{
					payload: {
						action: 'updated',
						eventType: 'ui',
						actionSubject: 'textField',
						actionSubjectId: 'displayTextField',
					},
				},
				ANALYTICS_CHANNEL,
			);
			// Should have tracked content as url and input method as searchResult
			expect(spy).toBeFiredWithAnalyticEventOnce({
				payload: {
					action: 'submitted',
					eventType: 'ui',
					actionSubject: 'form',
					actionSubjectId: 'linkPicker',
					attributes: {
						linkState: 'newLink',
						linkFieldContent: 'url',
						linkFieldContentInputMethod: 'searchResult',
						linkFieldContentInputSource: 'recent-work',
						displayTextFieldContent: null,
						displayTextFieldContentInputMethod: null,
					},
				},
			});
		});

		it('should track the url field value as `url` when submitting by using typeahead/autocomplete (keydown pressing) and pressing enter', async () => {
			const { spy, urlField } = setupWithPlugins();

			const urlFieldElement = await urlField();
			expect(urlFieldElement).toHaveFocus();

			await screen.findAllByRole('option');
			spy.mockClear();
			await user.keyboard('{arrowdown}');
			await user.keyboard('{enter}');

			// Should not have fired a text field update
			expect(spy).not.toBeFiredWithAnalyticEventOnce({
				payload: {
					action: 'updated',
					eventType: 'ui',
					actionSubject: 'textField',
					actionSubjectId: 'displayTextField',
				},
			});

			// Should have tracked content as url and input method as searchResult
			expect(spy).toBeFiredWithAnalyticEventOnce({
				payload: {
					action: 'submitted',
					eventType: 'ui',
					actionSubject: 'form',
					actionSubjectId: 'linkPicker',
					attributes: {
						linkState: 'newLink',
						linkFieldContent: 'url',
						linkFieldContentInputMethod: 'searchResult',
						linkFieldContentInputSource: 'recent-work',
						displayTextFieldContent: null,
						displayTextFieldContentInputMethod: null,
					},
				},
			});
		});

		describe('linkFieldContentInputSource', () => {
			let user: ReturnType<typeof userEvent.setup>;

			beforeEach(() => {
				user = userEvent.setup();
			});

			it('should be provided by the item if both item and plugin provide `meta.source`', async () => {
				const { spy, urlField } = setupWithPlugins({
					plugins: [
						{
							meta: {
								source: 'plugin-source',
							},
							resolve: async () => {
								return {
									data: [
										{
											...mockedPluginData[0],
											meta: {
												source: 'item-source',
											},
										},
									],
								};
							},
						},
					],
				});

				expect(await urlField()).toHaveFocus();
				expect(await screen.findByTestId(testIds.searchResultItem));

				spy.mockClear();
				await user.keyboard('{arrowdown}');
				await user.keyboard('{enter}');

				// Should have tracked `linkFieldContentInputSource` and input method as searchResult
				expect(spy).toBeFiredWithAnalyticEventOnce({
					payload: {
						action: 'submitted',
						eventType: 'ui',
						actionSubject: 'form',
						actionSubjectId: 'linkPicker',
						attributes: {
							linkFieldContentInputMethod: 'searchResult',
							linkFieldContentInputSource: 'item-source',
						},
					},
				});
			});

			it('should fallback to the plugin if it provided `meta.source` if item did not provide', async () => {
				const { spy, urlField } = setupWithPlugins({
					plugins: [
						{
							meta: {
								source: 'plugin-source',
							},
							resolve: async () => ({
								data: [
									{
										...mockedPluginData[0],
										meta: {},
									},
								],
							}),
						},
					],
				});

				expect(await urlField()).toHaveFocus();
				expect(await screen.findByTestId(testIds.searchResultItem));

				spy.mockClear();
				await user.keyboard('{arrowdown}');
				await user.keyboard('{enter}');

				// Should have tracked `linkFieldContentInputSource` and input method as searchResult
				expect(spy).toBeFiredWithAnalyticEventOnce({
					payload: {
						action: 'submitted',
						eventType: 'ui',
						actionSubject: 'form',
						actionSubjectId: 'linkPicker',
						attributes: {
							linkFieldContentInputMethod: 'searchResult',
							linkFieldContentInputSource: 'plugin-source',
						},
					},
				});
			});

			it('should set source as `unknown` if a search result is selected but neither the plugin or item specifies the source', async () => {
				const { spy, urlField } = setupWithPlugins({
					plugins: [
						{
							meta: {},
							resolve: async () => ({
								data: [
									{
										...mockedPluginData[0],
										meta: {},
									},
								],
							}),
						},
					],
				});

				expect(await urlField()).toHaveFocus();
				expect(await screen.findByTestId(testIds.searchResultItem));

				spy.mockClear();
				await user.keyboard('{arrowdown}');
				await user.keyboard('{enter}');

				// Should have set the input method back to manual, and unset the input source
				expect(spy).toBeFiredWithAnalyticEventOnce({
					payload: {
						action: 'submitted',
						eventType: 'ui',
						actionSubject: 'form',
						actionSubjectId: 'linkPicker',
						attributes: {
							linkFieldContentInputMethod: 'searchResult',
							linkFieldContentInputSource: 'unknown',
						},
					},
				});
			});

			it('should be unset if the user modifies the url after selecting using keyboard', async () => {
				const { spy, urlField } = setupWithPlugins({
					plugins: [
						{
							meta: {
								source: 'plugin-source',
							},
							resolve: async () => ({
								data: [
									{
										...mockedPluginData[0],
										meta: {},
									},
								],
							}),
						},
					],
				});

				expect(await urlField()).toHaveFocus();
				expect(await screen.findByTestId(testIds.searchResultItem));

				spy.mockClear();
				await user.keyboard('{arrowdown}');
				await user.keyboard('{backspace}');
				await user.keyboard('{enter}');

				// Should have set the input method back to manual, and unset the input source
				expect(spy).toBeFiredWithAnalyticEventOnce({
					payload: {
						action: 'submitted',
						eventType: 'ui',
						actionSubject: 'form',
						actionSubjectId: 'linkPicker',
						attributes: {
							linkFieldContentInputMethod: 'manual',
							linkFieldContentInputSource: null,
						},
					},
				});
			});
		});

		describe('tab tracking', () => {
			it('should fire a `tab viewed` event when viewing a tab', async () => {
				const { spy, urlField } = setupWithPlugins({
					plugins: [
						{
							tabKey: 'tabA',
							tabTitle: 'Tab A',
							resolve: async () => ({
								data: [],
							}),
						},
						{
							tabKey: 'tabB',
							tabTitle: 'Tab B',
							resolve: async () => ({
								data: [],
							}),
						},
					],
				});

				expect(await screen.findByRole('tab', { name: 'Tab A' })).toBeInTheDocument();
				// Should have fired with tab = tabA
				expect(spy).toBeFiredWithAnalyticEventOnce({
					payload: {
						action: 'viewed',
						eventType: 'ui',
						actionSubject: 'tab',
						attributes: {
							tab: 'tabA',
						},
					},
				});

				spy.mockClear();
				// Clicked
				user.click(await screen.findByRole('tab', { selected: false, name: 'Tab B' }));
				// Expect tab to be selected
				await screen.findByRole('tab', { selected: true, name: 'Tab B' });
				// Should have fired with tab = tabB
				expect(spy).toBeFiredWithAnalyticEventOnce({
					payload: {
						action: 'viewed',
						eventType: 'ui',
						actionSubject: 'tab',
						attributes: {
							tab: 'tabB',
						},
					},
				});

				// Typing url will hide suggestions and tabs
				await user.type(await urlField(), 'https://www.atlassian.com');
				// Clear url
				spy.mockClear();
				user.click(await screen.findByTestId(testIds.clearUrlButton));
				// Expect tab to be visible and selected
				await screen.findByRole('tab', { selected: true, name: 'Tab B' });
				// Should re-fire when tabs remount
				expect(spy).toBeFiredWithAnalyticEventOnce({
					payload: {
						action: 'viewed',
						eventType: 'ui',
						actionSubject: 'tab',
						attributes: {
							tab: 'tabB',
						},
					},
				});
			});

			it('correctly fires an empty tab attribute when no plugin is specified', async () => {
				const { spy } = setupWithPlugins();

				// Mounted event should have context attribute
				expect(spy).toBeFiredWithAnalyticEventOnce({
					payload: {
						action: 'viewed',
						eventType: 'ui',
						actionSubject: 'inlineDialog',
						actionSubjectId: 'linkPicker',
						attributes: {
							tab: null,
						},
					},
				});
			});

			it('correctly fires tab attribute when plugins are changed', async () => {
				const { rerenderLinkPicker, onSubmit, spy, urlField } = setupWithPlugins();

				await urlField();

				expect(spy).toBeFiredWithAnalyticEventOnce({
					payload: {
						action: 'viewed',
						eventType: 'ui',
						actionSubject: 'inlineDialog',
						actionSubjectId: 'linkPicker',
						attributes: {
							tab: null,
						},
					},
				});

				const pluginsSetA = [
					{
						tabKey: 'tabA',
						tabTitle: 'Tab A',
						resolve: async () => ({
							data: [],
						}),
					},
					{
						tabKey: 'tabB',
						tabTitle: 'Tab B',
						resolve: async () => ({
							data: [],
						}),
					},
				];

				rerenderLinkPicker({
					url: '',
					onSubmit,
					plugins: pluginsSetA,
					spy,
				});

				expect(await screen.findByRole('tab', { name: 'Tab A' })).toBeInTheDocument();

				// Mounted event should have tab attribute wtih tab A
				expect(spy).toBeFiredWithAnalyticEventOnce({
					payload: {
						action: 'viewed',
						eventType: 'ui',
						actionSubject: 'tab',
						attributes: {
							tab: 'tabA',
						},
					},
				});

				const pluginsSetB = [
					{
						tabKey: 'tabC',
						tabTitle: 'Tab C',
						resolve: async () => ({
							data: [],
						}),
					},
					{
						tabKey: 'tabD',
						tabTitle: 'Tab D',
						resolve: async () => ({
							data: [],
						}),
					},
				];

				rerenderLinkPicker({
					url: '',
					onSubmit,
					plugins: pluginsSetB,
					spy,
				});

				expect(await screen.findByRole('tab', { name: 'Tab C' })).toBeInTheDocument();

				// Mounted event should have tab attribute with Tab C
				expect(spy).toBeFiredWithAnalyticEventOnce({
					payload: {
						action: 'viewed',
						eventType: 'ui',
						actionSubject: 'tab',
						attributes: {
							tab: 'tabC',
						},
					},
				});
			});

			it('correctly sets the initial tab when mounting with plugins', async () => {
				const { spy } = setupWithPlugins({
					plugins: [
						{
							tabKey: 'tabA',
							tabTitle: 'Tab A',
							resolve: async () => ({
								data: [],
							}),
						},
						{
							tabKey: 'tabB',
							tabTitle: 'Tab B',
							resolve: async () => ({
								data: [],
							}),
						},
					],
				});

				// Mounted event should have context attribute
				expect(spy).toBeFiredWithAnalyticEventOnce({
					payload: {
						action: 'viewed',
						eventType: 'ui',
						actionSubject: 'inlineDialog',
						actionSubjectId: 'linkPicker',
						attributes: {
							tab: 'tabA',
						},
					},
				});
			});

			it('should set the `tab` attribute when clicking a tab', async () => {
				const { spy, urlField } = setupWithPlugins({
					plugins: [
						{
							tabKey: 'tabA',
							tabTitle: 'Tab A',
							resolve: async () => ({
								data: [],
							}),
						},
						{
							tabKey: 'tabB',
							tabTitle: 'Tab B',
							resolve: async () => ({
								data: [],
							}),
						},
					],
				});

				spy.mockClear();
				// Clicked
				user.click(await screen.findByRole('tab', { name: 'Tab B' }));
				// Submit
				await user.type(await urlField(), 'https://www.atlassian.com');

				// Expect for submission to have changed tab
				spy.mockClear();
				fireEvent.submit(await urlField());
				expect(spy).toBeFiredWithAnalyticEventOnce({
					payload: {
						action: 'submitted',
						eventType: 'ui',
						actionSubject: 'form',
						attributes: {
							tab: 'tabB',
						},
					},
				});
			});
		});

		describe('`searchResults shown` event', () => {
			// FIXME: Jest upgrade
			// event mismatch
			it.skip('should fire `searchResults shown preQuerySearchResults` when items are displayed when there is no search term', async () => {
				const { spy } = setupWithPlugins();

				expect(await screen.findAllByTestId(testIds.searchResultItem));

				expect(spy).toBeFiredWithAnalyticEventOnce({
					payload: {
						action: 'shown',
						eventType: 'ui',
						actionSubject: 'searchResults',
						actionSubjectId: 'preQuerySearchResults',
						attributes: {
							linkState: 'newLink',
							displayTextFieldContent: null,
							resultCount: 5,
						},
					},
				});
			});

			// FIXME: Jest upgrade
			// event mismatch
			it.skip('should re-fire `searchResults shown preQuerySearchResults` when items are hidden and then re-shown', async () => {
				const { spy, urlField } = setupWithPlugins();

				// Pre-query shown
				expect(await screen.findAllByTestId(testIds.searchResultItem));
				expect(spy).toBeFiredWithAnalyticEventOnce({
					payload: {
						action: 'shown',
						actionSubject: 'searchResults',
						actionSubjectId: 'preQuerySearchResults',
					},
				});

				await user.type(await urlField(), 'https://www.atlassian.com');
				// Results should hide as we have a URL in the field, not a search term
				expect(screen.queryByTestId(testIds.searchResultItem)).not.toBeInTheDocument();
				spy.mockClear();
				// Clear the url field to repopulate my "pre-query" results
				await user.clear(await urlField());

				// Pre-query shown
				expect(await screen.findAllByTestId(testIds.searchResultItem));
				expect(spy).toBeFiredWithAnalyticEventOnce({
					payload: {
						action: 'shown',
						eventType: 'ui',
						actionSubject: 'searchResults',
						actionSubjectId: 'preQuerySearchResults',
						attributes: {
							linkState: 'newLink',
							displayTextFieldContent: null,
							resultCount: 5,
						},
					},
				});
			});

			// FIXME: Jest upgrade
			// no events were fired!
			it.skip('should fire `searchResults shown postQuerySearchResults` when search results are loaded', async () => {
				const promise = new ManualPromise([]);
				const plugin = new MockLinkPickerPromisePlugin({
					tabKey: 'plugin',
					tabTitle: 'Plugin',
					promise: promise,
				});

				const { spy, urlField } = setupWithPlugins({
					plugins: [plugin],
				});

				spy.mockClear();

				await user.type(await urlField(), 'x');

				// Should be in a loading state
				expect(screen.queryByTestId(testIds.searchResultLoadingIndicator)).toBeInTheDocument();

				// Should not yet have fired event
				expect(spy).not.toBeFiredWithAnalyticEventOnce({
					payload: {
						action: 'shown',
						actionSubject: 'searchResults',
						actionSubjectId: 'postQuerySearchResults',
					},
				});

				promise.resolve();

				// Wait for loading to finish
				await waitForElementToBeRemoved(() =>
					screen.queryByTestId(testIds.searchResultLoadingIndicator),
				);

				// Post-query shown
				expect(spy).toBeFiredWithAnalyticEventOnce({
					payload: {
						action: 'shown',
						eventType: 'ui',
						actionSubject: 'searchResults',
						actionSubjectId: 'postQuerySearchResults',
						attributes: {
							linkState: 'newLink',
							displayTextFieldContent: null,
							resultCount: 0,
						},
					},
				});
			});

			// FIXME: Jest upgrade
			// no events were fired!
			it.skip('should NOT fire `searchResults shown` when intermediate items are shown whilst loading more results', async () => {
				const plugin = new MockLinkPickerPlugin();
				const initialResults = jest.spyOn(plugin, 'getInitialResults');
				const updatedResults = jest.spyOn(plugin, 'fetchUpdatedResults');

				const { spy, urlField } = setupWithPlugins({
					plugins: [plugin],
				});

				spy.mockClear();

				const initialResultsPromise = new ManualPromise(mockedPluginData.slice(0, 1));
				initialResults.mockReturnValue(initialResultsPromise);
				const updatedResultsPromise = new ManualPromise(mockedPluginData.slice(0, 3));
				updatedResults.mockReturnValue(updatedResultsPromise);

				await user.type(await urlField(), 'dogs');

				// Should be in a loading state with no results
				expect(screen.queryByTestId(testIds.searchResultItem)).not.toBeInTheDocument();
				expect(screen.queryByTestId(testIds.searchResultLoadingIndicator)).toBeInTheDocument();

				// Not yet fired
				expect(spy).not.toBeFiredWithAnalyticEventOnce({
					payload: {
						action: 'shown',
						actionSubject: 'searchResults',
					},
				});

				// Release initial results
				initialResultsPromise.resolve();

				// Should find single result loaded
				expect(await screen.findByTestId(testIds.searchResultItem)).toBeInTheDocument();

				// Still not yet fired analytic
				expect(spy).not.toBeFiredWithAnalyticEventOnce({
					payload: {
						action: 'shown',
						actionSubject: 'searchResults',
					},
				});

				// Release final results
				updatedResultsPromise.resolve();

				// Wait for loading to finish
				await waitForElementToBeRemoved(() =>
					screen.queryByTestId(testIds.searchResultLoadingIndicator),
				);

				// Post-query shown
				expect(await screen.findAllByTestId(testIds.searchResultItem));
				expect(spy).toBeFiredWithAnalyticEventOnce({
					payload: {
						action: 'shown',
						eventType: 'ui',
						actionSubject: 'searchResults',
						actionSubjectId: 'postQuerySearchResults',
						attributes: {
							linkState: 'newLink',
							displayTextFieldContent: null,
							resultCount: 3,
						},
					},
				});
			});
		});
	});

	describe('additional error handling', () => {
		beforeEach(() => {
			const fg = require('@atlaskit/platform-feature-flags').fg;
			fg.mockReturnValue(true);
		});
		it('should reject links without previews when previewableLinksOnly is true', async () => {
			const { urlField, onSubmit } = setupLinkPicker({
				previewableLinksOnly: true,
			});
			shouldReturnEmptyResponse = true;
			await user.type(await urlField(), 'https://www.atlassian.com');
			const insertButton = screen.getByTestId('link-picker-insert-button');
			await user.click(insertButton);
			expect(onSubmit).not.toHaveBeenCalled();
		});
		it('should accept links with previews when previewableLinksOnly is true', async () => {
			const { urlField, onSubmit } = setupLinkPicker({
				previewableLinksOnly: true,
			});
			shouldReturnEmptyResponse = false;
			expect(screen.queryByTestId('link-error')).not.toBeInTheDocument();
			await user.type(await urlField(), 'https://www.atlassian.com/hasEmbedPreview');
			const insertButton = screen.getByTestId('link-picker-insert-button');
			await user.click(insertButton);
			expect(onSubmit).toHaveBeenCalled();
		});
		it('should show error from additionalError unless built in error message is triggered', async () => {
			const { urlField, onSubmit } = setupLinkPicker({
				previewableLinksOnly: true,
				additionalError: 'Form is invalid',
			});
			expect(screen.queryByTestId('link-error')).toBeInTheDocument();
			expect(await screen.findByText('Form is invalid')).toBeInTheDocument();
			const insertButton = screen.getByTestId('link-picker-insert-button');
			await user.click(insertButton);
			expect(onSubmit).not.toHaveBeenCalled();
			shouldReturnEmptyResponse = true;
			await user.type(await urlField(), 'https://www.atlassian.com');
			await user.click(insertButton);
			expect(screen.getByText("Embed view isn't supported for this link.")).toBeInTheDocument();
			expect(screen.queryByText('Form is invalid')).not.toBeInTheDocument();
		});
	});

	describe('UFO metrics', () => {
		afterEach(() => {
			jest.restoreAllMocks();
		});

		it('should send a Success experience when mounted successfully', async () => {
			const { testIds } = setupLinkPicker();

			expect(mockUfoStart).toHaveBeenCalled();
			await screen.findAllByTestId(testIds.linkPicker);

			expect(mockUfoSuccess).toHaveBeenCalled();
			expect(mockUfoStart).toHaveBeenCalledBefore(mockUfoSuccess);
		});

		it('should send a Failed experience when mount fails', async () => {
			const badUrl = new URL('https://atlassian.com') as any;

			jest.spyOn(console, 'error').mockImplementation(() => {});
			setupLinkPicker({ url: badUrl });

			expect(mockUfoStart).toHaveBeenCalled();
			expect(mockUfoFailure).toHaveBeenCalled();
			expect(mockUfoSuccess).not.toHaveBeenCalled();
			expect(mockUfoStart).toHaveBeenCalledBefore(mockUfoFailure);
		});

		it('should send an Abort experience when unmounted successfully', async () => {
			const { wrappedLinkPicker } = setupLinkPicker();
			expect(mockUfoStart).toHaveBeenCalled();
			await screen.findAllByTestId(testIds.linkPicker);

			expect(mockUfoSuccess).toHaveBeenCalled();
			expect(mockUfoStart).toHaveBeenCalledBefore(mockUfoSuccess);

			wrappedLinkPicker.unmount();
			expect(mockUfoAbort).toHaveBeenCalled();
			expect(mockUfoFailure).not.toHaveBeenCalled();
		});
	});
});
