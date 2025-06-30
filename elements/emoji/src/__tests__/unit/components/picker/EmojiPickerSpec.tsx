import { AnalyticsListener } from '@atlaskit/analytics-next';
import { waitUntil } from '@atlaskit/elements-test-helpers';
import { matchers } from '@emotion/jest';
import { act, fireEvent, type RenderResult, screen, waitFor, within } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';
import { mockReactDomWarningGlobal, renderWithIntl } from '../../_testing-library';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { mockNonUploadingEmojiResourceFactory } from '@atlaskit/util-data-test/mock-non-uploading-emoji-resource-factory';
import type { ServiceConfig } from '@atlaskit/util-service-support';
import userEvent from '@testing-library/user-event';
import fetchMock from 'fetch-mock/cjs/client';
import EmojiRepository from '../../../../api/EmojiRepository';
import { EmojiResource, type EmojiResourceConfig } from '../../../../api/EmojiResource';
import { toneSelectorTestId } from '../../../../components/common/ToneSelector';
import { messages } from '../../../../components/i18n';
import { CategoryDescriptionMap } from '../../../../components/picker/categories';
import { sortCategories } from '../../../../components/picker/CategorySelector';
import * as utils from '../../../../components/picker/utils';
import EmojiPicker, {
	type Props as EmojiPickerProps,
} from '../../../../components/picker/EmojiPicker';
import { emojiPickerHeightOffset } from '../../../../components/picker/utils';
import {
	SearchSourceTypes,
	type EmojiDescription,
	type EmojiProvider,
	type OptionalEmojiDescription,
} from '../../../../types';
import {
	categoryClickedEvent,
	closedPickerEvent,
	openedPickerEvent,
	pickerClickedEvent,
	pickerSearchedEvent,
	recordFailedEmoji,
	recordSucceededEmoji,
	toneSelectedEvent,
	toneSelectorClosedEvent,
	toneSelectorOpenedEvent,
	ufoExperiences,
} from '../../../../util/analytics';
import * as constants from '../../../../util/constants';
import {
	customCategory,
	defaultCategories,
	defaultEmojiPickerSize,
	emojiPickerHeight,
	emojiPickerHeightWithPreview,
	frequentCategory,
	selectedToneStorageKey,
} from '../../../../util/constants';
import { isMessagesKey } from '../../../../util/type-helpers';
import {
	getEmojiResourcePromise,
	mediaEmoji,
	standardEmojis,
	standardServiceEmojis,
} from '../../_test-data';
import * as helperTestingLibrary from './_emoji-picker-helpers-testing-library';
import * as helper from './_emoji-picker-test-helpers';

const baseUrl = 'https://bogus/';
const p1Url = 'https://p1/standard';

const provider1: ServiceConfig = {
	url: p1Url,
};

const defaultApiConfig: EmojiResourceConfig = {
	recordConfig: {
		url: baseUrl,
	},
	providers: [provider1],
};

const emojiListHeaders = {
	ALL_UPLOADS: 'All uploads',
	ATLASSIAN: 'Productivity',
	FLAGS: 'Flags',
};

const emojiCategoryIds = {
	ATLASSIAN: 'ATLASSIAN',
	FLAGS: 'FLAGS',
};
// Add the custom matchers provided by '@emotion/jest'
expect.extend(matchers);
// Add matcher provided by 'jest-axe'
expect.extend(toHaveNoViolations);

