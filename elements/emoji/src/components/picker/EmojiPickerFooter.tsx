import classNames from 'classnames';
import React from 'react';
import { PureComponent } from 'react';
import {
  EmojiDescription,
  EmojiDescriptionWithVariations,
  Message,
  OnToneSelected,
  OnToneSelectorCancelled,
  ToneSelection,
} from '../../types';
import EmojiDeletePreview, {
  OnDeleteEmoji,
} from '../common/EmojiDeletePreview';
import EmojiPreview from '../common/EmojiPreview';
import EmojiUploadPicker, { OnUploadEmoji } from '../common/EmojiUploadPicker';
import * as styles from './styles';

export interface Props {
  selectedEmoji?: EmojiDescription;
  selectedTone?: ToneSelection;
  onToneSelected?: OnToneSelected;
  onToneSelectorCancelled?: OnToneSelectorCancelled;
  toneEmoji?: EmojiDescriptionWithVariations;
  uploading: boolean;
  uploadEnabled: boolean;
  emojiToDelete?: EmojiDescription;
  initialUploadName?: string;
  uploadErrorMessage?: Message;
  onUploadCancelled: () => void;
  onUploadEmoji: OnUploadEmoji;
  onCloseDelete: () => void;
  onDeleteEmoji: OnDeleteEmoji;
  onFileChooserClicked?: () => void;
  onOpenUpload: () => void;
}

export default class EmojiPickerFooter extends PureComponent<Props, {}> {
  render() {
    const {
      initialUploadName,
      onToneSelected,
      onToneSelectorCancelled,
      onUploadCancelled,
      onUploadEmoji,
      onCloseDelete,
      onDeleteEmoji,
      selectedEmoji,
      selectedTone,
      toneEmoji,
      uploadErrorMessage,
      uploading,
      onFileChooserClicked,
      onOpenUpload,
      uploadEnabled,
      emojiToDelete,
    } = this.props;

    const previewFooterClassnames = classNames([
      styles.emojiPickerFooter,
      styles.emojiPickerFooterWithTopShadow,
    ]);

    if (uploading) {
      return (
        <div className={previewFooterClassnames}>
          <EmojiUploadPicker
            onUploadCancelled={onUploadCancelled}
            onUploadEmoji={onUploadEmoji}
            onFileChooserClicked={onFileChooserClicked}
            errorMessage={uploadErrorMessage}
            initialUploadName={initialUploadName}
          />
        </div>
      );
    }

    if (emojiToDelete) {
      return (
        <div className={previewFooterClassnames}>
          <EmojiDeletePreview
            emoji={emojiToDelete}
            onDeleteEmoji={onDeleteEmoji}
            onCloseDelete={onCloseDelete}
          />
        </div>
      );
    }

    return (
      <div className={previewFooterClassnames}>
        <EmojiPreview
          emoji={selectedEmoji}
          toneEmoji={toneEmoji}
          selectedTone={selectedTone}
          onToneSelected={onToneSelected}
          onToneSelectorCancelled={onToneSelectorCancelled}
          onOpenUpload={onOpenUpload}
          uploadEnabled={uploadEnabled}
        />
      </div>
    );
  }
}
