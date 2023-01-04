/** @jsx jsx */
import { Fragment, useState, FC } from 'react';
import { jsx } from '@emotion/react';
import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps,
} from 'react-intl-next';
import {
  EmojiDescription,
  EmojiDescriptionWithVariations,
  Message,
  OnToneSelected,
  OnToneSelectorCancelled,
  ToneSelection,
  ToneValueType,
} from '../../types';
import EmojiDeletePreview, {
  OnDeleteEmoji,
} from '../common/EmojiDeletePreview';
import EmojiUploadPicker, { OnUploadEmoji } from '../common/EmojiUploadPicker';
import EmojiPickerListSearch from '../picker/EmojiPickerListSearch';
import ToneSelector from './ToneSelector';
import EmojiButton from './EmojiButton';
import { messages } from '../i18n';
import AkButton from '@atlaskit/button/standard-button';
import AddIcon from '@atlaskit/icon/glyph/add';
import { setSkinToneAriaLabelText } from './setSkinToneAriaLabelText';
import {
  addCustomEmoji,
  addCustomEmojiButton,
  emojiActionsWrapper,
  emojiPickerAddEmoji,
  emojiToneSelectorContainer,
} from './styles';
import {
  emojiActionsContainerWithBottomShadow,
  emojiPickerFooter,
} from '../picker/styles';

export interface Props {
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
  query?: string;
  onChange: any;
}

export const emojiActionsTestId = 'emoji-actions';
export const uploadEmojiTestId = 'upload-emoji';

// Generic Type for the wrapped functional component
type PropsWithWrappedComponentPropsType = Props & WrappedComponentProps;

type AddOwnEmojiProps = PropsWithWrappedComponentPropsType;
const AddOwnEmoji: FC<AddOwnEmojiProps> = (props) => {
  const {
    onOpenUpload,
    uploadEnabled,
    intl: { formatMessage },
  } = props;

  return (
    <Fragment>
      {uploadEnabled && (
        <div css={addCustomEmoji} data-testid={uploadEmojiTestId}>
          <FormattedMessage {...messages.addCustomEmojiLabel}>
            {(label) => (
              <AkButton
                onClick={onOpenUpload}
                iconBefore={
                  <AddIcon
                    label={formatMessage(messages.addCustomEmojiLabel)}
                    size="small"
                  />
                }
                appearance="subtle"
                css={addCustomEmojiButton}
                className={emojiPickerAddEmoji}
              >
                {label}
              </AkButton>
            )}
          </FormattedMessage>
        </div>
      )}
    </Fragment>
  );
};

type TonesWrapperProps = PropsWithWrappedComponentPropsType & {
  onToneOpen: () => void;
  onToneSelected: (toneValue: ToneValueType) => void;
  showToneSelector: boolean;
};
const TonesWrapper: FC<TonesWrapperProps> = (props) => {
  const {
    toneEmoji,
    selectedTone,
    intl,
    onToneSelected,
    onToneOpen,
    showToneSelector,
  } = props;
  const { formatMessage } = intl;
  if (!toneEmoji) {
    return null;
  }

  let previewEmoji = toneEmoji;
  if (selectedTone && previewEmoji.skinVariations) {
    previewEmoji = previewEmoji.skinVariations[(selectedTone || 1) - 1];
  }

  return (
    <div css={emojiToneSelectorContainer}>
      {showToneSelector && (
        <ToneSelector
          emoji={toneEmoji}
          onToneSelected={onToneSelected}
          previewEmojiId={previewEmoji.id}
        />
      )}
      <EmojiButton
        ariaExpanded={showToneSelector}
        emoji={previewEmoji}
        selectOnHover={true}
        onSelected={onToneOpen}
        ariaLabelText={formatMessage(
          messages.emojiSelectSkinToneButtonAriaLabelText,
          {
            selectedTone: `${setSkinToneAriaLabelText(
              previewEmoji.name as string,
            )} selected`,
          },
        )}
      />
    </div>
  );
};

type EmojiActionsProps = PropsWithWrappedComponentPropsType;
export const EmojiActions: FC<EmojiActionsProps> = (props) => {
  const {
    onToneSelected,
    onToneSelectorCancelled,
    initialUploadName,
    onUploadCancelled,
    onCloseDelete,
    onDeleteEmoji,
    onUploadEmoji,
    uploadErrorMessage,
    uploading,
    onFileChooserClicked,
    emojiToDelete,
    onChange,
    query,
  } = props;
  const [showToneSelector, setShowToneSelector] = useState(false);

  const previewFooterClassnames = [
    emojiPickerFooter,
    emojiActionsContainerWithBottomShadow,
  ];

  const onToneOpenHandler = () => setShowToneSelector(true);

  const onToneSelectedHandler = (toneValue: ToneValueType) => {
    setShowToneSelector(false);
    if (onToneSelected) {
      onToneSelected(toneValue);
    }
  };

  const onMouseLeaveHandler = () => {
    if (showToneSelector && onToneSelectorCancelled) {
      onToneSelectorCancelled();
    }
    setShowToneSelector(false);
  };

  if (uploading) {
    return (
      <div css={previewFooterClassnames}>
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
      <div css={previewFooterClassnames}>
        <EmojiDeletePreview
          emoji={emojiToDelete}
          onDeleteEmoji={onDeleteEmoji}
          onCloseDelete={onCloseDelete}
        />
      </div>
    );
  }

  return (
    <div
      data-testid={emojiActionsTestId}
      css={previewFooterClassnames}
      onMouseLeave={onMouseLeaveHandler}
    >
      <div css={emojiActionsWrapper}>
        {!showToneSelector && (
          <EmojiPickerListSearch onChange={onChange} query={query} />
        )}
        <TonesWrapper
          {...props}
          onToneOpen={onToneOpenHandler}
          onToneSelected={onToneSelectedHandler}
          showToneSelector={showToneSelector}
        />
      </div>
      <AddOwnEmoji {...props} />
    </div>
  );
};

export default injectIntl(EmojiActions);
