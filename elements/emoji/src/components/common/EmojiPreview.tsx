import AkButton from '@atlaskit/button/standard-button';
import AddIcon from '@atlaskit/icon/glyph/add';
import classNames from 'classnames';
import React from 'react';
import { PureComponent } from 'react';
import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps,
} from 'react-intl-next';
import CachingEmoji from '../../components/common/CachingEmoji';
import EmojiButton from '../../components/common/EmojiButton';
import {
  EmojiDescription,
  EmojiDescriptionWithVariations,
  OnToneSelected,
  OnToneSelectorCancelled,
  ToneSelection,
} from '../../types';
import { messages } from '../i18n';
import * as styles from './styles';
import ToneSelector from './ToneSelector';
import { setSkinToneAriaLabelText } from './setSkinToneAriaLabelText';

export interface Props {
  emoji?: EmojiDescription;
  toneEmoji?: EmojiDescriptionWithVariations;
  selectedTone?: ToneSelection;
  onToneSelected?: OnToneSelected;
  onToneSelectorCancelled?: OnToneSelectorCancelled;
  uploadEnabled?: boolean;
  onOpenUpload?: () => void;
}

export interface State {
  selectingTone: boolean;
}

export class EmojiPreview extends PureComponent<
  Props & WrappedComponentProps,
  State
> {
  state = {
    selectingTone: false,
  };

  onToneButtonClick = () => {
    this.setState({
      selectingTone: !this.state.selectingTone,
    });
  };

  onToneSelected = (toneValue: number) => {
    this.setState({
      selectingTone: false,
    });

    if (this.props.onToneSelected) {
      this.props.onToneSelected(toneValue);
    }
  };

  onMouseLeave = () => {
    const { selectingTone } = this.state;
    const { onToneSelectorCancelled } = this.props;

    if (selectingTone && onToneSelectorCancelled) {
      onToneSelectorCancelled();
    }

    this.setState({
      selectingTone: false,
    });
  };

  renderTones() {
    const { toneEmoji, selectedTone, intl } = this.props;
    const { formatMessage } = intl;
    if (!toneEmoji) {
      return null;
    }

    let previewEmoji = toneEmoji;
    if (selectedTone && previewEmoji.skinVariations) {
      previewEmoji = previewEmoji.skinVariations[(selectedTone || 1) - 1];
    }

    return (
      <div className={styles.toneSelectorContainer}>
        {this.state.selectingTone && (
          <ToneSelector
            emoji={toneEmoji}
            onToneSelected={this.onToneSelected}
            previewEmojiId={previewEmoji.id as string}
          />
        )}
        <EmojiButton
          ariaExpanded={this.state.selectingTone}
          emoji={previewEmoji}
          selectOnHover={true}
          onSelected={this.onToneButtonClick}
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
  }

  renderEmojiPreview() {
    const { selectingTone } = this.state;
    const { emoji, uploadEnabled } = this.props;

    if (!emoji || selectingTone || uploadEnabled) {
      return null;
    }

    const previewClasses = classNames({
      [styles.preview]: true,
      [styles.withToneSelector]: !!this.props.toneEmoji,
    });

    const previewTextClasses = classNames({
      [styles.previewText]: true,
      [styles.previewSingleLine]: !emoji.name,
    });

    return (
      <div className={previewClasses}>
        <span className={styles.previewImg}>
          <CachingEmoji emoji={emoji} />
        </span>
        <div className={previewTextClasses}>
          <span className={styles.name}>{emoji.name}</span>
          <span className={styles.shortName}>{emoji.shortName}</span>
        </div>
      </div>
    );
  }

  // note: emoji-picker-add-emoji className is used by pollinator synthetic checks
  renderAddOwnEmoji() {
    const { onOpenUpload, uploadEnabled, intl } = this.props;
    const { selectingTone } = this.state;
    const { formatMessage } = intl;

    if (!uploadEnabled || selectingTone) {
      return null;
    }
    return (
      <div className={styles.AddCustomEmoji}>
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
              className={
                styles.addCustomEmojiButton + ' emoji-picker-add-emoji'
              }
            >
              {label}
            </AkButton>
          )}
        </FormattedMessage>
      </div>
    );
  }

  render() {
    const sectionClasses = classNames([
      styles.emojiPreview,
      styles.emojiPreviewSection,
    ]);
    return (
      <div className={sectionClasses} onMouseLeave={this.onMouseLeave}>
        {this.renderAddOwnEmoji()}
        {this.renderEmojiPreview()}
        {this.renderTones()}
      </div>
    );
  }
}

export default injectIntl(EmojiPreview);
