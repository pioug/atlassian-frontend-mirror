import React from 'react';

import '@testing-library/jest-dom';
import { screen, within } from '@testing-library/dom';
import { act, fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { ManualPromise, renderWithIntl as render } from '@atlaskit/link-test-helpers';

import mockedPluginData from '../../__tests__/__helpers/mock-plugin-data';
import {
	MockLinkPickerGeneratorPlugin,
	MockLinkPickerPromisePlugin,
	UnstableMockLinkPickerPlugin,
} from '../../__tests__/__helpers/mock-plugins';
import type { LinkPickerProps } from '../../common/types';

import { messages as formFooterMessages } from './form-footer';
import { messages as resultsListMessages } from './search-results/link-search-list';

import { LinkPicker, testIds } from './index';

jest.mock('date-fns/differenceInCalendarDays', () => {
	return jest.fn().mockImplementation(() => -5);
});

jest.mock('date-fns/formatDistanceToNow', () => ({
	__esModule: true,
	default: () => 'just a minute',
}));

describe('<LinkPicker />', () => {
	let user: ReturnType<typeof userEvent.setup>;
	beforeEach(() => {
		user = userEvent.setup();
	});

	beforeAll(() => {
		Element.prototype.scrollIntoView = jest.fn();
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
		scrollingTabs,
		...props
	}: Partial<LinkPickerProps> & { scrollingTabs?: boolean } = {}) => {
		const onSubmitMock: LinkPickerProps['onSubmit'] = jest.fn();
		const onContentResize: LinkPickerProps['onContentResize'] = jest.fn();

		const { rerender } = render(
			<LinkPicker
				url={url}
				onSubmit={onSubmitMock}
				plugins={plugins ?? []}
				onContentResize={onContentResize}
				featureFlags={{ scrollingTabs }}
				{...props}
			/>,
		);

		const rerenderLinkPicker = (props: any) => {
			rerender(
				<IntlProvider locale="en">
					<LinkPicker
						url={url}
						onSubmit={onSubmitMock}
						plugins={plugins ?? []}
						onContentResize={onContentResize}
						featureFlags={{ scrollingTabs }}
						{...props}
					/>
				</IntlProvider>,
			);
		};

		return {
			onSubmitMock,
			onContentResize,
			testIds,
			rerenderLinkPicker,
		};
	};

	describe('with no plugins', () => {
		it('should submit with valid url in the input field when form uses onSubmitCapture', async () => {
			const { onSubmitMock, testIds } = setupLinkPicker();

			await user.type(screen.getByTestId(testIds.urlInputField), 'www.atlassian.com');
			fireEvent.submit(screen.getByTestId(testIds.urlInputField));

			expect(onSubmitMock).toHaveBeenCalledTimes(1);
			expect(onSubmitMock).toHaveBeenCalledWith(
				{
					url: 'http://www.atlassian.com',
					title: null,
					displayText: null,
					rawUrl: 'www.atlassian.com',
					meta: {
						inputMethod: 'manual',
					},
				},
				expect.any(UIAnalyticsEvent),
			);
		});

		it('should display a valid URL on load', async () => {
			const { testIds } = setupLinkPicker({ url: 'https://www.atlassian.com' });

			expect(screen.getByTestId(testIds.urlInputField)).toHaveValue('https://www.atlassian.com');
		});

		it('should submit with valid url and displayText in the input field', async () => {
			const { onSubmitMock, testIds } = setupLinkPicker();

			await user.type(screen.getByTestId(testIds.urlInputField), 'www.atlassian.com');
			await user.type(screen.getByTestId(testIds.textInputField), 'link');
			fireEvent.submit(screen.getByTestId(testIds.textInputField));

			expect(onSubmitMock).toHaveBeenCalledTimes(1);
			expect(onSubmitMock).toHaveBeenCalledWith(
				{
					url: 'http://www.atlassian.com',
					displayText: 'link',
					title: null,
					meta: {
						inputMethod: 'manual',
					},
					rawUrl: 'www.atlassian.com',
				},
				expect.any(UIAnalyticsEvent),
			);
		});

		it('should render a Field (URL field) with NO aria-describedby prop', async () => {
			const screenReaderDescriptionId = 'search-recent-links-field-description';
			const { testIds } = setupLinkPicker();
			expect(screen.getByTestId(testIds.urlInputField)).not.toHaveAttribute(
				'aria-describedby',
				screenReaderDescriptionId,
			);
		});

		it('should have visual label connected to input field', async () => {
			const { testIds } = setupLinkPicker();
			const inputNode = screen.getByLabelText('Display text (optional)');
			expect(inputNode).toHaveAttribute('data-testid', testIds.textInputField);
		});

		it('should NOT display an invalid URL on load', async () => {
			const { testIds } = setupLinkPicker({ url: 'javascript:alert(1)' });

			expect(screen.getByTestId(testIds.urlInputField)).toHaveValue('');
		});

		it('should NOT display a list subtitle', async () => {
			const { testIds } = setupLinkPicker({ url: 'javascript:alert(1)' });

			expect(screen.queryByTestId(testIds.resultListTitle)).toBeNull();
		});

		it('should submit when insert button is clicked', async () => {
			const { testIds, onSubmitMock } = setupLinkPicker();

			await user.type(screen.getByTestId(testIds.urlInputField), 'www.atlassian.com');
			await user.click(screen.getByTestId(testIds.insertButton));

			expect(onSubmitMock).toHaveBeenCalledTimes(1);
			expect(onSubmitMock).toHaveBeenCalledWith(
				{
					url: 'http://www.atlassian.com',
					displayText: null,
					title: null,
					meta: {
						inputMethod: 'manual',
					},
					rawUrl: 'www.atlassian.com',
				},
				expect.any(UIAnalyticsEvent),
			);
		});

		it('should handle event when cancel button is clicked', async () => {
			const onCancelMock: LinkPickerProps['onCancel'] = jest.fn();
			const { testIds } = setupLinkPicker({ onCancel: onCancelMock });

			await user.click(screen.getByTestId(testIds.cancelButton));

			expect(onCancelMock).toHaveBeenCalledTimes(1);
		});

		it('should not render cancel button if onCancel is not provided', async () => {
			const { testIds } = setupLinkPicker();

			const cancelButton = screen.queryByTestId(testIds.cancelButton);

			expect(cancelButton).not.toBeInTheDocument();
		});

		it('should NOT display a no-results search message', async () => {
			const { testIds } = setupLinkPicker();

			await user.type(screen.getByTestId(testIds.urlInputField), 'xyz');

			expect(screen.queryByTestId(testIds.emptyResultPage)).toBeNull();
		});

		it('should submit valid edited url and title if provided a url', async () => {
			const { testIds, onSubmitMock } = setupLinkPicker({
				url: 'https://www.google.com',
			});

			await user.click(screen.getByTestId(testIds.clearUrlButton));
			await user.type(screen.getByTestId(testIds.urlInputField), 'https://www.atlassian.com');
			await user.type(screen.getByTestId(testIds.textInputField), 'link');
			fireEvent.submit(screen.getByTestId(testIds.textInputField));

			expect(onSubmitMock).toHaveBeenCalledTimes(1);
			expect(onSubmitMock).toHaveBeenCalledWith(
				{
					url: 'https://www.atlassian.com',
					displayText: 'link',
					title: null,
					meta: {
						inputMethod: 'manual',
					},
					rawUrl: 'https://www.atlassian.com',
				},
				expect.any(UIAnalyticsEvent),
			);
		});

		it('should not submit if provided a valid url and changed to invalid', async () => {
			const { testIds, onSubmitMock } = setupLinkPicker({
				url: 'https://www.atlassian.com',
			});

			await user.click(screen.getByTestId(testIds.clearUrlButton));
			await user.type(screen.getByTestId(testIds.urlInputField), 'foo');

			expect(onSubmitMock).not.toHaveBeenCalled();
			expect(onSubmitMock).not.toHaveBeenCalledWith(
				{
					url: 'foo',
					displayText: null,
					title: null,
					meta: {
						inputMethod: 'manual',
					},
					rawUrl: 'foo',
				},
				expect.any(UIAnalyticsEvent),
			);
		});
	});

	describe('with generic plugin', () => {
		const setupWithGenericPlugin = ({ ...props }: Partial<LinkPickerProps> = {}) => {
			const initialResultPromise = Promise.resolve({
				value: { data: mockedPluginData.slice(0, 3) },
				done: false,
			});
			const updatedResultPromise = Promise.resolve({
				value: { data: mockedPluginData.slice(3) },
				done: true,
			});
			const plugin = new MockLinkPickerGeneratorPlugin([
				initialResultPromise,
				updatedResultPromise,
			]);
			const resolve = jest.spyOn(plugin, 'resolve');

			const {
				testIds,
				onSubmitMock,
				onContentResize,
				rerenderLinkPicker: rerender,
			} = setupLinkPicker({
				plugins: [plugin],
				...props,
			});

			return {
				onSubmitMock,
				onContentResize,
				testIds,
				plugin,
				resolve,
				rerender,
			};
		};

		it('should render a Field (URL field) with correct aria props', async () => {
			const { testIds } = setupWithGenericPlugin();

			expect(screen.getByTestId(testIds.urlInputField)).toHaveAttribute('role', 'combobox');
			expect(screen.getByTestId(testIds.urlInputField)).toHaveAttribute(
				'aria-describedby',
				'search-recent-links-field-description',
			);
			expect(screen.getByTestId(testIds.urlInputField)).toHaveAttribute('aria-expanded', 'true');
			expect(screen.getByTestId(testIds.urlInputField)).toHaveAttribute(
				'aria-controls',
				'link-picker-search-list',
			);
			expect(screen.getByTestId(testIds.urlInputField)).toHaveAttribute(
				'aria-autocomplete',
				'list',
			);

			await waitForElementToBeRemoved(screen.queryByTestId(testIds.searchResultLoadingIndicator));
		});

		describe('with submit in progress', () => {
			it('should not fire submit callback when link is pressed', async () => {
				const initialResultPromise = Promise.resolve({
					value: { data: mockedPluginData.slice(0, 3) },
					done: true,
				});
				const plugin = new MockLinkPickerGeneratorPlugin([initialResultPromise]);
				const { testIds, onSubmitMock } = setupWithGenericPlugin({
					url: '',
					plugins: [plugin],
					isSubmitting: true,
				});

				await user.click((await screen.findAllByTestId(testIds.searchResultItem))[1]);

				expect(onSubmitMock).toHaveBeenCalledTimes(0);
			});

			it('should have aria-readonly attributes on form elements', async () => {
				const initialResultPromise = Promise.resolve({
					value: { data: mockedPluginData.slice(0, 3) },
					done: true,
				});
				const plugin = new MockLinkPickerGeneratorPlugin([initialResultPromise]);
				const { testIds } = setupWithGenericPlugin({
					url: '',
					plugins: [plugin],
					isSubmitting: true,
				});

				await act(async () => {
					await initialResultPromise;
				});

				const rootLinkPicker = screen.getByTestId(testIds.linkPicker);
				const listboxes = await within(rootLinkPicker).findAllByRole('listbox');
				for (const list of listboxes) {
					expect(list).toHaveAttribute('aria-readonly', 'true');
				}
			});

			it('should not submit when navigated to via keyboard and enter is pressed', async () => {
				const initialResultPromise = Promise.resolve({
					value: { data: mockedPluginData.slice(0, 3) },
					done: true,
				});
				const plugin = new MockLinkPickerGeneratorPlugin([initialResultPromise]);
				const { testIds, onSubmitMock } = setupWithGenericPlugin({
					url: '',
					plugins: [plugin],
					isSubmitting: true,
				});

				await act(async () => {
					await initialResultPromise;
				});
				// Set first item to active
				fireEvent.keyDown(screen.getByTestId(testIds.urlInputField), {
					keyCode: 40,
				});
				// Set second item to active
				fireEvent.keyDown(screen.getByTestId(testIds.urlInputField), {
					keyCode: 40,
				});
				// Submit
				fireEvent.submit(screen.getByTestId(testIds.urlInputField));

				expect(onSubmitMock).toHaveBeenCalledTimes(0);
			});
		});

		describe('loading', () => {
			it('should show a spinner when `isLoadingPlugins` is true', async () => {
				const { testIds, rerender } = setupWithGenericPlugin({
					isLoadingPlugins: true,
				});

				const resultsList = screen.queryByTestId('link-search-list');
				const spinner = screen.queryByTestId(testIds.tabsLoadingIndicator);

				expect(resultsList).not.toBeInTheDocument();
				expect(spinner).toBeInTheDocument();
				expect(screen.getByTestId(testIds.insertButton)).toHaveAttribute('disabled');

				rerender({ isLoadingPlugins: false });
				await waitForElementToBeRemoved(screen.queryByTestId(testIds.searchResultLoadingIndicator));
			});

			it('should not have spinner if `isLoadingPlugins` is false once recents have loaded', async () => {
				const { testIds, plugin, rerender } = setupWithGenericPlugin({
					isLoadingPlugins: true,
					url: '',
				});

				let resultsList = screen.queryByTestId('link-search-list');
				let spinner = screen.queryByTestId(testIds.tabsLoadingIndicator);

				expect(resultsList).not.toBeInTheDocument();
				expect(spinner).toBeInTheDocument();

				// Resolve plugin and rerender
				await act(async () => {
					await plugin.promises[0];
				});
				await act(async () => {
					await plugin.promises[1];
				});
				rerender({ isLoadingPlugins: false });

				// Get latest screen state
				resultsList = screen.queryByTestId('link-search-list');
				spinner = screen.queryByTestId(testIds.tabsLoadingIndicator);
				expect(resultsList).toBeInTheDocument();
				expect(spinner).not.toBeInTheDocument();
			});

			it('should keep submit button in disabled state if `isLoadingPlugins` is true even if recents have loaded', async () => {
				const { testIds, plugin, rerender } = setupWithGenericPlugin({
					isLoadingPlugins: true,
					url: '',
				});

				let resultsList = screen.queryByTestId('link-search-list');
				let spinner = screen.queryByTestId(testIds.tabsLoadingIndicator);

				expect(resultsList).not.toBeInTheDocument();
				expect(spinner).toBeInTheDocument();
				expect(screen.getByTestId(testIds.insertButton)).toHaveAttribute('disabled');

				// Resolve plugin and rerender
				await act(async () => {
					await plugin.promises[0];
				});
				await act(async () => {
					await plugin.promises[1];
				});

				// Rerender with the isLoadingPlugins still true
				rerender({ isLoadingPlugins: true });

				// Get latest screen state
				resultsList = screen.queryByTestId('link-search-list');
				spinner = screen.queryByTestId(testIds.tabsLoadingIndicator);
				expect(resultsList).not.toBeInTheDocument();
				expect(spinner).toBeInTheDocument();
				expect(screen.getByTestId(testIds.insertButton)).toHaveAttribute('disabled');
			});
		});

		it('should submit with valid url in the input field', async () => {
			const { onSubmitMock, testIds } = setupWithGenericPlugin();

			await user.type(screen.getByTestId(testIds.urlInputField), 'www.atlassian.com');
			fireEvent.submit(screen.getByTestId(testIds.urlInputField));

			expect(onSubmitMock).toHaveBeenCalledTimes(1);
			expect(onSubmitMock).toHaveBeenCalledWith(
				{
					url: 'http://www.atlassian.com',
					displayText: null,
					title: null,
					meta: {
						inputMethod: 'manual',
					},
					rawUrl: 'www.atlassian.com',
				},
				expect.any(UIAnalyticsEvent),
			);
		});

		it('should submit with valid url and title in the input field', async () => {
			const { onSubmitMock, testIds } = setupWithGenericPlugin();

			await user.type(screen.getByTestId(testIds.urlInputField), 'www.atlassian.com');
			await user.type(screen.getByTestId(testIds.textInputField), 'link');
			fireEvent.submit(screen.getByTestId(testIds.textInputField));

			expect(onSubmitMock).toHaveBeenCalledTimes(1);
			expect(onSubmitMock).toHaveBeenCalledWith(
				{
					url: 'http://www.atlassian.com',
					displayText: 'link',
					title: null,
					meta: {
						inputMethod: 'manual',
					},
					rawUrl: 'www.atlassian.com',
				},
				expect.any(UIAnalyticsEvent),
			);
		});

		describe('with hide display text', () => {
			it('should not be visible', async () => {
				const { testIds } = setupLinkPicker({
					hideDisplayText: true,
				});

				expect(screen.queryByTestId(testIds.textInputField)).toBeNull();
			});

			it('should submit with existing display text', async () => {
				const { testIds, onSubmitMock } = setupLinkPicker({
					hideDisplayText: true,
					displayText: 'Atlassian',
				});

				await user.type(screen.getByTestId(testIds.urlInputField), 'www.atlassian.com');
				fireEvent.submit(screen.getByTestId(testIds.urlInputField));

				expect(onSubmitMock).toHaveBeenCalledTimes(1);
				expect(onSubmitMock).toHaveBeenCalledWith(
					{
						url: 'http://www.atlassian.com',
						title: null,
						displayText: 'Atlassian',
						rawUrl: 'www.atlassian.com',
						meta: {
							inputMethod: 'manual',
						},
					},
					expect.any(UIAnalyticsEvent),
				);
			});
		});

		describe('onContentResize', () => {
			/**
			 * Two calls to onContentResize are expected on setup,
			 * one for the initial load and one for the isLoading state change
			 */
			it('should call callback when picker is loaded', async () => {
				const { onContentResize } = setupWithGenericPlugin();
				expect(onContentResize).toHaveBeenCalledTimes(2);
				await waitForElementToBeRemoved(screen.queryByTestId(testIds.searchResultLoadingIndicator));
			});

			it('should call callback when user inputs a url', async () => {
				const { onContentResize } = setupWithGenericPlugin();

				await user.type(screen.getByTestId(testIds.urlInputField), 'www.atlassian.com');
				expect(onContentResize).toHaveBeenCalled();
			});

			it('should call callback when results are loaded', async () => {
				const { onContentResize, resolve, plugin } = setupWithGenericPlugin({
					url: 'xyz',
				});
				expect(onContentResize).toHaveBeenCalledTimes(2);

				expect(resolve).toHaveBeenCalledTimes(1);

				await act(async () => {
					await plugin.promises[0];
				});
				await act(async () => {
					await plugin.promises[1];
				});

				expect(onContentResize).toHaveBeenCalledTimes(4);
			});

			it('should call callback when tabs are changed', async () => {
				const promise1 = Promise.resolve(mockedPluginData.slice(0, 1));
				const plugin1 = new MockLinkPickerPromisePlugin({
					tabKey: 'tab1',
					tabTitle: 'tab1',
					promise: promise1,
				});

				const promise2 = Promise.resolve(mockedPluginData.slice(1, 2));
				const plugin2 = new MockLinkPickerPromisePlugin({
					tabKey: 'tab2',
					tabTitle: 'tab2',
					promise: promise2,
				});

				const { onContentResize } = setupWithGenericPlugin({
					plugins: [plugin1, plugin2],
				});

				expect(onContentResize).toHaveBeenCalledTimes(2);
				await waitForElementToBeRemoved(screen.queryByTestId(testIds.searchResultLoadingIndicator));
			});
		});

		it('should not trigger plugin to resolve results and should not be in loading state if provided a `url`', async () => {
			const { testIds, resolve } = setupWithGenericPlugin({
				url: 'https://www.atlassian.com',
			});

			expect(resolve).toHaveBeenCalledTimes(0);
			expect(resolve).not.toHaveBeenCalledWith({
				query: 'https://www.atlassian.com',
			});

			expect(screen.queryByTestId(testIds.searchResultList)).toBeNull();
		});

		it('should show partial result and a loading spinner if the AsyncGenerator has not totally done', async () => {
			const initialResultPromise = Promise.resolve({
				value: { data: mockedPluginData.slice(0, 3) },
				done: false,
			});
			const plugin = new MockLinkPickerGeneratorPlugin([
				initialResultPromise,
				new ManualPromise({
					value: { data: [] },
					done: true,
				}),
			]);
			const resolve = jest.spyOn(plugin, 'resolve');
			const { testIds } = setupWithGenericPlugin({
				url: '',
				plugins: [plugin],
			});

			expect(resolve).toHaveBeenCalledTimes(1);
			expect(resolve).toHaveBeenCalledWith({ query: '' });

			await act(async () => {
				await initialResultPromise;
			});

			expect(await screen.findByTestId(testIds.searchResultList)).toBeInTheDocument();
			expect(screen.queryAllByTestId(testIds.searchResultItem)).toHaveLength(3);
			expect(screen.getByTestId(testIds.searchResultLoadingIndicator)).toBeInTheDocument();
		});

		it('should begin yielding plugin link results on mount if `url` is not a valid URL', async () => {
			const { resolve, testIds, plugin } = setupWithGenericPlugin({
				url: 'xyz',
			});

			expect(resolve).toHaveBeenCalledTimes(1);
			expect(resolve).toHaveBeenCalledWith({ query: '' });

			await act(async () => {
				await plugin.promises[0];
			});
			await act(async () => {
				await plugin.promises[1];
			});

			expect(await screen.findByTestId(testIds.searchResultList)).toBeInTheDocument();
			expect(screen.queryAllByTestId(testIds.searchResultItem)).toHaveLength(5);
			expect(screen.queryByTestId(testIds.searchResultLoadingIndicator)).not.toBeInTheDocument();
		});

		it('should support resolve via promise', async () => {
			const plugin = new MockLinkPickerPromisePlugin();
			const resolve = jest.spyOn(plugin, 'resolve');

			const { testIds } = setupWithGenericPlugin({
				plugins: [plugin],
			});

			expect(resolve).toHaveBeenCalledTimes(1);
			expect(screen.getByTestId(testIds.searchResultLoadingIndicator)).toBeInTheDocument();

			await user.type(screen.getByTestId(testIds.urlInputField), 'atlas');
			// Each character typing would trigger a resolve
			expect(resolve).toHaveBeenCalledTimes(6);
			expect(await screen.findByTestId(testIds.searchResultList)).toBeInTheDocument();
			expect(screen.queryAllByTestId(testIds.searchResultItem)).toHaveLength(5);
			expect(screen.queryByTestId(testIds.searchResultLoadingIndicator)).toBeNull();
		});

		it('should show loading spinner before plugin resolves first results', async () => {
			const { testIds } = setupWithGenericPlugin({
				url: '',
			});

			expect(screen.getByTestId(testIds.searchResultLoadingIndicator)).toBeInTheDocument();
			await waitForElementToBeRemoved(screen.queryByTestId(testIds.searchResultLoadingIndicator));
		});

		it('should render plugin results in `LinkSearchList` and then remove spinner if plugin is done', async () => {
			const { resolve, testIds, plugin } = setupWithGenericPlugin({
				url: 'xyz',
			});

			await act(async () => {
				await plugin.promises[0];
			});
			await act(async () => {
				await plugin.promises[1];
			});

			expect(resolve).toHaveBeenCalledTimes(1);
			expect(resolve).toHaveBeenCalledWith({ query: '' });
			expect(await screen.findAllByTestId(testIds.searchResultItem)).toHaveLength(5);
			expect(screen.queryByTestId(testIds.searchResultLoadingIndicator)).not.toBeInTheDocument();
		});

		it('should still keep loading spinner until plugin yields all results, then remove spinner', async () => {
			const initialResultPromise = Promise.resolve({
				value: { data: mockedPluginData.slice(0, 3) },
				done: false,
			});
			const updatedResultPromise = new ManualPromise({
				value: { data: mockedPluginData.slice(0, 2) },
				done: true,
			});
			const plugin = new MockLinkPickerGeneratorPlugin([
				initialResultPromise,
				updatedResultPromise,
			]);
			const resolve = jest.spyOn(plugin, 'resolve');
			const { testIds } = setupWithGenericPlugin({
				url: '',
				plugins: [plugin],
			});

			expect(resolve).toHaveBeenCalledTimes(1);
			expect(resolve).toHaveBeenCalledWith({ query: '' });

			await act(async () => {
				await initialResultPromise;
			});

			expect(screen.getByTestId(testIds.searchResultList)).toBeInTheDocument();
			expect(screen.queryAllByTestId(testIds.searchResultItem)).toHaveLength(3);
			expect(screen.getByTestId(testIds.searchResultLoadingIndicator)).toBeInTheDocument();

			await act(async () => {
				await updatedResultPromise.resolve();
			});

			expect(screen.getAllByTestId(testIds.searchResultItem)).toHaveLength(2);
			expect(screen.queryByTestId(testIds.searchResultLoadingIndicator)).toBeNull();
		});

		it('should put `isLoading` to `false` when plugin resolve rejects', async () => {
			const initialResultPromise = new ManualPromise({
				value: { data: [] },
				done: true,
			});
			const plugin = new MockLinkPickerGeneratorPlugin([initialResultPromise]);
			const resolve = jest.spyOn(plugin, 'resolve');
			const { testIds } = setupWithGenericPlugin({
				url: '',
				plugins: [plugin],
			});

			act(() => {
				initialResultPromise.reject();
			});

			expect(resolve).toHaveBeenCalledTimes(1);
			await waitForElementToBeRemoved(screen.queryByTestId(testIds.searchResultLoadingIndicator));
			expect(screen.queryByTestId(testIds.searchResultLoadingIndicator)).not.toBeInTheDocument();
		});

		it('should trigger plugin to yield link results when input query changes', async () => {
			const { resolve, testIds } = setupWithGenericPlugin({
				url: '',
			});

			expect(resolve).toHaveBeenCalledTimes(1);
			expect(resolve).toHaveBeenCalledWith({ query: '' });

			await user.type(screen.getByTestId(testIds.urlInputField), 'dogs');

			// Each character would trigger a resolve call
			expect(resolve).toHaveBeenCalledTimes(5);
			expect(resolve).toHaveBeenCalledWith({ query: 'dogs' });
		});

		it('should not trigger plugin to yield results and should not be in loading state if provided a `url`', async () => {
			const { resolve, testIds } = setupWithGenericPlugin({
				url: 'https://www.atlassian.com',
			});

			expect(resolve).toHaveBeenCalledTimes(0);
			expect(resolve).not.toHaveBeenCalledWith({
				query: 'https://www.atlassian.com',
			});
			expect(screen.queryByTestId(testIds.searchResultList)).toBeNull();
		});

		it('should not trigger plugin to yield link results if the input query starts with https://', async () => {
			const { resolve, testIds } = setupWithGenericPlugin({
				url: 'https://',
			});

			expect(resolve).toHaveBeenCalledTimes(0);
			expect(resolve).not.toHaveBeenCalledWith({
				query: 'https://',
			});
			expect(screen.queryByTestId(testIds.searchResultList)).toBeNull();
		});

		it('should not get plugin to yield link results if the input query starts with http://', async () => {
			const { resolve, testIds } = setupWithGenericPlugin({
				url: 'http://',
			});

			expect(resolve).toHaveBeenCalledTimes(0);
			expect(resolve).not.toHaveBeenCalledWith({
				query: 'http://',
			});
			expect(screen.queryByTestId(testIds.searchResultList)).toBeNull();
		});

		it('should still request update from plugin when query is emptied after initial state has valid `url`', async () => {
			const { resolve, testIds } = setupWithGenericPlugin({
				url: 'www.atlassian.com',
			});

			await user.click(screen.getByTestId(testIds.clearUrlButton));

			expect(screen.getByTestId(testIds.urlInputField)).toHaveValue('');
			expect(resolve).toHaveBeenCalledWith({ query: '' });
			expect(resolve).toHaveBeenCalledTimes(1);
		});

		it('should stop yielding results from plugin resolve generator when the query/context changes', async () => {
			const firstResultPromise = new ManualPromise<any>({
				value: { data: [mockedPluginData[0]] },
				done: true,
			});
			const secondResultPromise = new ManualPromise<any>({
				value: { data: [mockedPluginData[1]] },
				done: true,
			});
			const plugin = new MockLinkPickerGeneratorPlugin([firstResultPromise, secondResultPromise]);
			const resolve = jest.spyOn(plugin, 'resolve');
			const { testIds } = setupWithGenericPlugin({
				url: '',
				plugins: [plugin],
			});

			expect(resolve).toHaveBeenCalledTimes(1);

			await user.type(screen.getByTestId(testIds.urlInputField), 'w');
			expect(resolve).toHaveBeenCalledTimes(2);

			// We release the first result
			await act(async () => {
				await firstResultPromise.resolve({
					value: { data: [mockedPluginData[0]] },
					done: true,
				});
			});

			// We should still be loading since now the query version is updated
			expect(screen.getByTestId(testIds.searchResultLoadingIndicator)).toBeInTheDocument();

			// We release the second result
			await act(async () => {
				await secondResultPromise.resolve({
					value: { data: [mockedPluginData[1]] },
					done: true,
				});
			});

			// The latest result should be displayed
			expect(screen.getByTestId(testIds.searchResultList)).toBeInTheDocument();
			expect(screen.queryAllByTestId(testIds.searchResultItem)).toHaveLength(1);
			expect(screen.getByTestId(testIds.searchResultItem)).toHaveTextContent(
				mockedPluginData[1].name,
			);
			expect(screen.queryByTestId(testIds.searchResultLoadingIndicator)).toBeNull();
		});

		it('should still request update from plugin when query is emptied', async () => {
			const { resolve, testIds } = setupWithGenericPlugin({
				url: '',
			});

			expect(resolve).toHaveBeenCalledWith({ query: '' });
			expect(resolve).toHaveBeenCalledTimes(1);

			await user.type(screen.getByTestId(testIds.urlInputField), 'abc');

			expect(resolve).toHaveBeenCalledTimes(4);
			expect(resolve).toHaveBeenCalledWith({ query: 'abc' });

			await user.click(screen.getByTestId(testIds.clearUrlButton));

			expect(resolve).toHaveBeenCalledWith({ query: '' });
			expect(resolve).toHaveBeenCalledTimes(5);
		});

		it('should submit with selected item when clicked', async () => {
			const initialResultPromise = Promise.resolve({
				value: { data: mockedPluginData.slice(0, 3) },
				done: true,
			});
			const plugin = new MockLinkPickerGeneratorPlugin([initialResultPromise]);
			const { testIds, onSubmitMock } = setupWithGenericPlugin({
				url: '',
				plugins: [plugin],
			});

			await user.click((await screen.findAllByTestId(testIds.searchResultItem))[1]);

			const secondItem = mockedPluginData[1];
			expect(onSubmitMock).toHaveBeenCalledTimes(1);
			expect(onSubmitMock).toHaveBeenCalledWith(
				{
					url: secondItem.url,
					title: secondItem.name,
					displayText: null,
					meta: {
						inputMethod: 'typeAhead',
					},
					data: {
						container: 'Fabric',
						icon: 'data:image/png;base64,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',
						iconAlt: 'test',
						lastViewedDate: new Date('2016-11-24T23:55:20.712Z'),
						meta: {
							source: 'xp-search',
						},
						name: 'FAB-1558 Investigate the 25% empty experience problem',
						objectId: 'ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/20617',
						url: 'https://product-fabric.atlassian.net/browse/FAB-1558',
					},
				},
				expect.any(UIAnalyticsEvent),
			);
		});

		it('should display Error message when URL is invalid', async () => {
			const { testIds } = setupWithGenericPlugin({
				url: '',
			});

			await user.type(screen.getByTestId(testIds.urlInputField), 'ABC');
			fireEvent.submit(screen.getByTestId(testIds.urlInputField));

			expect(screen.getByTestId(testIds.urlError)).toBeInTheDocument();
		});

		it('should display Error message when URL is empty', async () => {
			const { testIds } = setupWithGenericPlugin({
				url: '',
			});

			act(() => {
				fireEvent.submit(screen.getByTestId(testIds.urlInputField));
			});

			expect(screen.getByTestId(testIds.urlError)).toBeInTheDocument();
			await waitForElementToBeRemoved(screen.queryByTestId(testIds.searchResultLoadingIndicator));
		});

		it('should remove invalid URL Error when Input is edited', async () => {
			const { testIds } = setupWithGenericPlugin({
				url: '',
			});

			await user.type(screen.getByTestId(testIds.urlInputField), 'ABC');
			fireEvent.submit(screen.getByTestId(testIds.urlInputField));

			await user.type(screen.getByTestId(testIds.urlInputField), 'D');

			expect(screen.queryByTestId(testIds.urlError)).toBeNull();

			// If value is changed to previous trigger it still should not display error
			fireEvent.keyDown(screen.getByTestId(testIds.urlInputField), {
				keyCode: 8,
			});
			expect(screen.queryByTestId(testIds.urlError)).toBeNull();
		});

		it('should submit with selected item when navigated to via keyboard and enter is pressed', async () => {
			const initialResultPromise = Promise.resolve({
				value: { data: mockedPluginData.slice(0, 3) },
				done: true,
			});
			const plugin = new MockLinkPickerGeneratorPlugin([initialResultPromise]);
			const { testIds, onSubmitMock } = setupWithGenericPlugin({
				url: '',
				plugins: [plugin],
			});

			await screen.findAllByRole('option');

			// Set first item to active
			fireEvent.keyDown(screen.getByTestId(testIds.urlInputField), {
				keyCode: 40,
			});
			// Set second item to active
			fireEvent.keyDown(screen.getByTestId(testIds.urlInputField), {
				keyCode: 40,
			});
			// Submit
			fireEvent.submit(screen.getByTestId(testIds.urlInputField));

			const secondItem = mockedPluginData[1];
			expect(onSubmitMock).toHaveBeenCalledTimes(1);
			expect(onSubmitMock).toHaveBeenCalledWith(
				{
					url: secondItem.url,
					displayText: null,
					title: secondItem.name,
					meta: {
						inputMethod: 'typeAhead',
					},
				},
				expect.any(UIAnalyticsEvent),
			);
		});

		it('should populate url field with active item when navigated to via keyboard', async () => {
			const initialResultPromise = Promise.resolve({
				value: { data: mockedPluginData.slice(0, 3) },
				done: true,
			});
			const plugin = new MockLinkPickerGeneratorPlugin([initialResultPromise]);
			const { testIds } = setupWithGenericPlugin({
				url: '',
				plugins: [plugin],
			});

			// Set first item to active
			await screen.findAllByRole('option');
			fireEvent.keyDown(screen.getByTestId(testIds.urlInputField), {
				keyCode: 40,
			});

			expect(screen.getByTestId(testIds.urlInputField)).toHaveValue(mockedPluginData[0].url);
		});

		it('should populate url field with item focused url', async () => {
			const initialResultPromise = Promise.resolve({
				value: { data: mockedPluginData.slice(0, 3) },
				done: true,
			});
			const plugin = new MockLinkPickerGeneratorPlugin([initialResultPromise]);
			const { testIds } = setupWithGenericPlugin({
				url: '',
				plugins: [plugin],
			});

			await act(async () => {
				await initialResultPromise;
			});
			const options = await screen.findAllByRole('option');
			const option = options[2];

			fireEvent.focus(option);

			expect(screen.getByTestId(testIds.urlInputField)).toHaveValue(mockedPluginData[2].url);
		});

		it('should not submit when URL is invalid and there is no result', async () => {
			const resultPromise = Promise.resolve({
				value: { data: [] },
				done: true,
			});
			const plugin = new MockLinkPickerGeneratorPlugin([
				resultPromise,
				resultPromise,
				resultPromise,
				resultPromise,
			]);
			const { testIds } = setupWithGenericPlugin({
				url: '',
				plugins: [plugin],
			});

			// Set url to invalid
			await user.type(screen.getByTestId(testIds.urlInputField), 'xyz');

			// This should move to the second item in the list
			fireEvent.keyDown(screen.getByTestId(testIds.urlInputField), {
				keyCode: 40,
			});

			expect(screen.queryByTestId(testIds.searchResultList)).toBeNull();
			expect(screen.getByTestId(testIds.urlInputField)).toHaveValue('xyz');
		});

		it('should submit arbitrary link', async () => {
			const { testIds, onSubmitMock } = setupWithGenericPlugin({
				url: '',
			});

			await user.type(screen.getByTestId(testIds.urlInputField), 'example.com');

			// Submit
			fireEvent.submit(screen.getByTestId(testIds.urlInputField));

			expect(onSubmitMock).toHaveBeenCalledTimes(1);
			expect(onSubmitMock).toHaveBeenCalledWith(
				{
					url: 'http://example.com',
					displayText: null,
					title: null,
					meta: {
						inputMethod: 'manual',
					},
					rawUrl: 'example.com',
				},
				expect.any(UIAnalyticsEvent),
			);
		});

		it('should display a subtitle for recent items', async () => {
			const { testIds, plugin } = setupWithGenericPlugin({
				url: '',
			});

			await act(async () => {
				await plugin.promises[0];
			});
			await act(async () => {
				await plugin.promises[1];
			});

			expect(await screen.findByTestId(testIds.resultListTitle)).toHaveTextContent(
				resultsListMessages.titleRecentlyViewed.defaultMessage,
			);
		});

		it('should display a subtitle for search results', async () => {
			const resultPromise = Promise.resolve({
				value: { data: mockedPluginData.slice(0, 1) },
				done: true,
			});
			const plugin = new MockLinkPickerGeneratorPlugin([
				resultPromise,
				resultPromise,
				resultPromise,
				resultPromise,
			]);
			const { testIds } = setupWithGenericPlugin({
				url: '',
				plugins: [plugin],
			});

			await act(async () => {
				await resultPromise;
			});

			await user.type(screen.getByTestId(testIds.urlInputField), 'do');

			expect(await screen.findByTestId(testIds.resultListTitle)).toHaveTextContent(
				resultsListMessages.titleResults.defaultMessage,
			);
		});

		it('should submit when insert button is clicked', async () => {
			const { testIds, onSubmitMock } = setupWithGenericPlugin({
				url: '',
			});

			await user.type(screen.getByTestId(testIds.urlInputField), 'example.com');

			await user.click(screen.getByTestId(testIds.insertButton));

			expect(onSubmitMock).toHaveBeenCalledTimes(1);
			expect(onSubmitMock).toHaveBeenCalledWith(
				{
					url: 'http://example.com',
					displayText: null,
					title: null,
					meta: {
						inputMethod: 'manual',
					},
					rawUrl: 'example.com',
				},
				expect.any(UIAnalyticsEvent),
			);
		});

		it('should display a message if search returns no results and state is not loading', async () => {
			const resultPromise = Promise.resolve({
				value: { data: [] },
				done: true,
			});
			const plugin = new MockLinkPickerGeneratorPlugin([
				resultPromise,
				resultPromise,
				resultPromise,
				resultPromise,
			]);
			const { testIds } = setupWithGenericPlugin({
				url: '',
				plugins: [plugin],
			});

			await act(async () => {
				await resultPromise;
			});

			await user.type(screen.getByTestId(testIds.urlInputField), 'xyz');

			expect(await screen.findByTestId(testIds.emptyResultPage)).toBeInTheDocument();
		});

		it('should not display a no-result search message when inserting a valid URL', async () => {
			const resultPromise = Promise.resolve({
				value: { data: [] },
				done: true,
			});
			const plugin = new MockLinkPickerGeneratorPlugin(Array(20).fill(resultPromise));
			const { testIds } = setupWithGenericPlugin({
				url: '',
				plugins: [plugin],
			});

			await user.type(screen.getByTestId(testIds.urlInputField), 'http://google.com');

			expect(screen.queryByTestId(testIds.emptyResultPage)).not.toBeInTheDocument();
		});

		it('should not disable the Insert button if search returns no results for a valid URL', async () => {
			const resultPromise = Promise.resolve({
				value: { data: [] },
				done: true,
			});
			const plugin = new MockLinkPickerGeneratorPlugin(Array(20).fill(resultPromise));
			const { testIds } = setupWithGenericPlugin({
				url: '',
				plugins: [plugin],
			});

			await user.type(screen.getByTestId(testIds.urlInputField), 'atlassian.com');

			const insertButton = await screen.findByTestId(testIds.insertButton);
			expect(insertButton).not.toHaveAttribute('disabled');
		});

		it('should disable the Insert button if search returns no results', async () => {
			const resultPromise = Promise.resolve({
				value: { data: [] },
				done: true,
			});
			const plugin = new MockLinkPickerGeneratorPlugin(Array(20).fill(resultPromise));
			const { testIds } = setupWithGenericPlugin({
				url: '',
				plugins: [plugin],
			});

			await act(async () => {
				await resultPromise;
			});

			await user.type(screen.getByTestId(testIds.urlInputField), 'xyz');

			const insertButton = await screen.findByTestId(testIds.insertButton);
			expect(insertButton).toHaveAttribute('disabled');
		});

		it('should disable the Insert button when loading results', async () => {
			const initialResultPromise = Promise.resolve({
				value: { data: mockedPluginData.slice(0, 3) },
				done: false,
			});
			const updatedResultPromise = new ManualPromise({
				value: { data: mockedPluginData.slice(0, 2) },
				done: true,
			});
			const plugin = new MockLinkPickerGeneratorPlugin([
				initialResultPromise,
				updatedResultPromise,
			]);
			const { testIds } = setupWithGenericPlugin({
				url: '',
				plugins: [plugin],
			});

			await act(async () => {
				await initialResultPromise;
			});

			const insertButton = await screen.findByTestId(testIds.insertButton);
			expect(insertButton).toHaveAttribute('disabled');

			expect(screen.getByTestId(testIds.searchResultLoadingIndicator)).toBeInTheDocument();

			await act(async () => {
				await updatedResultPromise.resolve();
			});

			await waitFor(() => {
				expect(insertButton).not.toHaveAttribute('disabled');
			});
			expect(screen.queryByTestId(testIds.searchResultLoadingIndicator)).not.toBeInTheDocument();
		});

		it('should select an item using the keyboard combination of arrow up/down in the search list and pressing enter', async () => {
			const initialResultPromise = Promise.resolve({
				value: { data: mockedPluginData.slice(0, 3) },
				done: true,
			});
			const plugin = new MockLinkPickerGeneratorPlugin([initialResultPromise]);
			const { testIds, onSubmitMock } = setupWithGenericPlugin({
				url: '',
				plugins: [plugin],
			});

			await act(async () => {
				await initialResultPromise;
			});

			const items = screen.queryAllByTestId(testIds.searchResultItem);
			const list = screen.getByTestId(testIds.searchResultList);

			// Press arrow down on first item
			fireEvent.keyDown(items[0], {
				keyCode: 40,
			});

			// First item should be selected
			expect(list.children[0].getAttribute('aria-selected')).toBe('true');

			// Press arrow down on first item
			fireEvent.keyDown(items[0], {
				keyCode: 40,
			});

			// Second item should now be selected
			expect(list.children[1].getAttribute('aria-selected')).toBe('true');

			// Press arrow up on second item
			fireEvent.keyDown(items[1], {
				keyCode: 36,
			});

			// First item should now be selected
			expect(list.children[0].getAttribute('aria-selected')).toBe('true');

			// Press end key
			fireEvent.keyDown(items[0], {
				keyCode: 35,
			});

			// Last item should now be selected
			expect(list.children[list.children.length - 1].getAttribute('aria-selected')).toBe('true');

			// Press enter key
			fireEvent.keyDown(items[list.children.length - 1], {
				keyCode: 13,
			});

			expect(onSubmitMock).toHaveBeenCalledTimes(1);
			expect(onSubmitMock).toHaveBeenCalledWith(
				{
					displayText: null,
					meta: {
						inputMethod: 'typeAhead',
					},
					title: 'FAB-983 P2 Integration plugin: do not cache Cloud ID in Vertigo world',
					url: 'https://product-fabric.atlassian.net/browse/FAB-983',
					data: {
						container: 'Fabric',
						icon: 'data:image/png;base64,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',
						iconAlt: 'test',
						lastViewedDate: new Date('2016-11-24T23:30:54.633Z'),
						meta: {
							source: 'recent-work',
						},
						name: 'FAB-983 P2 Integration plugin: do not cache Cloud ID in Vertigo world',
						objectId: 'ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/18347',
						url: 'https://product-fabric.atlassian.net/browse/FAB-983',
					},
				},
				expect.any(UIAnalyticsEvent),
			);
		});

		describe('Tab UI', () => {
			it('should render the Tab UI if there were multiple plugins with tabTitle available', async () => {
				const plugin1 = new MockLinkPickerPromisePlugin({
					tabKey: 'tab1',
					tabTitle: 'tab1',
				});
				const plugin2 = new MockLinkPickerPromisePlugin({
					tabKey: 'tab2',
					tabTitle: 'tab2',
				});

				const { testIds } = setupWithGenericPlugin({
					plugins: [plugin1, plugin2],
				});

				expect(screen.getByTestId(testIds.tabList)).toBeInTheDocument();
				const tabItems = screen.getAllByTestId(testIds.tabItem);
				expect(tabItems).toHaveLength(2);
				expect(tabItems[0]).toHaveTextContent('tab1');
				expect(tabItems[1]).toHaveTextContent('tab2');
				await waitForElementToBeRemoved(screen.queryByTestId(testIds.searchResultLoadingIndicator));
			});

			it('should NOT render TAB UI if there was only one plugin', async () => {
				const plugin1 = new MockLinkPickerPromisePlugin({
					tabKey: 'tab1',
					tabTitle: 'tab1',
				});

				const { testIds } = setupWithGenericPlugin({
					plugins: [plugin1],
				});

				expect(screen.queryByTestId(testIds.tabList)).not.toBeInTheDocument();
				await waitForElementToBeRemoved(screen.queryByTestId(testIds.searchResultLoadingIndicator));
			});

			it('should only show the items from the first plugin when loaded', async () => {
				const promise1 = Promise.resolve(mockedPluginData.slice(0, 1));
				const plugin1 = new MockLinkPickerPromisePlugin({
					tabKey: 'tab1',
					tabTitle: 'tab1',
					promise: promise1,
				});
				const promise2 = Promise.resolve(mockedPluginData.slice(1, 2));
				const plugin2 = new MockLinkPickerPromisePlugin({
					tabKey: 'tab2',
					tabTitle: 'tab2',
					promise: promise2,
				});

				const resolve1 = jest.spyOn(plugin1, 'resolve');
				const resolve2 = jest.spyOn(plugin2, 'resolve');

				const { testIds } = setupWithGenericPlugin({
					plugins: [plugin1, plugin2],
				});

				expect(resolve1).toHaveBeenCalledTimes(1);
				expect(resolve2).not.toHaveBeenCalled();

				await act(async () => {
					await promise1;
				});

				expect(await screen.findAllByTestId(testIds.searchResultItem)).toHaveLength(1);
				expect(screen.getByTestId(testIds.searchResultItem)).toHaveTextContent(
					mockedPluginData[0].name,
				);
			});

			it('should load and show the items from the second plugin when second tab was clicked', async () => {
				const promise1 = Promise.resolve(mockedPluginData.slice(0, 1));
				const plugin1 = new MockLinkPickerPromisePlugin({
					tabKey: 'tab1',
					tabTitle: 'tab1',
					promise: promise1,
				});

				const promise2 = Promise.resolve(mockedPluginData.slice(1, 2));
				const plugin2 = new MockLinkPickerPromisePlugin({
					tabKey: 'tab2',
					tabTitle: 'tab2',
					promise: promise2,
				});

				const resolve1 = jest.spyOn(plugin1, 'resolve');
				const resolve2 = jest.spyOn(plugin2, 'resolve');

				const { testIds } = setupWithGenericPlugin({
					plugins: [plugin1, plugin2],
				});

				await user.click(screen.getAllByTestId(testIds.tabItem)[1]);

				expect(resolve1).toHaveBeenCalledTimes(1);
				expect(resolve2).toHaveBeenCalledTimes(1);

				await act(async () => {
					await promise2;
				});

				expect(await screen.findAllByTestId(testIds.searchResultItem)).toHaveLength(1);
				expect(screen.getByTestId(testIds.searchResultItem)).toHaveTextContent(
					mockedPluginData[1].name,
				);
			});

			it('should still show recents when second tab clicked after arrow key used to highlight url on first tab', async () => {
				const promise1 = Promise.resolve(mockedPluginData.slice(0, 1));
				const plugin1 = new MockLinkPickerPromisePlugin({
					tabKey: 'tab1',
					tabTitle: 'tab1',
					promise: promise1,
				});

				const promise2 = Promise.resolve(mockedPluginData.slice(1, 2));
				const plugin2 = new MockLinkPickerPromisePlugin({
					tabKey: 'tab2',
					tabTitle: 'tab2',
					promise: promise2,
				});

				const resolve1 = jest.spyOn(plugin1, 'resolve');
				const resolve2 = jest.spyOn(plugin2, 'resolve');

				const { testIds } = setupWithGenericPlugin({
					plugins: [plugin1, plugin2],
				});

				await act(async () => {
					await promise1;
				});
				await act(async () => {
					await promise2;
				});

				// Press down arrow once to set first item to active
				fireEvent.keyDown(screen.getByTestId(testIds.urlInputField), {
					keyCode: 40,
				});

				// Expect url field to have the first (index 0) URL in it after arrow down
				expect(screen.getByTestId(testIds.urlInputField)).toHaveValue(mockedPluginData[0].url);

				// Click second tab
				await user.click(screen.getAllByTestId(testIds.tabItem)[1]);

				expect(resolve1).toHaveBeenCalledTimes(1);
				expect(resolve2).toHaveBeenCalledTimes(1);

				// Check our URL is still displayed in the url field
				expect(screen.getByTestId(testIds.urlInputField)).toHaveValue(mockedPluginData[0].url);

				// There should be one recent still displayed on the new tab
				expect(await screen.findAllByTestId(testIds.searchResultItem)).toHaveLength(1);

				// The recent displayed in the new tab is the second (index 1) element as that's
				// what we put in in the promise2 slice.
				expect(screen.getByTestId(testIds.searchResultItem)).toHaveTextContent(
					mockedPluginData[1].name,
				);
			});
		});

		describe('on Error', () => {
			it('should use errorFallback if provided with plugin', async () => {
				const FallbackUI = (props: { error: unknown; retry: () => void }) => {
					const { retry, error } = props;
					const message = error instanceof Error ? error.message : 'Try again';
					return (
						<button data-testid="mocked-fallback-action" onClick={retry}>
							{message}
						</button>
					);
				};

				const plugin1 = new UnstableMockLinkPickerPlugin({
					tabKey: 'tab1',
					tabTitle: 'Unstable',
					errorFallback: (error, retry) => <FallbackUI error={error} retry={retry} />,
				});
				const resolve1 = jest.spyOn(plugin1, 'resolve');

				const { testIds } = setupWithGenericPlugin({
					plugins: [plugin1],
				});

				await screen.findByTestId(testIds.linkPicker);
				const retryAction = await screen.findByTestId('mocked-fallback-action');
				expect(retryAction).toBeInTheDocument();
				expect(screen.queryByTestId(testIds.searchError)).not.toBeInTheDocument();

				await user.click(retryAction);

				await screen.findByTestId(testIds.searchResultList);
				expect(resolve1).toHaveBeenCalledTimes(2);
				expect(screen.getAllByTestId(testIds.searchResultItem)).toHaveLength(5);
			});

			it('should use default error message if provided errorFallback returns null', async () => {
				const plugins = [
					new UnstableMockLinkPickerPlugin({
						tabKey: 'tab1',
						tabTitle: 'Unstable',
						errorFallback: (error, retry) => null,
					}),
				];

				const { testIds } = setupWithGenericPlugin({
					plugins,
				});

				await screen.findByTestId(testIds.linkPicker);

				expect(await screen.findByTestId(testIds.searchError)).toBeInTheDocument();
			});

			it('should hide footer buttons when plugin throws unauthentication errors', async () => {
				const onCancelMock: LinkPickerProps['onCancel'] = jest.fn();
				const plugins = [
					new UnstableMockLinkPickerPlugin({
						tabKey: 'tab1',
						tabTitle: 'Unstable',
						errorFallback: (error, retry) => null,
					}),
				];

				const { testIds } = setupWithGenericPlugin({
					plugins,
					onCancel: onCancelMock,
				});

				await screen.findByTestId(testIds.linkPicker);
				await waitForElementToBeRemoved(screen.queryByTestId(testIds.insertButton));

				expect(screen.queryByTestId(testIds.insertButton)).not.toBeInTheDocument();
				expect(screen.queryByTestId(testIds.cancelButton)).not.toBeInTheDocument();
			});

			it('should disable buttons when plugin throws a search error', async () => {
				const plugins = [
					new UnstableMockLinkPickerPlugin({
						tabKey: 'tab1',
						tabTitle: 'Unstable',
					}),
				];

				const { testIds } = setupWithGenericPlugin({
					plugins,
				});

				await screen.findByTestId(testIds.linkPicker);
				const insertButton = await screen.findByTestId(testIds.insertButton);
				expect(insertButton).toBeInTheDocument();
				expect(insertButton).toHaveAttribute('disabled');
			});
		});

		describe('moving the submit button with the UNSAFE_moveSubmitButton prop', () => {
			it('should render the submit button below the search result by default', async () => {
				const { testIds } = setupWithGenericPlugin();
				const searchResultList = await screen.findByTestId(testIds.searchResultList);
				const insertButton = screen.getByTestId(testIds.insertButton);

				/**
				 * Using compareDocumentPosition to check if the insertButton is after the searchResultList.
				 * https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition#return_value
				 */
				expect(searchResultList.compareDocumentPosition(insertButton)).toBe(
					Node.DOCUMENT_POSITION_FOLLOWING,
				);
			});

			it('should render the submit button in between the plugin tab list and the input field when the UNSAFE_moveSubmitButton is passed', async () => {
				const plugin1 = new MockLinkPickerPromisePlugin({
					tabKey: 'tab1',
					tabTitle: 'tab1',
				});

				const plugin2 = new MockLinkPickerPromisePlugin({
					tabKey: 'tab2',
					tabTitle: 'tab2',
				});

				const { testIds } = setupWithGenericPlugin({
					plugins: [plugin1, plugin2],
					UNSAFE_moveSubmitButton: true,
				});

				const tabList = await screen.findByTestId(testIds.tabList);
				const insertButton = screen.getByTestId(testIds.insertButton);

				/**
				 * Using compareDocumentPosition to check if the insertButton is before the tabList.
				 * https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition#return_value
				 */
				expect(tabList.compareDocumentPosition(insertButton)).toBe(
					Node.DOCUMENT_POSITION_PRECEDING,
				);
			});
		});
	});

	it('should use scrolling tabs if feature flag is specified', async () => {
		setupLinkPicker({
			scrollingTabs: true,
			plugins: [
				new MockLinkPickerPromisePlugin({
					tabKey: 'tab1',
					tabTitle: 'Confluence',
				}),
				new MockLinkPickerPromisePlugin({
					tabKey: 'tab2',
					tabTitle: 'Bitbucket',
				}),
				new MockLinkPickerPromisePlugin({
					tabKey: 'tab3',
					tabTitle: 'Jira',
				}),
				new MockLinkPickerPromisePlugin({
					tabKey: 'tab4',
					tabTitle: 'Github',
				}),
				new MockLinkPickerPromisePlugin({
					tabKey: 'tab5',
					tabTitle: 'Drive',
				}),
				new MockLinkPickerPromisePlugin({
					tabKey: 'tab6',
					tabTitle: 'Tab long name 3',
				}),
				new MockLinkPickerPromisePlugin({
					tabKey: 'tab7',
					tabTitle: 'Tab long name 4',
				}),
				new MockLinkPickerPromisePlugin({
					tabKey: 'tab8',
					tabTitle: 'Tab long name 5',
				}),
				new MockLinkPickerPromisePlugin({
					tabKey: 'tab9',
					tabTitle: 'Tab long name 6',
				}),
				new MockLinkPickerPromisePlugin({
					tabKey: 'tab10',
					tabTitle: 'Tab long name 7',
				}),
				new MockLinkPickerPromisePlugin({
					tabKey: 'tab3',
					tabTitle: 'tab3',
				}),
			],
		});
		await waitForElementToBeRemoved(screen.queryByTestId(testIds.searchResultLoadingIndicator));

		expect(screen.getByTestId('scrolling-tabs')).toBeInTheDocument();
	});

	it('should fire action callback when action button is clicked', async () => {
		const mockActionCallback = jest.fn();
		const plugin = new MockLinkPickerPromisePlugin({
			tabKey: 'tab1',
			tabTitle: 'Action',
			action: {
				label: {
					id: 'test',
					defaultMessage: 'Action',
					description: 'test action',
				},
				callback: mockActionCallback,
			},
		});

		const { testIds } = setupLinkPicker({ plugins: [plugin] });
		const actionButton = await screen.findByTestId(testIds.actionButton);

		expect(actionButton).toBeInTheDocument();

		await user.click(actionButton);

		expect(mockActionCallback).toHaveBeenCalledTimes(1);
	});

	describe('with submit in progress', () => {
		it('should not fire submit callback when form submitted', async () => {
			const { onSubmitMock, testIds, rerenderLinkPicker } = setupLinkPicker();

			await user.type(screen.getByTestId(testIds.urlInputField), 'www.atlassian.com');
			fireEvent.submit(screen.getByTestId(testIds.urlInputField));

			expect(onSubmitMock).toHaveBeenCalledTimes(1);
			expect(onSubmitMock).toHaveBeenCalledWith(
				{
					url: 'http://www.atlassian.com',
					title: null,
					displayText: null,
					rawUrl: 'www.atlassian.com',
					meta: {
						inputMethod: 'manual',
					},
				},
				expect.any(UIAnalyticsEvent),
			);

			rerenderLinkPicker({
				isSubmitting: true,
			});
			fireEvent.submit(screen.getByTestId(testIds.urlInputField));
			expect(onSubmitMock).toHaveBeenCalledTimes(1);
		});

		it('should not fire submit callback when Insert button pressed', async () => {
			const { onSubmitMock, testIds, rerenderLinkPicker } = setupLinkPicker();

			await user.type(screen.getByTestId(testIds.urlInputField), 'www.atlassian.com');
			fireEvent.click(screen.getByTestId(testIds.insertButton));

			expect(onSubmitMock).toHaveBeenCalledTimes(1);
			expect(onSubmitMock).toHaveBeenCalledWith(
				{
					url: 'http://www.atlassian.com',
					title: null,
					displayText: null,
					rawUrl: 'www.atlassian.com',
					meta: {
						inputMethod: 'manual',
					},
				},
				expect.any(UIAnalyticsEvent),
			);

			rerenderLinkPicker({
				isSubmitting: true,
			});
			fireEvent.click(screen.getByTestId(testIds.insertButton));
			expect(onSubmitMock).toHaveBeenCalledTimes(1);
		});

		it('should not fire cancel callback when Cancel button pressed', async () => {
			const onCancelMock: LinkPickerProps['onCancel'] = jest.fn();
			const { testIds } = setupLinkPicker({
				onCancel: onCancelMock,
				isSubmitting: true,
			});

			await user.type(screen.getByTestId(testIds.urlInputField), 'www.atlassian.com');
			fireEvent.click(screen.getByTestId(testIds.cancelButton));
			fireEvent.click(screen.getByTestId(testIds.cancelButton));

			expect(onCancelMock).toHaveBeenCalledTimes(0);
		});

		it('should not clear input text when clear button pressed', async () => {
			const { testIds } = setupLinkPicker({
				url: 'https://www.google.com',
				isSubmitting: true,
			});

			await user.click(screen.getByTestId(testIds.clearUrlButton));

			expect(screen.getByTestId(testIds.urlInputField)).toHaveValue('https://www.google.com');
		});

		it('should not change input text when typing', async () => {
			const { testIds } = setupLinkPicker({
				url: 'https://www.google.com',
				isSubmitting: true,
			});

			await user.type(screen.getByTestId(testIds.urlInputField), '/about');

			expect(screen.getByTestId(testIds.urlInputField)).toHaveValue('https://www.google.com');
		});

		it('should have aria-readonly attributes on form elements', async () => {
			const { testIds } = setupLinkPicker({
				url: 'https://www.google.com',
				isSubmitting: true,
			});

			expect(screen.getByTestId(testIds.urlInputField)).toHaveAttribute('aria-readonly', 'true');
		});

		it('should have an accessible status message during submit', async () => {
			const { testIds, rerenderLinkPicker } = setupLinkPicker({
				url: 'https://www.google.com',
				isSubmitting: true,
			});

			const submitStatusMessage = screen.getByTestId(testIds.submitStatusA11yIndicator);
			expect(submitStatusMessage).toHaveTextContent(
				formFooterMessages.submittingStatusMessage.defaultMessage,
			);

			rerenderLinkPicker({
				url: 'https://www.google.com',
				isSubmitting: false,
			});

			expect(screen.queryByTestId(testIds.submitStatusA11yIndicator)).not.toBeInTheDocument();
		});
	});
});
