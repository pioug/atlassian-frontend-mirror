import React from 'react';
import { fireEvent, screen, within } from '@testing-library/react';
import {
  type WithAnalyticsEventsProps,
  AnalyticsListener,
} from '@atlaskit/analytics-next';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import type { MockEmojiResourceConfig } from '@atlaskit/util-data-test/emoji-types';
import EmojiPicker, { Props } from '../../../../components/picker/EmojiPicker';
import { getEmojiResourcePromise } from '../../_test-data';
import { renderWithIntl } from '../../_testing-library';
import userEvent from '@testing-library/user-event';
import {
  emojiActionsTestId,
  uploadEmojiTestId,
} from '../../../../components/common/EmojiActions';
import { uploadEmojiNameInputTestId } from '../../../../components/common/EmojiUploadPicker';
import {
  chooseFileButtonTestId,
  fileUploadInputTestId,
} from '../../../../components/common/FileChooser';
import {
  cancelUploadButtonTestId,
  uploadPreviewTestId,
} from '../../../../components/common/EmojiUploadPreview';
import {
  retryUploadButtonTestId,
  uploadEmojiButtonTestId,
} from '../../../../components/common/RetryableButton';
import { virtualListScrollContainerTestId } from '../../../../components/picker/VirtualList';
import { emojiPickerFooterTestId } from '../../../../components/picker/EmojiPickerFooter';
import {
  emojiErrorIconTestId,
  emojiErrorMessageTestId,
  emojiErrorMessageTooltipTestId,
} from '../../../../components/common/EmojiErrorMessage';
import { emojiPickerSearchTestId } from '../../../../components/picker/EmojiPickerListSearch';
import {
  categorySelectorCategoryTestId,
  categorySelectorComponentTestId,
} from '../../../../components/picker/CategorySelector';
import { emojiPlaceholderTestId } from '../../../../components/common/EmojiPlaceholder';

export function renderPicker(
  props?: Props & WithAnalyticsEventsProps,
  config?: MockEmojiResourceConfig,
  onEvent?: any,
) {
  const pickerProps: Props = {
    ...props,
  } as Props;

  if (!props || !props.emojiProvider) {
    pickerProps.emojiProvider = getEmojiResourcePromise(config);
  }

  const picker = onEvent
    ? renderWithIntl(
        <AnalyticsListener channel="fabric-elements" onEvent={onEvent}>
          <EmojiPicker {...pickerProps} />
        </AnalyticsListener>,
      )
    : renderWithIntl(<EmojiPicker {...pickerProps} />);
  return picker;
}

export function getEmojiActionsSection() {
  return screen.getByTestId(emojiActionsTestId);
}

export function queryEmojiActonsSection() {
  return screen.queryByTestId(emojiActionsTestId);
}

export function getAddCustomEmojiButton() {
  return within(screen.getByTestId(uploadEmojiTestId)).getByRole('button');
}

export function queryAddCustomEmojiButton() {
  return screen.queryByTestId(uploadEmojiTestId);
}

export function getUploadEmojiNameInput() {
  return screen.getByTestId(uploadEmojiNameInputTestId);
}

export function typeEmojiName(value: string) {
  fireEvent.change(getUploadEmojiNameInput(), { target: { value } });
}

export async function chooseFile(file: any) {
  const chooseFileButton = screen.getByTestId(chooseFileButtonTestId);
  fireEvent.click(chooseFileButton);
  const fileUploadInput = screen.getByTestId(fileUploadInputTestId);
  await userEvent.upload(fileUploadInput, file);
}

export function getUploadPreview() {
  return screen.getByTestId(uploadPreviewTestId);
}

export function getUploadEmojiButton() {
  return screen.getByTestId(uploadEmojiButtonTestId);
}

export function uploadNewEmoji() {
  fireEvent.click(getUploadEmojiButton());
}

export function cancelUpload() {
  const cancelUploadButton = screen.getByTestId(cancelUploadButtonTestId);
  fireEvent.click(cancelUploadButton);
}

export function retryUpload() {
  const retryUploadButton = screen.getByTestId(retryUploadButtonTestId);
  fireEvent.click(retryUploadButton);
}

export function getVirtualList() {
  return screen.getByTestId(virtualListScrollContainerTestId);
}

export function scrollToIndex(index: number) {
  fireEvent.scroll(getVirtualList(), { target: { scrollTop: 40 * index } });
}

export function getEmojiPickerFooter() {
  return screen.getByTestId(emojiPickerFooterTestId);
}

export function queryUploadPreview() {
  return screen.queryByTestId(uploadPreviewTestId);
}

export function getEmojiErrorMessage() {
  return screen.getByTestId(emojiErrorMessageTestId);
}

export function getEmojiSearchInput() {
  return screen.getByTestId(emojiPickerSearchTestId);
}

export function searchEmoji(name: string) {
  const searchInput = getEmojiSearchInput();
  fireEvent.focus(searchInput);
  fireEvent.change(searchInput, {
    target: {
      value: name,
    },
  });
}

export function getEmojiErrorMessageTooltip() {
  return screen.getByTestId(emojiErrorMessageTooltipTestId);
}

export function getEmojiErrorIcon() {
  return screen.getByTestId(emojiErrorIconTestId);
}

export function getEmojiCategoryHeader(title: string) {
  return screen.getByText(title);
}

export function queryEmojiCategoryHeader(title: string) {
  return within(getVirtualList()).queryByText(title);
}

export function selectCategory(categoryId: string) {
  const categoryButton = screen.getByTestId(
    categorySelectorCategoryTestId(categoryId),
  );
  fireEvent.click(categoryButton);
}

export function queryCategorySelector(categoryId: string) {
  return screen.queryByTestId(categorySelectorCategoryTestId(categoryId));
}

export function getCategorySelector() {
  return screen.getByTestId(categorySelectorComponentTestId);
}

export function getEmojiPlaceholder(shortName: string) {
  return within(getVirtualList()).getByTestId(
    emojiPlaceholderTestId(shortName),
  );
}
