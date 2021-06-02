import AkButton from '@atlaskit/button/custom-theme-button';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { waitUntil } from '@atlaskit/elements-test-helpers';
import { ReactWrapper } from 'enzyme';
import React from 'react';
import Emoji from '../../../../components/common/Emoji';
import EmojiDeletePreview from '../../../../components/common/EmojiDeletePreview';
import EmojiErrorMessage from '../../../../components/common/EmojiErrorMessage';
import EmojiUploadPreview from '../../../../components/common/EmojiUploadPreview';
import * as commonStyles from '../../../../components/common/styles';
import { CategoryGroupKey } from '../../../../components/picker/categories';
import CategorySelector from '../../../../components/picker/CategorySelector';
import EmojiPicker, { Props } from '../../../../components/picker/EmojiPicker';
import EmojiPickerCategoryHeading from '../../../../components/picker/EmojiPickerCategoryHeading';
import EmojiPickerComponent from '../../../../components/picker/EmojiPickerComponent';
import EmojiPickerEmojiRow from '../../../../components/picker/EmojiPickerEmojiRow';
import EmojiPickerList from '../../../../components/picker/EmojiPickerList';
import EmojiPickerListSearch from '../../../../components/picker/EmojiPickerListSearch';
import { EmojiDescription } from '../../../../types';
import { hasSelector } from '../../_emoji-selectors';
import { getEmojiResourcePromise, newEmojiRepository } from '../../_test-data';
import { FormattedMessage } from 'react-intl';
import FileChooser from '../../../../components/common/FileChooser';
import {
  WithAnalyticsEventsProps,
  AnalyticsListener,
} from '@atlaskit/analytics-next';
import type { MockEmojiResourceConfig } from '@atlaskit/util-data-test/emoji-types';

export function setupPickerWithoutToneSelector(): Promise<
  ReactWrapper<any, any>
> {
  return setupPicker({
    emojiProvider: getEmojiResourcePromise(),
    hideToneSelector: true,
  });
}

export function setupPicker(
  props?: Props & WithAnalyticsEventsProps,
  config?: MockEmojiResourceConfig,
  onEvent?: any,
): Promise<ReactWrapper<any, any>> {
  const pickerProps: Props = {
    ...props,
  } as Props;

  if (!props || !props.emojiProvider) {
    pickerProps.emojiProvider = getEmojiResourcePromise(config);
  }

  const picker = onEvent
    ? mountWithIntl(
        <AnalyticsListener channel="fabric-elements" onEvent={onEvent}>
          <EmojiPicker {...pickerProps} />
        </AnalyticsListener>,
      )
    : mountWithIntl(<EmojiPicker {...pickerProps} />);

  return waitUntil(() => hasSelector(picker, EmojiPickerComponent)).then(
    () => picker,
  );
}

export const leftClick = {
  button: 0,
};

export const allEmojis = newEmojiRepository().all().emojis;

export const findEmoji = (list: ReactWrapper) => list.find(Emoji);
/**
 * @param picker mounted EmojiPicker component
 * @param list child EmojiPickerList
 */
export const emojisVisible = (
  picker: ReactWrapper,
  list: ReactWrapper<any, any, any>,
) => hasSelector(picker, Emoji, list);

const nodeIsCategory = (category: CategoryGroupKey, n: ReactWrapper<Props>) =>
  n.is(EmojiPickerCategoryHeading) && n.prop('id') === category;

export const findCategoryHeading = (
  category: CategoryGroupKey,
  component: ReactWrapper<Props>,
) =>
  component
    .find(EmojiPickerCategoryHeading)
    .filterWhere((n: ReactWrapper<any, any>) => nodeIsCategory(category, n));

const findAllVirtualRows = (component: ReactWrapper) =>
  component.update() &&
  component.findWhere(
    (n) =>
      n.is(EmojiPickerListSearch) ||
      n.is(EmojiPickerCategoryHeading) ||
      n.is(EmojiPickerEmojiRow),
    // ignore spinner
  );

export const emojiRowsVisibleInCategory = (
  category: CategoryGroupKey,
  component: ReactWrapper,
) => {
  component.update();
  const rows = findAllVirtualRows(component);
  let foundStart = false;
  let foundEnd = false;
  return rows.filterWhere((n) => {
    if (foundEnd) {
      return false;
    }

    if (foundStart) {
      if (!n.is(EmojiPickerEmojiRow)) {
        foundEnd = true;
        return false;
      }
      return true;
    }

    if (nodeIsCategory(category, n)) {
      foundStart = true;
    }

    return false;
  });
};

