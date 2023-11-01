import React from 'react';
import { waitUntil } from '@atlaskit/elements-test-helpers';
import { B300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { act, screen, waitFor, within } from '@testing-library/react';
import { matchers } from '@emotion/jest';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import type { ReactWrapper } from 'enzyme';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  mockReactDomWarningGlobal,
  renderWithIntl,
} from '../../_testing-library';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { mockNonUploadingEmojiResourceFactory } from '@atlaskit/util-data-test/mock-non-uploading-emoji-resource-factory';
import { VirtualList } from '../../../../components/picker/VirtualList';
import EmojiRepository from '../../../../api/EmojiRepository';
import Emoji, {
  type Props as EmojiProps,
} from '../../../../components/common/Emoji';
import EmojiRadioButton from '../../../../components/common/EmojiRadioButton';
import { messages } from '../../../../components/i18n';
import { CategoryDescriptionMap } from '../../../../components/picker/categories';
import CategorySelector, {
  sortCategories,
} from '../../../../components/picker/CategorySelector';
import ToneSelector, {
  toneSelectorTestId,
} from '../../../../components/common/ToneSelector';
import EmojiPicker, {
  Props as EmojiPickerProps,
} from '../../../../components/picker/EmojiPicker';
import EmojiPickerFooter from '../../../../components/picker/EmojiPickerFooter';
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
import type {
  EmojiDescription,
  OptionalEmojiDescription,
} from '../../../../types';
import {
  getEmojiResourcePromise,
  mediaEmoji,
  standardEmojis,
  standardServiceEmojis,
} from '../../_test-data';
import * as helper from './_emoji-picker-test-helpers';
import * as helperTestingLibrary from './_emoji-picker-helpers-testing-library';
import {
  categoryClickedEvent,
  closedPickerEvent,
  recordSucceeded,
  openedPickerEvent,
  pickerClickedEvent,
  pickerSearchedEvent,
  toneSelectorOpenedEvent,
  toneSelectedEvent,
  toneSelectorClosedEvent,
  recordFailed,
} from '../../../../util/analytics';
import EmojiActions, {
  emojiActionsTestId,
} from '../../../../components/common/EmojiActions';
import { ufoExperiences } from '../../../../util/analytics';
import EmojiPickerComponent from '../../../../components/picker/EmojiPickerComponent';
import { emojiPickerHeightOffset } from '../../../../components/picker/utils';
import * as constants from '../../../../util/constants';
import fetchMock from 'fetch-mock/cjs/client';
import type { ServiceConfig } from '@atlaskit/util-service-support';
import {
  EmojiResource,
  EmojiResourceConfig,
} from '../../../../api/EmojiResource';
import EmojiPickerVirtualList from '../../../../components/picker/EmojiPickerList';
import TonePreviewButton from '../../../../components/common/TonePreviewButton';

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
  beforeEach(() => {
    onEvent = jest.fn();
    ufoPickerStartSpy.mockClear();
    ufoPickerSuccessSpy.mockClear();
    ufoPickerFailureSpy.mockClear();
    ufoPickerAbortSpy.mockClear();
    ufoPickerMarkFMPSpy.mockClear();
    ufoSearchedStartSpy.mockClear();
    ufoSearchedFailureSpy.mockClear();
    ufoSearchedAbortSpy.mockClear();
    ufoSearchedSuccessSpy.mockClear();
    ufoEmojiRecordedStartSpy.mockClear();
    ufoEmojiRecordedSuccessSpy.mockClear();
    ufoEmojiRecordedFailureSpy.mockClear();

    // scrolling of the virutal list doesn't work out of the box for the tests
    // mocking `scrollToRow` for all tests
    jest
      .spyOn(EmojiPickerVirtualList.prototype, 'scrollToRow')
      .mockImplementation((index?: number) =>
        helperTestingLibrary.scrollToIndex(index || 0),
      );
  });

  beforeAll(() => {
    // set search debounce to 0
    Object.defineProperty(constants, 'EMOJI_SEARCH_DEBOUNCE', { value: 0 });
  });

  const renderEmojiPicker = (pickerProps: Partial<EmojiPickerProps> = {}) => {
    return renderWithIntl(
      <AnalyticsListener channel="fabric-elements" onEvent={onEvent}>
        <EmojiPicker
          emojiProvider={getEmojiResourcePromise()}
          {...pickerProps}
        />
      </AnalyticsListener>,
    );
  };

  const getUpdatedList = (component: any) =>
    component.update().find(VirtualList);

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
      const component = await helper.setupPicker();
      const list = getUpdatedList(component);
      await waitUntil(() => helper.emojisVisible(component, list));
      const emojis = helper.findEmoji(list);
      const emojiProp = emojis.at(0).prop('emoji');
      // First emoji displayed
      expect(emojiProp.id).toEqual(helper.allEmojis[0].id);
      const lastEmojiProp = emojis.at(emojis.length - 1).prop('emoji');
      // Last displayed emoji in same order as source data
      expect(lastEmojiProp.id).toEqual(helper.allEmojis[emojis.length - 1].id);
    });

    it('should display all categories', async () => {
      const component = await helper.setupPicker();
      let expectedCategories = defaultCategories;
      const provider = await getEmojiResourcePromise();

      // the provider is expected to implement calculateDynamicCategories for this test
      expect(provider.calculateDynamicCategories).toBeDefined();
      const dynamicCategories = await provider.calculateDynamicCategories();
      expectedCategories = expectedCategories.concat(dynamicCategories);

      const categorySelector = component.find(CategorySelector);
      const buttons = categorySelector.find('button');
      expect(buttons).toHaveLength(expectedCategories.length);
      act(() => {
        expectedCategories.sort(sortCategories);
      });

      for (let i = 0; i < buttons.length; i++) {
        const button = buttons.at(i);
        const messageKey = CategoryDescriptionMap[expectedCategories[i]].name;
        expect(isMessagesKey(messageKey)).toBeTruthy();
        if (isMessagesKey(messageKey)) {
          expect(button.prop('aria-label')).toEqual(
            messages[messageKey].defaultMessage,
          );
        }
      }
    });

    it('should hightlight first category (no frequent category)', async () => {
      const component = await helper.setupPicker();
      const buttons = component.find(CategorySelector).find('button');

      expect(buttons.at(0).prop('aria-label')).toEqual(
        messages['peopleCategory'].defaultMessage,
      );
      expect(buttons.at(0)).toHaveStyleRule(
        'color',
        token('color.text.selected', B300),
      );
    });

    it('should tone selector in preview by default', async () => {
      renderEmojiPicker();

      const toneSelectorButton = await screen.findByLabelText(
        'Choose your skin tone',
        { exact: false },
      );
      const toneSelector = await screen.getByTestId(toneSelectorTestId);

      expect(toneSelectorButton).toBeVisible();
      expect(toneSelector).not.toBeVisible();
    });

    it('should adjust picker height if preview is shown', async () => {
      renderEmojiPicker();

      const component = await helper.setupPickerWithoutToneSelector();
      const list = getUpdatedList(component);

      // Preview should not be displayed
      const picker = component.find(EmojiPickerComponent);
      expect(picker).toHaveStyleRule(
        'height',
        emojiPickerHeight +
          emojiPickerHeightOffset(defaultEmojiPickerSize) +
          'px',
      );

      await waitUntil(() => helper.emojisVisible(component, list));
      const hoverButton = list.find(Emoji).at(0);

      act(() => {
        const btn = hoverButton.find({ role: 'button' }).last();
        btn.simulate('mouseenter');
      });
      await waitUntil(() => helper.findEmojiPreview(component));

      // Preview should be displayed and the height of the picker adjusted
      const pickerWithPreview = component.find(EmojiPickerComponent);
      expect(pickerWithPreview).toHaveStyleRule(
        'height',
        emojiPickerHeightWithPreview +
          emojiPickerHeightOffset(defaultEmojiPickerSize) +
          'px',
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
      helperTestingLibrary.renderPicker(undefined, mockConfig);

      await waitFor(() => {
        expect(helperTestingLibrary.getVirtualList()).toBeInTheDocument();
      });

      await waitFor(() => {
        helperTestingLibrary.selectCategory(customCategory);
      });

      await waitFor(() => {
        expect(
          helperTestingLibrary.getEmojiPlaceholder(mediaEmoji.shortName),
        ).toBeInTheDocument();
      });
    });
  });

  describe('hover', () => {
    it('should update preview on hover', async () => {
      const component = await helper.setupPickerWithoutToneSelector();
      const list = getUpdatedList(component);

      await waitUntil(() => helper.emojisVisible(component, list));
      const hoverButton = list.find(Emoji).at(0);

      act(() => {
        const btn = hoverButton.find({ role: 'button' }).last();
        btn.simulate('mouseenter');
      });
      await waitUntil(() => helper.findEmojiPreview(component));

      const footer = component.find(EmojiPickerFooter);
      const previewEmoji = footer.find(Emoji);
      expect(previewEmoji).toHaveLength(1);
      const emojiProps = previewEmoji.prop('emoji');
      expect(emojiProps.id).toEqual(helper.allEmojis[0].id);
    });
  });

  describe('category', () => {
    it('selecting category should show that category', async () => {
      helperTestingLibrary.renderPicker(undefined, undefined, onEvent);

      await waitFor(() => {
        expect(helperTestingLibrary.getVirtualList()).toBeInTheDocument();
      });

      expect(
        helperTestingLibrary.queryEmojiCategoryHeader(emojiListHeaders.FLAGS),
      ).not.toBeInTheDocument();

      helperTestingLibrary.selectCategory(emojiCategoryIds.FLAGS);

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
      helperTestingLibrary.renderPicker();

      await waitFor(() => {
        expect(helperTestingLibrary.getVirtualList()).toBeInTheDocument();
      });

      expect(
        helperTestingLibrary.queryEmojiCategoryHeader(
          emojiListHeaders.ALL_UPLOADS,
        ),
      ).not.toBeInTheDocument();

      helperTestingLibrary.selectCategory(customCategory);

      await waitFor(() => {
        expect(
          helperTestingLibrary.queryEmojiCategoryHeader(
            emojiListHeaders.ALL_UPLOADS,
          ),
        ).toBeInTheDocument();
      });
    });

    it('does not add non-standard categories to the selector if there are no emojis in those categories', async () => {
      helperTestingLibrary.renderPicker({
        emojiProvider: mockNonUploadingEmojiResourceFactory(
          new EmojiRepository(standardEmojis),
        ),
      });

      await waitFor(() => {
        expect(helperTestingLibrary.getVirtualList()).toBeInTheDocument();
      });

      const buttons = within(
        helperTestingLibrary.getCategorySelector(),
      ).getAllByRole('tab');
      expect(buttons).toHaveLength(defaultCategories.length);

      const lastRowIndex = Math.round(standardEmojis.length / 8);
      await waitFor(() => {
        helperTestingLibrary.scrollToIndex(lastRowIndex);
      });

      expect(
        helperTestingLibrary.queryCategorySelector(customCategory),
      ).not.toBeInTheDocument();
      expect(
        helperTestingLibrary.queryCategorySelector(emojiCategoryIds.ATLASSIAN),
      ).not.toBeInTheDocument();

      expect(
        helperTestingLibrary.queryEmojiCategoryHeader(
          emojiListHeaders.ALL_UPLOADS,
        ),
      ).not.toBeInTheDocument();
      expect(
        helperTestingLibrary.queryEmojiCategoryHeader(
          emojiListHeaders.ATLASSIAN,
        ),
      ).not.toBeInTheDocument();
    });

    it('should display and highlight frequent category when there are frequently used emoji', async () => {
      const frequent: EmojiDescription = {
        ...standardEmojis[0],
        category: frequentCategory,
      };
      const emojiWithFrequent: EmojiDescription[] = [
        ...standardEmojis,
        frequent,
      ];
      const component = await helper.setupPicker({
        emojiProvider: mockNonUploadingEmojiResourceFactory(
          new EmojiRepository(emojiWithFrequent),
        ),
      });
      const categorySelector = component.find(CategorySelector);
      const buttons = categorySelector.find('button');
      expect(buttons).toHaveLength(defaultCategories.length + 1);
      expect(helper.categoryVisible(frequentCategory, component)).toBe(true);
      expect(buttons.at(0)).toHaveStyleRule(
        'color',
        token('color.text.selected', B300),
      );
    });

    it('should show frequent emoji first', async () => {
      const frequent: EmojiDescription[] = [];
      for (let i = 0; i < 8; i++) {
        const emoji = {
          ...standardEmojis[i],
          category: frequentCategory,
        };

        frequent.push(emoji);
      }

      const emojiWithFrequent: EmojiDescription[] = [
        ...standardEmojis,
        ...frequent,
      ];

      const component = await helper.setupPicker({
        emojiProvider: mockNonUploadingEmojiResourceFactory(
          new EmojiRepository(emojiWithFrequent),
        ),
      });
      const list = getUpdatedList(component);
      await waitUntil(() => helper.emojisVisible(component, list));
      // get Emoji with a particular property
      const displayedEmoji = list.find(Emoji);

      displayedEmoji.forEach(
        (node: ReactWrapper<EmojiProps>, index: number) => {
          const props = node.props();
          if (index < 8) {
            expect(props.emoji.category).toEqual(frequentCategory);
          } else {
            expect(props.emoji.category).not.toEqual(frequentCategory);
          }
        },
      );
    });

    it('adds non-standard categories to the selector dynamically based on whether they are populated with emojis', async () => {
      helperTestingLibrary.renderPicker();

      await waitFor(() => {
        expect(helperTestingLibrary.getVirtualList()).toBeInTheDocument();
      });

      const buttons = within(
        helperTestingLibrary.getCategorySelector(),
      ).getAllByRole('tab');
      expect(buttons).toHaveLength(defaultCategories.length + 2);

      await waitFor(() => {
        helperTestingLibrary.selectCategory(customCategory);
      });

      await waitFor(() => {
        expect(
          helperTestingLibrary.getEmojiCategoryHeader(
            emojiListHeaders.ATLASSIAN,
          ),
        ).toBeInTheDocument();
      });
    });
  });

  describe('selection', () => {
    it('selecting emoji should trigger onSelection', async () => {
      let selection: OptionalEmojiDescription;
      const clickOffset = 10;
      const component = await helper.setupPicker(
        {
          onSelection: (_emojiId, emoji) => {
            selection = emoji;
          },
        } as EmojiPickerProps,
        undefined,
        onEvent,
      );

      const list = getUpdatedList(component);
      const hoverButton = () => list.find(Emoji).at(clickOffset);
      await waitUntil(() => hoverButton().exists());
      act(() => {
        const btn = hoverButton().find({ role: 'button' }).last();
        btn.simulate('mousedown', helper.leftClick);
      });

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
          payload: recordSucceeded('picker'),
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
      const component = await helper.setupPicker(
        {
          onSelection: (_emojiId, emoji) => {
            selection = emoji;
          },
          emojiProvider,
        } as EmojiPickerProps,
        undefined,
        onEvent,
      );
      const list = getUpdatedList(component);

      const provider = await emojiProvider;
      provider.recordSelection = jest.fn().mockImplementation(() => {
        failureOccurred = true;
        return Promise.reject({ code: 403, reason: 'Forbidden' });
      });

      const hoverButton = () => list.find(Emoji).at(clickOffset);
      await waitUntil(() => hoverButton().exists());
      act(() => {
        const btn = hoverButton().find({ role: 'button' }).last();
        btn.simulate('mousedown', helper.leftClick);
      });

      await waitUntil(() => failureOccurred);
      await waitUntil(() => !!selection);

      expect(selection).toBeDefined();
      expect(selection!.id).toEqual(helper.allEmojis[clickOffset].id);
      expect(onEvent).toHaveBeenLastCalledWith(
        expect.objectContaining({
          payload: recordFailed('picker'),
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
      const component = await helper.setupPicker({
        onSelection: (_emojiId, emoji) => {
          selection = emoji;
        },
        emojiProvider: emojiResourcePromise,
      } as EmojiPickerProps);
      const list = getUpdatedList(component);
      const hoverButton = () => list.find(Emoji).at(clickOffset);
      await waitUntil(() => hoverButton().exists());
      act(() => {
        const btn = hoverButton().find({ role: 'button' }).last();
        btn.simulate('mousedown', helper.leftClick);
      });

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
      helperTestingLibrary.renderPicker();

      await waitFor(() => {
        expect(helperTestingLibrary.getVirtualList()).toBeInTheDocument();
        expect(helperTestingLibrary.getEmojiSearchInput()).toBeInTheDocument();
      });

      helperTestingLibrary.searchEmoji('al');

      await waitFor(() => {
        expect(
          screen.queryByTestId('sprite-emoji-:flag_al:'),
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId('sprite-emoji-:flag_dz:'),
        ).toBeInTheDocument();

        const emojis = within(
          helperTestingLibrary.getVirtualList(),
        ).getAllByRole('button');

        expect(emojis.length).toEqual(2);
      });
    });

    it('searching for red car should match emoji via shortName', async () => {
      helperTestingLibrary.renderPicker();

      await waitFor(() => {
        expect(helperTestingLibrary.getVirtualList()).toBeInTheDocument();
        expect(helperTestingLibrary.getEmojiSearchInput()).toBeInTheDocument();
      });

      helperTestingLibrary.searchEmoji('red car');

      await waitFor(() => {
        expect(
          screen.queryByTestId('sprite-emoji-:red_car:'),
        ).toBeInTheDocument();

        expect(screen.getByLabelText(':red_car:')).toBeInTheDocument();

        const emojis = within(
          helperTestingLibrary.getVirtualList(),
        ).getAllByRole('button');

        expect(emojis.length).toEqual(1);
      });
    });

    it('searching should disable categories in selector', async () => {
      helperTestingLibrary.renderPicker();

      await waitFor(() => {
        expect(helperTestingLibrary.getVirtualList()).toBeInTheDocument();
        expect(helperTestingLibrary.getEmojiSearchInput()).toBeInTheDocument();
      });

      helperTestingLibrary.searchEmoji('al');

      await waitFor(() => {
        const emojis = within(
          helperTestingLibrary.getVirtualList(),
        ).getAllByRole('button');

        expect(emojis.length).toEqual(2);

        expect(
          helperTestingLibrary.queryCategorySelector(emojiCategoryIds.FLAGS),
        ).toHaveAttribute('disabled');
      });
    });

    it('clear searching should show un-filtered emojis', async () => {
      let initialEmojisCount = 0;

      helperTestingLibrary.renderPicker();
      await waitFor(() => {
        expect(helperTestingLibrary.getVirtualList()).toBeInTheDocument();
        expect(helperTestingLibrary.getEmojiSearchInput()).toBeInTheDocument();
        const emojis = within(
          helperTestingLibrary.getVirtualList(),
        ).getAllByRole('button');
        initialEmojisCount = emojis.length;
      });

      // search an un-existed emoji
      helperTestingLibrary.searchEmoji('empty');
      await waitFor(() => {
        const emojis = within(
          helperTestingLibrary.getVirtualList(),
        ).queryAllByRole('button');
        expect(emojis.length).toEqual(0);
        expect(
          helperTestingLibrary.queryCategorySelector(emojiCategoryIds.FLAGS),
        ).toHaveAttribute('disabled');
      });

      // clear out emoji search
      helperTestingLibrary.searchEmoji('');
      await waitFor(() => {
        const emojis = within(
          helperTestingLibrary.getVirtualList(),
        ).getAllByRole('button');

        expect(emojis.length).toEqual(initialEmojisCount);
        expect(
          helperTestingLibrary.queryCategorySelector(emojiCategoryIds.FLAGS),
        ).not.toHaveAttribute('disabled');
      });
    });

    it('searching should fire analytics', async () => {
      helperTestingLibrary.renderPicker(undefined, undefined, onEvent);

      await waitFor(() => {
        expect(helperTestingLibrary.getVirtualList()).toBeInTheDocument();
        expect(helperTestingLibrary.getEmojiSearchInput()).toBeInTheDocument();
      });

      helperTestingLibrary.searchEmoji('al');

      await waitFor(() => {
        const emojis = within(
          helperTestingLibrary.getVirtualList(),
        ).getAllByRole('button');

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
      // arrange emoji provider
      fetchMock.mock({
        matcher: `begin:${provider1.url}`,
        response: standardServiceEmojis,
      });
      const resource = new EmojiResource(defaultApiConfig);
      const emojiProvider = resource.getEmojiProvider();

      helperTestingLibrary.renderPicker({
        emojiProvider,
        hideToneSelector: true,
      });

      // search emoji
      await waitFor(() => {
        expect(helperTestingLibrary.getEmojiSearchInput()).toBeInTheDocument();
      });
      helperTestingLibrary.searchEmoji('grinning');
      await waitFor(() => {
        expect(
          screen.queryByTestId('sprite-emoji-:grinning:'),
        ).toBeInTheDocument();
      });

      expect(ufoSearchedStartSpy).toBeCalled();
      expect(ufoSearchedSuccessSpy).toBeCalled();
      expect(ufoSearchedAbortSpy).not.toBeCalled();
      expect(ufoSearchedFailureSpy).not.toBeCalled();
    });
  });

  describe('skin tone selection', () => {
    it('should display the tone emoji by default', async () => {
      const component = await helper.setupPicker();
      const list = getUpdatedList(component);

      await waitUntil(() => helper.emojisVisible(component, list));
      const hoverButton = list.find(Emoji).at(0);
      act(() => {
        const btn = hoverButton.find({ role: 'button' }).last();
        btn.simulate('mouseenter');
      });

      const emojiActions = component.find(EmojiActions);
      const toneEmoji = emojiActions.find(TonePreviewButton);
      expect(toneEmoji).toHaveLength(1);
    });

    it('should display emojis without skin tone variations by default', async () => {
      const component = await helper.setupPicker();
      const list = getUpdatedList(component);

      await waitUntil(() => helper.emojisVisible(component, list));
      const emojis = helper.findEmoji(list);
      const hoverOffset = helper.findHandEmoji(emojis);
      expect(hoverOffset).not.toEqual(-1);
      const handEmoji = helper.findEmoji(list).at(hoverOffset).prop('emoji');
      expect(handEmoji.shortName).toEqual(':raised_hand:');
    });

    it('should fire tone selected and not cancelled', async () => {
      const onEvent = jest.fn();
      const component = await helper.setupPicker(undefined, undefined, onEvent);

      const list = getUpdatedList(component);

      await waitUntil(() => helper.emojisVisible(component, list));
      const hoverButton = list.find(Emoji).at(0);
      act(() => {
        const btn = hoverButton.find({ role: 'button' }).last();
        btn.simulate('mouseenter');
      });

      const preview = component.find(EmojiActions);
      const toneEmoji = preview.find(TonePreviewButton);
      const toneSelectorOpener = toneEmoji.prop('onSelected');
      expect(toneSelectorOpener).toBeDefined();
      act(() => {
        toneSelectorOpener!();
      });
      const toneSelectorOpenerSelectedTone = toneEmoji.prop('emoji').shortName;
      expect(toneSelectorOpenerSelectedTone).toBe(':raised_hand:');

      await waitUntil(
        () => component.update() && component.find(ToneSelector).length > 0,
      );

      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: toneSelectorOpenedEvent({}),
        }),
        'fabric-elements',
      );

      const toneSelector = component.find(ToneSelector);
      const toneButton = toneSelector
        .find(EmojiRadioButton)
        .at(0)
        .prop('onSelected');
      expect(toneButton).toBeDefined();
      act(() => {
        toneButton!();
      });

      expect(onEvent).toHaveBeenLastCalledWith(
        expect.objectContaining({
          payload: toneSelectedEvent({ skinToneModifier: 'light' }),
        }),
        'fabric-elements',
      );
    });

    it('should fire selector cancelled when no tone selected', async () => {
      const onEvent = jest.fn();
      const component = await helper.setupPicker(undefined, undefined, onEvent);

      const list = getUpdatedList(component);

      await waitUntil(() => helper.emojisVisible(component, list));
      const hoverButton = list.find(Emoji).at(0);
      act(() => {
        const btn = hoverButton.find({ role: 'button' }).last();
        btn.simulate('mouseenter');
      });

      const preview = component.find(EmojiActions);
      const toneEmoji = preview.find(TonePreviewButton);
      const toneSelectorOpener = toneEmoji.prop('onSelected');
      expect(toneSelectorOpener).toBeDefined();

      toneSelectorOpener!();

      await waitUntil(
        () => component.update() && component.find(ToneSelector).length > 0,
      );

      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: toneSelectorOpenedEvent({}),
        }),
        'fabric-elements',
      );
      act(() => {
        const wrapper = preview
          .find({ 'data-testid': emojiActionsTestId })
          .last();
        wrapper.simulate('mouseleave');
      });
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

      const component = await helper.setupPicker({ emojiProvider });
      const list = getUpdatedList(component);
      await waitUntil(() => helper.emojisVisible(component, list));
      const emojis = helper.findEmoji(list);
      const hoverOffset = helper.findHandEmoji(emojis);
      expect(hoverOffset).not.toEqual(-1);
      const handEmoji = helper.findEmoji(list).at(hoverOffset).prop('emoji');
      expect(handEmoji.shortName).toEqual(':raised_hand::skin-tone-2:');
    });
  });

  describe('with localStorage available', () => {
    it('should use localStorage to remember tone selection between sessions', async () => {
      const findToneEmojiInNewPicker = async () => {
        const component = await helper.setupPicker();
        const list = getUpdatedList(component);
        await waitUntil(() => helper.emojisVisible(component, list));
        const emojis = helper.findEmoji(list);
        const hoverOffset = helper.findHandEmoji(emojis);
        expect(hoverOffset).not.toEqual(-1);
        return helper.findEmoji(list).at(hoverOffset).prop('emoji');
      };

      const tone = '2';
      const provider = await getEmojiResourcePromise();
      provider.setSelectedTone(parseInt(tone, 10));

      expect(localStorage.setItem).toHaveBeenCalledWith(
        selectedToneStorageKey,
        tone,
      );

      // First picker should have tone set by default
      const handEmoji1 = await findToneEmojiInNewPicker();
      expect(handEmoji1.shortName).toEqual(':raised_hand::skin-tone-3:');

      // Second picker should have tone set by default
      const handEmoji2 = await findToneEmojiInNewPicker();
      expect(handEmoji2.shortName).toEqual(':raised_hand::skin-tone-3:');
    });
  });

  describe('with picker opened experiences', () => {
    it('should track picker opened UFO experience when picker rendered and unmounted', async () => {
      const component = await helper.setupPicker();
      component.unmount();
      expect(ufoPickerStartSpy).toBeCalled();
      expect(ufoPickerMarkFMPSpy).toBeCalled();
      expect(ufoPickerSuccessSpy).toBeCalled();
      expect(ufoPickerAbortSpy).toBeCalled();
    });

    it('should fail picker opened UFO experience when picker throw errors', async () => {
      const component = await helper.setupPicker();

      act(() => {
        component.find(EmojiPickerComponent).simulateError(new Error('test'));
      });

      expect(ufoPickerStartSpy).toBeCalled();
      expect(ufoPickerSuccessSpy).toBeCalled();
      expect(ufoPickerFailureSpy).toBeCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = helperTestingLibrary.renderPicker();

      await waitFor(() => {
        expect(helperTestingLibrary.getVirtualList()).toBeInTheDocument();
      });

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