describe('<EmojiPicker />', () => {
	let onEvent: jest.Mock;

	const pickerUFO = ufoExperiences['emoji-picker-opened'];
	const searchUFO = ufoExperiences['emoji-searched'];
	const emojiRecordUFO = ufoExperiences['emoji-selection-recorded'];
	const ufoPickerStartSpy = jest.spyOn(pickerUFO, 'start');
	const ufoPickerMarkFMPSpy = jest.spyOn(pickerUFO, 'markFMP');
	const ufoPickerSuccessSpy = jest.spyOn(pickerUFO, 'success');
	const ufoPickerFailureSpy = jest.spyOn(pickerUFO, 'failure');
	const ufoPickerAbortSpy = jest.spyOn(pickerUFO, 'abort');
	const ufoSearchedStartSpy = jest.spyOn(searchUFO, 'start');
	const ufoSearchedSuccessSpy = jest.spyOn(searchUFO, 'success');
	const ufoSearchedAbortSpy = jest.spyOn(searchUFO, 'abort');
	const ufoSearchedFailureSpy = jest.spyOn(searchUFO, 'failure');

	const ufoEmojiRecordedStartSpy = jest.spyOn(emojiRecordUFO, 'start');
	const ufoEmojiRecordedSuccessSpy = jest.spyOn(emojiRecordUFO, 'success');
	const ufoEmojiRecordedFailureSpy = jest.spyOn(emojiRecordUFO, 'failure');

	mockReactDomWarningGlobal();

	beforeAll(() => {
		// set search debounce to 0
		Object.defineProperty(constants, 'EMOJI_SEARCH_DEBOUNCE', { value: 0 });
	});

	beforeEach(() => {
		onEvent = jest.fn();

		// scrolling of the virtual list doesn't work out of the box for the tests
		// mocking `scrollToRow` for all tests
		jest
			.spyOn(utils, 'scrollToRow')
			.mockImplementation((listRef?: any, index?: number) =>
				helperTestingLibrary.scrollToIndex(index || 0),
			);
	});

	afterEach(() => {
		jest.clearAllMocks();
		localStorage.clear();
		fetchMock.restore();
	});

	const renderEmojiPicker = (pickerProps: Partial<EmojiPickerProps> = {}) =>
		renderWithIntl(
			<AnalyticsListener channel="fabric-elements" onEvent={onEvent}>
				<EmojiPicker emojiProvider={getEmojiResourcePromise()} {...pickerProps} />
			</AnalyticsListener>,
		);

	const getUpdatedList = () => screen.getByRole('grid', { name: 'Emojis' });

	describe('analytics for component lifecycle', () => {
		it('should fire analytics when component unmounts', async () => {
			const component = await helper.setupPicker(undefined, undefined, onEvent);
			component.unmount();
			expect(onEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: openedPickerEvent(),
				}),
				'fabric-elements',
			);
			expect(onEvent).toHaveBeenLastCalledWith(
				expect.objectContaining({
					payload: closedPickerEvent({
						duration: expect.any(Number),
					}),
				}),
				'fabric-elements',
			);
		});
	});

	describe('display', () => {
		it('should display first set of emoji in viewport by default', async () => {
			await helper.setupPicker();
			const list = getUpdatedList();
			const emojis = await helper.emojisVisible(list);

			const firstEmoji = emojis[0];
			// First emoji displayed
			expect(firstEmoji.getAttribute('aria-label')).toEqual(helper.allEmojis[0].shortName);

			const lastEmoji = emojis[emojis.length - 1];
			// Last displayed emoji in same order as source data
			expect(lastEmoji.getAttribute('aria-label')).toEqual(
				helper.allEmojis[emojis.length - 1].shortName,
			);
		});

		it('should display all categories', async () => {
			await helper.setupPicker();
			let expectedCategories = defaultCategories;
			const provider = await getEmojiResourcePromise();

			// the provider is expected to implement calculateDynamicCategories for this test
			expect(provider.calculateDynamicCategories).toBeDefined();
			const dynamicCategories = await provider.calculateDynamicCategories();
			expectedCategories = expectedCategories.concat(dynamicCategories);

			// Explicitly wait for the last one to make sure they're all loaded
			await screen.findByTestId('category-selector-CUSTOM');
			const categorySelectorButtons = await screen.findAllByRole('tab');

			expect(categorySelectorButtons).toHaveLength(expectedCategories.length);
			act(() => {
				expectedCategories.sort(sortCategories);
			});

			for (let i = 0; i < categorySelectorButtons.length; i++) {
				const button = categorySelectorButtons[i];
				const messageKey = CategoryDescriptionMap[expectedCategories[i]].name;
				expect(isMessagesKey(messageKey)).toBeTruthy();
				if (isMessagesKey(messageKey)) {
					expect(button).toHaveAttribute('aria-label', messages[messageKey].defaultMessage);
				}
			}
		});

		it('should highlight first category (no frequent category)', async () => {
			await helper.setupPicker();
			// Explicitly wait for the last one to make sure they're all loaded
			await screen.findByTestId('category-selector-CUSTOM');
			const categorySelectorButtons = await screen.findAllByRole('tab');

			expect(categorySelectorButtons[0]).toHaveAttribute(
				'aria-label',
				messages['peopleCategory'].defaultMessage,
			);
			await waitFor(() => {
				expect(categorySelectorButtons[0]).toHaveCompiledCss(
					'color',
					'var(--ds-text-selected,#0c66e4)',
				);
			});
		});

		it('should tone selector in preview by default', async () => {
			await renderEmojiPicker();

			const toneSelectorButton = await screen.findByLabelText('Choose your skin tone', {
				exact: false,
			});
			const toneSelector = await screen.getByTestId(toneSelectorTestId);

			expect(toneSelectorButton).toBeVisible();
			expect(toneSelector).not.toBeVisible();
		});

		it('should adjust picker height if preview is shown', async () => {
			await helper.setupPickerWithoutToneSelector();
			const list = getUpdatedList();

			// Preview should not be displayed
			const picker = screen.getByRole('dialog', { name: 'Emoji picker' });
			expect(picker).toHaveCompiledCss(
				'height',
				emojiPickerHeight + emojiPickerHeightOffset(defaultEmojiPickerSize) + 'px',
			);

			const emojis = await helper.emojisVisible(list);
			const hoverButton = emojis[0];
			await userEvent.hover(hoverButton);

			await helper.findEmojiPreview();

			// Preview should be displayed and the height of the picker adjusted
			const pickerWithPreview = await screen.findAllByRole('dialog', {
				name: 'Emoji picker',
			});
			expect(pickerWithPreview[0]).toHaveCompiledCss(
				'height',
				emojiPickerHeightWithPreview + emojiPickerHeightOffset(defaultEmojiPickerSize) + 'px',
			);
		});

		it('media emoji should render placeholder while loading', async () => {
			const mockConfig = {
				promiseBuilder: (result: any, context: string) => {
					if (context === 'getMediaEmojiDescriptionURLWithInlineToken') {
						// unresolved promise
						return new Promise(() => {});
					}
					return Promise.resolve(result);
				},
			};
			await helper.setupPicker(undefined, mockConfig);

			await waitFor(() => {
				expect(helperTestingLibrary.getVirtualList()).toBeInTheDocument();
			});

			await helperTestingLibrary.selectCategory(customCategory);

			await waitFor(() => {
				expect(helperTestingLibrary.getEmojiPlaceholder(mediaEmoji.shortName)).toBeInTheDocument();
			});
		});
	});

	describe('hover', () => {
		it('should update preview on hover', async () => {
			await helper.setupPickerWithoutToneSelector();
			const list = getUpdatedList();

			const emojis = await helper.emojisVisible(list);
			const hoverButton = emojis[0];
			await userEvent.hover(hoverButton);

			const footer = await helper.findEmojiPreview();

			const previewEmoji = within(footer).getAllByRole('img')[0];
			expect(previewEmoji).toBeVisible();

			expect(previewEmoji).toHaveAttribute('aria-label', helper.allEmojis[0].shortName);
		});
	});

	describe('category', () => {
		it('selecting category should show that category', async () => {
			await act(async () => {
				helper.setupPicker(undefined, undefined, onEvent);
			});

			await waitFor(() => {
				expect(helperTestingLibrary.getVirtualList()).toBeInTheDocument();
			});

			expect(
				helperTestingLibrary.queryEmojiCategoryHeader(emojiListHeaders.FLAGS),
			).not.toBeInTheDocument();

			await helperTestingLibrary.selectCategory(emojiCategoryIds.FLAGS);

			await waitFor(() => {
				expect(
					helperTestingLibrary.queryEmojiCategoryHeader(emojiListHeaders.FLAGS),
				).toBeInTheDocument();
			});

			expect(onEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: categoryClickedEvent({ category: emojiCategoryIds.FLAGS }),
				}),
				'fabric-elements',
			);
		});

		it('selecting custom category scrolls to bottom', async () => {
			await helper.setupPicker();

			await waitFor(() => {
				expect(helperTestingLibrary.getVirtualList()).toBeInTheDocument();
			});

			expect(
				helperTestingLibrary.queryEmojiCategoryHeader(emojiListHeaders.ALL_UPLOADS),
			).not.toBeInTheDocument();

			await helperTestingLibrary.selectCategory(customCategory);

			await waitFor(() => {
				expect(
					helperTestingLibrary.queryEmojiCategoryHeader(emojiListHeaders.ALL_UPLOADS),
				).toBeInTheDocument();
			});
		});

		it('does not add non-standard categories to the selector if there are no emojis in those categories', async () => {
			await helper.setupPicker({
				emojiProvider: mockNonUploadingEmojiResourceFactory(new EmojiRepository(standardEmojis)),
			});

			await waitFor(() => {
				expect(helperTestingLibrary.getVirtualList()).toBeInTheDocument();
			});

			const buttons = within(helperTestingLibrary.getCategorySelector()).getAllByRole('tab');
			expect(buttons).toHaveLength(defaultCategories.length);

			const lastRowIndex = Math.round(standardEmojis.length / 8);
			await waitFor(() => {
				helperTestingLibrary.scrollToIndex(lastRowIndex);
			});

			expect(helperTestingLibrary.queryCategorySelector(customCategory)).not.toBeInTheDocument();
			expect(
				helperTestingLibrary.queryCategorySelector(emojiCategoryIds.ATLASSIAN),
			).not.toBeInTheDocument();

			expect(
				helperTestingLibrary.queryEmojiCategoryHeader(emojiListHeaders.ALL_UPLOADS),
			).not.toBeInTheDocument();
			expect(
				helperTestingLibrary.queryEmojiCategoryHeader(emojiListHeaders.ATLASSIAN),
			).not.toBeInTheDocument();
		});

		it('should display and highlight frequent category when there are frequently used emoji', async () => {
			const frequent: EmojiDescription = {
				...standardEmojis[0],
				category: frequentCategory,
			};
			const emojiWithFrequent: EmojiDescription[] = [...standardEmojis, frequent];
			await helper.setupPicker({
				emojiProvider: mockNonUploadingEmojiResourceFactory(new EmojiRepository(emojiWithFrequent)),
			});

			// Explicitly wait for the last one to make sure they're all loaded
			await screen.findByTestId('category-selector-FREQUENT');
			const categorySelectorButtons = await screen.findAllByRole('tab');

			expect(categorySelectorButtons).toHaveLength(defaultCategories.length + 1);
			await waitFor(() => {
				expect(helper.categoryVisible(frequentCategory)).toBe(true);
			});
			await waitFor(() => {
				expect(categorySelectorButtons[0]).toHaveCompiledCss(
					'color',
					'var(--ds-text-selected,#0c66e4)',
				);
			});
		});

		it('should show frequent emoji first', async () => {
			const frequent: EmojiDescription[] = [];
			for (let i = 0; i < 5; i++) {
				const emoji = {
					...standardEmojis[i],
					category: frequentCategory,
				};

				frequent.push(emoji);
			}

			const emojiWithFrequent: EmojiDescription[] = [...standardEmojis, ...frequent];

			await helper.setupPicker({
				emojiProvider: mockNonUploadingEmojiResourceFactory(new EmojiRepository(emojiWithFrequent)),
			});
			const list = getUpdatedList();
			await helper.emojisVisible(list);

			const rows = within(list).getAllByRole('row');
			const firstRow = rows[0];
			await within(firstRow).findByRole('rowheader', {
				name: 'Frequent',
			});
			const secondRow = rows[1];
			const emojis = await helper.emojisVisible(secondRow);
			expect(emojis).toHaveLength(5);
		});

		it('adds non-standard categories to the selector dynamically based on whether they are populated with emojis', async () => {
			await helper.setupPicker();

			await waitFor(() => {
				expect(helperTestingLibrary.getVirtualList()).toBeInTheDocument();
			});

			// Explicitly wait for the last one to make sure they're all loaded
			await screen.findByTestId('category-selector-CUSTOM');
			const buttons = await within(helperTestingLibrary.getCategorySelector()).findAllByRole('tab');
			expect(buttons).toHaveLength(defaultCategories.length + 2);

			await helperTestingLibrary.selectCategory(customCategory);

			await waitFor(() => {
				expect(
					helperTestingLibrary.getEmojiCategoryHeader(emojiListHeaders.ATLASSIAN),
				).toBeInTheDocument();
			});
		});
	});

	describe('selection', () => {
		it('selecting emoji should trigger onSelection', async () => {
			let selection: OptionalEmojiDescription;
			const clickOffset = 10;
			await helper.setupPicker(
				{
					onSelection: (_emojiId, emoji) => {
						selection = emoji;
					},
				} as EmojiPickerProps,
				undefined,
				onEvent,
			);

			const list = getUpdatedList();
			const emojis = await helper.emojisVisible(list);
			const hoverButton = emojis[clickOffset];
			await userEvent.click(hoverButton);

			await waitUntil(() => !!selection);
			expect(selection).toBeDefined();
			expect(selection!.id).toEqual(helper.allEmojis[clickOffset].id);

			expect(onEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: pickerClickedEvent({
						emojiId: '1f431',
						category: 'NATURE',
						type: 'STANDARD',
						queryLength: 0,
						duration: expect.any(Number),
					}),
				}),
				'fabric-elements',
			);

			expect(onEvent).toHaveBeenLastCalledWith(
				expect.objectContaining({
					payload: recordSucceededEmoji(selection)(SearchSourceTypes.PICKER),
				}),
				'fabric-elements',
			);

			expect(ufoEmojiRecordedStartSpy).toBeCalled();
			expect(ufoEmojiRecordedSuccessSpy).toBeCalled();
			expect(ufoEmojiRecordedFailureSpy).not.toBeCalled();
		});

		it('should fire insertion failed event if provider recordSelection fails', async () => {
			let selection: OptionalEmojiDescription;
			let failureOccurred = false;
			const emojiProvider = getEmojiResourcePromise();
			const clickOffset = 10;
			await helper.setupPicker(
				{
					onSelection: (_emojiId, emoji) => {
						selection = emoji;
					},
					emojiProvider,
				} as EmojiPickerProps,
				undefined,
				onEvent,
			);
			const list = getUpdatedList();

			const provider = await emojiProvider;
			provider.recordSelection = jest.fn().mockImplementation(() => {
				failureOccurred = true;
				return Promise.reject({ code: 403, reason: 'Forbidden' });
			});

			const emojis = await helper.emojisVisible(list);
			const hoverButton = emojis[clickOffset];
			await userEvent.click(hoverButton);

			await waitUntil(() => failureOccurred);
			await waitUntil(() => !!selection);

			expect(selection).toBeDefined();
			expect(selection!.id).toEqual(helper.allEmojis[clickOffset].id);
			expect(onEvent).toHaveBeenLastCalledWith(
				expect.objectContaining({
					payload: recordFailedEmoji(selection)(SearchSourceTypes.PICKER),
				}),
				'fabric-elements',
			);
			expect(ufoEmojiRecordedStartSpy).toBeCalled();
			expect(ufoEmojiRecordedSuccessSpy).not.toBeCalled();
			expect(ufoEmojiRecordedFailureSpy).toBeCalled();
		});

		it('selecting emoji should call recordSelection on EmojiProvider', async () => {
			let selection: OptionalEmojiDescription;
			const emojiResourcePromise = getEmojiResourcePromise();
			const clickOffset = 10;
			await helper.setupPicker({
				onSelection: (_emojiId, emoji) => {
					selection = emoji;
				},
				emojiProvider: emojiResourcePromise,
			} as EmojiPickerProps);
			const list = getUpdatedList();

			const emojis = await helper.emojisVisible(list);
			const hoverButton = emojis[clickOffset];
			await userEvent.click(hoverButton);

			await waitUntil(() => !!selection);
			const provider = await emojiResourcePromise;
			expect(provider.recordedSelections).toHaveLength(1);
			expect(provider.recordedSelections[0].shortName).toEqual(
				helper.allEmojis[clickOffset].shortName,
			);

			expect(ufoEmojiRecordedStartSpy).toBeCalled();
			expect(ufoEmojiRecordedSuccessSpy).toBeCalled();
			expect(ufoEmojiRecordedFailureSpy).not.toBeCalled();
		});
	});

	describe('search', () => {
		it('searching for "al" should match emoji via description', async () => {
			await helper.setupPicker();

			await waitFor(() => {
				expect(helperTestingLibrary.getVirtualList()).toBeInTheDocument();
				expect(helperTestingLibrary.getEmojiSearchInput()).toBeInTheDocument();
			});

			await helperTestingLibrary.searchEmoji('al');

			await waitFor(() => {
				expect(screen.queryByTestId('sprite-emoji-:flag_al:')).toBeInTheDocument();
				expect(screen.queryByTestId('sprite-emoji-:flag_dz:')).toBeInTheDocument();

				const emojis = within(helperTestingLibrary.getVirtualList()).getAllByRole('button');

				expect(emojis.length).toEqual(2);
			});
		});

		it('searching for red car should match emoji via shortName', async () => {
			await helper.setupPicker();

			await waitFor(() => {
				expect(helperTestingLibrary.getVirtualList()).toBeInTheDocument();
				expect(helperTestingLibrary.getEmojiSearchInput()).toBeInTheDocument();
			});

			await helperTestingLibrary.searchEmoji('red car');

			await waitFor(() => {
				expect(screen.queryByTestId('sprite-emoji-:red_car:')).toBeInTheDocument();

				expect(screen.getByLabelText(':red_car:')).toBeInTheDocument();

				const emojis = within(helperTestingLibrary.getVirtualList()).getAllByRole('button');

				expect(emojis.length).toEqual(1);
			});
		});

		it('searching should disable categories in selector', async () => {
			await helper.setupPicker();

			await waitFor(() => {
				expect(helperTestingLibrary.getVirtualList()).toBeInTheDocument();
				expect(helperTestingLibrary.getEmojiSearchInput()).toBeInTheDocument();
			});

			await helperTestingLibrary.searchEmoji('al');

			await waitFor(() => {
				const emojis = within(helperTestingLibrary.getVirtualList()).getAllByRole('button');

				expect(emojis.length).toEqual(2);

				expect(helperTestingLibrary.queryCategorySelector(emojiCategoryIds.FLAGS)).toHaveAttribute(
					'disabled',
				);
			});
		});

		it('clear searching should show un-filtered emojis', async () => {
			let initialEmojisCount = 0;

			await helper.setupPicker();
			await waitFor(() => {
				expect(helperTestingLibrary.getVirtualList()).toBeInTheDocument();
				expect(helperTestingLibrary.getEmojiSearchInput()).toBeInTheDocument();
				const emojis = within(helperTestingLibrary.getVirtualList()).getAllByRole('button');
				initialEmojisCount = emojis.length;
			});

			// search an un-existed emoji
			await helperTestingLibrary.searchEmoji('empty');
			await waitFor(() => {
				const emojis = within(helperTestingLibrary.getVirtualList()).queryAllByRole('button');
				expect(emojis.length).toEqual(0);
				expect(helperTestingLibrary.queryCategorySelector(emojiCategoryIds.FLAGS)).toHaveAttribute(
					'disabled',
				);
			});

			// clear out emoji search
			await userEvent.clear(helperTestingLibrary.getEmojiSearchInput());
			await waitFor(() => {
				const emojis = within(helperTestingLibrary.getVirtualList()).getAllByRole('button');

				expect(emojis.length).toEqual(initialEmojisCount);
				expect(
					helperTestingLibrary.queryCategorySelector(emojiCategoryIds.FLAGS),
				).not.toHaveAttribute('disabled');
			});
		});

		it('searching should fire analytics', async () => {
			await helper.setupPicker(undefined, undefined, onEvent);

			await waitFor(() => {
				expect(helperTestingLibrary.getVirtualList()).toBeInTheDocument();
				expect(helperTestingLibrary.getEmojiSearchInput()).toBeInTheDocument();
			});

			await helperTestingLibrary.searchEmoji('al');

			await waitFor(() => {
				const emojis = within(helperTestingLibrary.getVirtualList()).getAllByRole('button');

				expect(emojis.length).toEqual(2);
			});

			expect(onEvent).toHaveBeenLastCalledWith(
				expect.objectContaining({
					payload: pickerSearchedEvent({
						queryLength: 2,
						numMatches: 2,
					}),
				}),
				'fabric-elements',
			);
		});

		it('searching should fire ufo experiences', async () => {
			jest.clearAllMocks();
			// arrange emoji provider
			fetchMock.mock({
				matcher: `begin:${provider1.url}`,
				response: standardServiceEmojis,
			});
			const resource = new EmojiResource(defaultApiConfig);
			const emojiProvider = resource.getEmojiProvider();

			await helper.setupPicker({
				emojiProvider,
				hideToneSelector: true,
			});

			// search emoji
			await waitFor(() => {
				expect(helperTestingLibrary.getEmojiSearchInput()).toBeInTheDocument();
			});
			await helperTestingLibrary.searchEmoji('grinning');
			await waitFor(() => {
				expect(screen.queryByTestId('sprite-emoji-:grinning:')).toBeInTheDocument();
			});

			expect(ufoSearchedStartSpy).toBeCalled();
			expect(ufoSearchedSuccessSpy).toBeCalled();
			expect(ufoSearchedAbortSpy).not.toBeCalled();
			expect(ufoSearchedFailureSpy).not.toBeCalled();
		});
	});

	describe('skin tone selection', () => {
		it('should display the tone emoji by default', async () => {
			await helper.setupPicker();

			const list = getUpdatedList();
			const emojis = await helper.emojisVisible(list);

			const hoverButton = emojis[0];
			await userEvent.hover(hoverButton);

			const emojiActions = screen.getByTestId('emoji-actions');
			const toneEmoji = within(emojiActions).getByRole('button', {
				name: 'Choose your skin tone, default skin tone selected',
			});
			expect(toneEmoji).toBeVisible();
		});

		it('should display emojis without skin tone variations by default', async () => {
			await helper.setupPicker();
			const list = getUpdatedList();

			const emojis = await helper.emojisVisible(list);
			const hoverOffset = helper.findHandEmoji(emojis);
			expect(hoverOffset).toBeGreaterThan(-1);
			const handEmoji = helper.findEmoji(list)[hoverOffset];
			expect(handEmoji).toHaveAttribute('aria-label', ':raised_hand:');
		});

		it('should fire tone selected and not cancelled', async () => {
			const onEvent = jest.fn();
			await helper.setupPicker(undefined, undefined, onEvent);

			const list = getUpdatedList();
			const emojis = await helper.emojisVisible(list);

			const hoverButton = emojis[0];
			await userEvent.hover(hoverButton);

			const preview = screen.getByTestId('emoji-actions');
			const toneEmoji = within(preview).getByRole('button', {
				name: 'Choose your skin tone, default skin tone selected',
			});
			await within(toneEmoji).getByTestId('sprite-emoji-:raised_hand:');

			await userEvent.click(toneEmoji);

			const toneSelectors = await screen.findAllByRole('radio', {
				name: /.* skin tone/,
			});

			expect(onEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: toneSelectorOpenedEvent({}),
				}),
				'fabric-elements',
			);

			const toneButton = toneSelectors[0];
			await userEvent.click(toneButton);

			expect(onEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: toneSelectedEvent({ skinToneModifier: 'light' }),
				}),
				'fabric-elements',
			);
		});

		it('should fire selector cancelled when no tone selected', async () => {
			const onEvent = jest.fn();
			await helper.setupPicker(undefined, undefined, onEvent);

			const list = getUpdatedList();
			const emojis = await helper.emojisVisible(list);

			const hoverButton = emojis[0];
			await userEvent.hover(hoverButton);

			const preview = screen.getByTestId('emoji-actions');
			const toneEmoji = within(preview).getByRole('button', {
				// TODO: skin tone preference gets carried across over tests, that's bad and causes these nasty work-arounds to make tests predictable
				name: /Choose your skin tone, .* skin tone selected/,
			});
			await userEvent.click(toneEmoji);

			await screen.findAllByRole('radio', {
				name: /.* skin tone/,
			});

			expect(onEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: toneSelectorOpenedEvent({}),
				}),
				'fabric-elements',
			);
			fireEvent.mouseLeave(toneEmoji);

			expect(onEvent).toHaveBeenLastCalledWith(
				expect.objectContaining({
					payload: toneSelectorClosedEvent(),
				}),
				'fabric-elements',
			);
		});

		it('should display emojis using the skin tone preference provided by the EmojiResource', async () => {
			const emojiProvider = getEmojiResourcePromise();
			const provider = await emojiProvider;
			provider.setSelectedTone(1);

			await helper.setupPicker({ emojiProvider });
			const list = getUpdatedList();
			const emojis = await helper.emojisVisible(list);
			const hoverOffset = helper.findHandEmoji(emojis);
			expect(hoverOffset).toBeGreaterThan(-1);
			const handEmoji = helper.findEmoji(list)[hoverOffset];
			expect(handEmoji).toHaveAttribute('aria-label', ':raised_hand::skin-tone-2:');
		});
	});

	describe('with localStorage available', () => {
		it('should use localStorage to remember tone selection between sessions', async () => {
			let unmount: RenderResult['unmount'];
			const findToneEmojiInNewPicker = async () => {
				({ unmount } = await helper.setupPicker());
				const list = getUpdatedList();
				const emojis = await helper.emojisVisible(list);
				const hoverOffset = helper.findHandEmoji(emojis);
				expect(hoverOffset).toBeGreaterThan(-1);
				return helper.findEmoji(list)[hoverOffset];
			};

			const tone = '2';
			const provider = await getEmojiResourcePromise();
			provider.setSelectedTone(parseInt(tone, 10));

			expect(localStorage.setItem).toHaveBeenCalledWith(selectedToneStorageKey, tone);

			// First picker should have tone set by default
			const handEmoji1 = await findToneEmojiInNewPicker();
			expect(handEmoji1).toHaveAttribute('aria-label', ':raised_hand::skin-tone-3:');
			unmount!();

			// Second picker should have tone set by default
			const handEmoji2 = await findToneEmojiInNewPicker();
			expect(handEmoji2).toHaveAttribute('aria-label', ':raised_hand::skin-tone-3:');
		});
	});

	describe('with picker opened experiences', () => {
		it('should track picker opened UFO experience when picker rendered and unmounted', async () => {
			const { unmount } = await helper.setupPicker();
			unmount();
			expect(ufoPickerStartSpy).toBeCalled();
			expect(ufoPickerMarkFMPSpy).toBeCalled();
			expect(ufoPickerSuccessSpy).toBeCalled();
			expect(ufoPickerAbortSpy).toBeCalled();
		});

		it('should fail picker opened UFO experience when picker throw errors', async () => {
			const fakeExplodingProvider = Promise.resolve({
				subscribe: () => {
					throw new Error('BOOOOOM!');
				},
			}) as unknown as Promise<EmojiProvider>;

			try {
				await helper.setupPicker({
					emojiProvider: fakeExplodingProvider,
				});
			} catch (e) {
				// There's an assertion in setupPicker we don't care about
			}

			expect(ufoPickerStartSpy).toBeCalled();
			expect(ufoPickerFailureSpy).toBeCalled();
		});
	});

	describe('Accessibility', () => {
		it('should have no accessibility violations', async () => {
			const { container } = await helper.setupPicker();
			const list = getUpdatedList();
			await helper.emojisVisible(list);

			const results = await axe(container);

			expect(results).toHaveNoViolations();
		});
	});
});