const getCategoryButton = (category: CategoryGroupKey, picker: ReactWrapper) =>
  picker
    .find(CategorySelector)
    .findWhere(
      (n) => n.name() === 'button' && n.prop('data-category-id') === category,
    );

export const categoryVisible = (
  category: CategoryGroupKey,
  component: ReactWrapper<any>,
) => findCategoryHeading(category, component).length > 0;

export const showCategory = (
  category: CategoryGroupKey,
  component: ReactWrapper,
  _categoryTitle?: string,
): Promise<any> => {
  const categoryButton = getCategoryButton(category, component);
  expect(categoryButton).toHaveLength(1);

  const list = component.find(EmojiPickerList);
  return waitUntil(() => emojisVisible(component, list)).then(() => {
    categoryButton.simulate('click', leftClick);
    return waitUntil(
      () =>
        component.update() &&
        categoryVisible(category, component.find(EmojiPickerList)),
    );
  });
};

export const findEmojiInCategory = (
  emojis: ReactWrapper<any>,
  categoryId: CategoryGroupKey,
): EmojiDescription | undefined => {
  const upperCategoryId = categoryId.toLocaleUpperCase();
  for (let i = 0; i < emojis.length; i++) {
    const emoji = emojis.at(i).prop('emoji');
    if (emoji.category === upperCategoryId) {
      return emoji;
    }
  }
  return undefined;
};

export const findHandEmoji = (emojis: ReactWrapper<any>): number => {
  let offset = -1;
  emojis.forEach((emoji, index) => {
    if (emoji.prop('emoji').shortName.indexOf(':raised_hand:') !== -1) {
      offset = index;
      return;
    }
  });
  return offset;
};

export const findSearchInput = (component: ReactWrapper) =>
  component.update() &&
  component
    .find(EmojiPickerListSearch)
    .findWhere((component) => component.name() === 'input');

export const searchInputVisible = (component: ReactWrapper) =>
  findSearchInput(component).length > 0;

export const findEmojiNameInput = (component: ReactWrapper) =>
  component.update() &&
  component.find(`.${commonStyles.uploadChooseFileEmojiName} input`);

export const emojiNameInputVisible = (component: ReactWrapper): boolean =>
  findEmojiNameInput(component).length > 0;

export const emojiNameInputHasAValue = (component: ReactWrapper): boolean =>
  emojiNameInputVisible(component) &&
  !!findEmojiNameInput(component).prop('value');

export const uploadAddRowSelector = `.${commonStyles.uploadAddRow}`;

export const findAddEmojiButton = (component: ReactWrapper) =>
  component.update() &&
  component.find(uploadAddRowSelector).find(AkButton).at(0);

export const addEmojiButtonVisible = (component: ReactWrapper) =>
  component.update() && findAddEmojiButton(component).length > 0;

export const findCancelLink = (component: ReactWrapper) =>
  component.update() &&
  component.find(uploadAddRowSelector).find(AkButton).at(1);

export const findUploadPreview = (component: ReactWrapper) =>
  component.update() && component.find(EmojiUploadPreview);

export const findEmojiWithId = (component: ReactWrapper, id: string) =>
  component.update() &&
  component
    .find(EmojiPickerList)
    .find(Emoji)
    .filterWhere((emoji) => emoji.prop('emoji').id === id);

export const emojiWithIdVisible = (component: ReactWrapper, id: string) =>
  findEmojiWithId(component, id).length > 0;

export const finishDelete = (component: ReactWrapper) =>
  component.update() && component.find(EmojiDeletePreview).length === 0;

export const errorMessageVisible = (component: ReactWrapper) =>
  component.update() && component.find(EmojiErrorMessage).length === 1;

export const tooltipErrorMessageMatches = async (
  component: ReactWrapper<any>,
  message: any,
) => {
  await waitUntil(
    () =>
      component.update() &&
      component.find(EmojiErrorMessage).find(FormattedMessage).length > 0,
  );
  expect(
    component.find(EmojiErrorMessage).find(FormattedMessage).props(),
  ).toMatchObject(message);
};

export const chooseFile = (component: ReactWrapper, file: any) => {
  const fileChooser = component.find(FileChooser);
  const fileOnClick = fileChooser.prop('onClick');
  if (fileOnClick) {
    fileOnClick();
  }
  const fileOnChange = fileChooser.prop('onChange');
  expect(fileOnChange).toBeDefined();
  fileOnChange!({
    target: {
      files: [file],
    },
  } as React.ChangeEvent<any>);
  return fileChooser;
};
