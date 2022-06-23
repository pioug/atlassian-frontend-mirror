/** @jsx jsx */
import { jsx } from '@emotion/core';
import { PureComponent } from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl-next';

import { EmojiUpload } from '../../types';
import { EmojiProvider, supportsUploadFeature } from '../../api/EmojiResource';
import {
  AnalyticsEventPayload,
  CreateUIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import EmojiUploadPickerWithIntl, {
  EmojiUploadPicker,
} from '../common/EmojiUploadPicker';
import { uploadEmoji } from '../common/UploadEmoji';
import {
  createAndFireEventInElementsChannel,
  selectedFileEvent,
  uploadCancelButton,
  uploadConfirmButton,
} from '../../util/analytics';
import { emojiUploadFooter, emojiUploadWidget } from './styles';
import { ufoExperiences } from '../../util/analytics/ufoExperiences';
export interface UploadRefHandler {
  (ref: HTMLDivElement): void;
}

export interface Props {
  emojiProvider: EmojiProvider;
  onUploaderRef?: UploadRefHandler;
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
}

export interface State {
  uploadErrorMessage?: MessageDescriptor;
}

export default class EmojiUploadComponent extends PureComponent<Props, State> {
  private ref?: EmojiUploadPicker | null;

  constructor(props: Props) {
    super(props);
    if (supportsUploadFeature(props.emojiProvider)) {
      props.emojiProvider.prepareForUpload();
    }

    this.state = {};
  }

  componentWillUnmount() {
    ufoExperiences['emoji-uploaded'].abort({
      metadata: {
        source: 'EmojiUploadComponent',
        reason: 'unmount',
      },
    });
  }

  private onUploadEmoji = (upload: EmojiUpload, retry: boolean) => {
    const { emojiProvider } = this.props;

    ufoExperiences['emoji-uploaded'].start();
    ufoExperiences['emoji-uploaded'].addMetadata({ retry });

    this.fireAnalytics(uploadConfirmButton({ retry }));
    const errorSetter = (message?: MessageDescriptor) => {
      this.setState({
        uploadErrorMessage: message,
      });
    };
    uploadEmoji(
      upload,
      emojiProvider,
      errorSetter,
      this.prepareForUpload,
      this.fireAnalytics,
    );
  };

  private prepareForUpload = () => {
    const { emojiProvider } = this.props;
    if (supportsUploadFeature(emojiProvider)) {
      emojiProvider.prepareForUpload();
    }

    this.setState({
      uploadErrorMessage: undefined,
    });

    if (this.ref) {
      this.ref.clearUploadPicker();
    }
  };

  onFileChooserClicked = () => {
    this.fireAnalytics(selectedFileEvent());
  };

  private onUploadCancelled = () => {
    this.fireAnalytics(uploadCancelButton());
    this.prepareForUpload();
  };

  private onUploaderRef = (emojiUploadPicker: EmojiUploadPicker | null) => {
    this.ref = emojiUploadPicker;
  };

  private fireAnalytics = (analyticsEvent: AnalyticsEventPayload) => {
    const { createAnalyticsEvent } = this.props;

    if (createAnalyticsEvent) {
      createAndFireEventInElementsChannel(analyticsEvent)(createAnalyticsEvent);
    }
  };

  render() {
    const { uploadErrorMessage } = this.state;

    const errorMessage = uploadErrorMessage ? (
      <FormattedMessage {...uploadErrorMessage} />
    ) : null;

    return (
      <div css={emojiUploadWidget} ref={this.props.onUploaderRef}>
        <div css={emojiUploadFooter}>
          <EmojiUploadPickerWithIntl
            ref={this.onUploaderRef}
            onFileChooserClicked={this.onFileChooserClicked}
            onUploadCancelled={this.onUploadCancelled}
            onUploadEmoji={this.onUploadEmoji}
            errorMessage={errorMessage}
          />
        </div>
      </div>
    );
  }
}
