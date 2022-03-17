/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { Fragment } from 'react';
import { ChangeEvent, ChangeEventHandler, PureComponent } from 'react';
import {
  FormattedMessage,
  injectIntl,
  MessageDescriptor,
  WrappedComponentProps,
} from 'react-intl-next';
import TextField from '@atlaskit/textfield';

import { EmojiUpload, Message } from '../../types';
import * as ImageUtil from '../../util/image';
import debug from '../../util/logger';
import { messages } from '../i18n';
import EmojiErrorMessage from './EmojiErrorMessage';
import EmojiUploadPreview from './EmojiUploadPreview';
import FileChooser from './FileChooser';
import { UploadStatus } from './internal-types';
import {
  emojiChooseFileErrorMessage,
  emojiUpload,
  emojiUploadBottom,
  uploadChooseFileBrowse,
  uploadChooseFileEmojiName,
  uploadChooseFileMessage,
  uploadChooseFileRow,
} from './styles';

export interface OnUploadEmoji {
  (upload: EmojiUpload, retry: boolean): void;
}

export interface Props {
  onUploadEmoji: OnUploadEmoji;
  onUploadCancelled: () => void;
  onFileChooserClicked?: () => void;
  errorMessage?: Message;
  initialUploadName?: string;
}

export interface State {
  previewImage?: string;
  name?: string;
  filename?: string;
  uploadStatus?: UploadStatus;
  chooseEmojiErrorMessage?: MessageDescriptor;
}

const disallowedReplacementsMap = new Map([
  [':', ''],
  ['!', ''],
  ['@', ''],
  ['#', ''],
  ['%', ''],
  ['^', ''],
  ['&', ''],
  ['*', ''],
  ['(', ''],
  [')', ''],
  [' ', '_'],
]);

const sanitizeName = (name: string): string => {
  // prevent / replace certain characters, allow others
  disallowedReplacementsMap.forEach((replaceWith, exclude) => {
    name = name.split(exclude).join(replaceWith);
  });
  return name;
};

const maxNameLength = 50;

const toEmojiName = (uploadName: string): string => {
  const name = uploadName.split('_').join(' ');
  return `${name.substr(0, 1).toLocaleUpperCase()}${name.substr(1)}`;
};

interface ChooseEmojiFileProps {
  name?: string;
  onChooseFile: ChangeEventHandler<any>;
  onClick?: () => void;
  onNameChange: ChangeEventHandler<any>;
  onUploadCancelled: () => void;
  errorMessage?: Message;
}

class ChooseEmojiFile extends PureComponent<
  ChooseEmojiFileProps & WrappedComponentProps,
  {}
> {
  private onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Escape') {
      this.props.onUploadCancelled();
    }
  };

  render() {
    const {
      name = '',
      onChooseFile,
      onClick,
      onNameChange,
      errorMessage,
      intl,
    } = this.props;
    const { formatMessage } = intl;
    const disableChooser = !name;
    const fileChooserButtonDescriptionId =
      'choose.emoji.file.button.screen.reader.description.id';

    // Note: FileChooser.accept does not work in Electron due to a bug: https://product-fabric.atlassian.net/browse/FS-1626
    return (
      <div css={emojiUpload}>
        <div css={uploadChooseFileMessage}>
          <FormattedMessage {...messages.addCustomEmojiLabel}>
            {(message) => <h5>{message}</h5>}
          </FormattedMessage>
        </div>
        <div css={uploadChooseFileRow}>
          <span css={uploadChooseFileEmojiName}>
            <TextField
              placeholder={formatMessage(messages.emojiPlaceholder)}
              aria-label={formatMessage(messages.emojiNameAriaLabel)}
              maxLength={maxNameLength}
              onChange={onNameChange}
              onKeyDown={this.onKeyDown}
              value={name}
              isCompact
              autoFocus
            />
          </span>
          <span css={uploadChooseFileBrowse}>
            <FormattedMessage
              {...messages.emojiChooseFileScreenReaderDescription}
            >
              {(screenReaderDescription) => (
                <Fragment>
                  <span hidden id={fileChooserButtonDescriptionId}>
                    {screenReaderDescription}
                  </span>
                  <FileChooser
                    label={formatMessage(messages.emojiChooseFileTitle)}
                    onChange={onChooseFile}
                    onClick={onClick}
                    accept="image/png,image/jpeg,image/gif"
                    ariaDescribedBy={fileChooserButtonDescriptionId}
                    isDisabled={disableChooser}
                  />
                </Fragment>
              )}
            </FormattedMessage>
          </span>
        </div>
        <div css={emojiUploadBottom}>
          {!errorMessage ? (
            <p>
              <FormattedMessage {...messages.emojiImageRequirements} />
            </p>
          ) : (
            <EmojiErrorMessage
              messageStyles={emojiChooseFileErrorMessage}
              message={errorMessage}
            />
          )}
        </div>
      </div>
    );
  }
}

export class EmojiUploadPicker extends PureComponent<
  Props & WrappedComponentProps,
  State
> {
  state = {
    uploadStatus: UploadStatus.Waiting,
    chooseEmojiErrorMessage: undefined,
  } as State;

  constructor(props: Props & WrappedComponentProps) {
    super(props);
    if (props.errorMessage) {
      this.state.uploadStatus = UploadStatus.Error;
    }
    if (props.initialUploadName) {
      this.state.name = sanitizeName(props.initialUploadName);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const updatedState: State = {};
    if (nextProps.errorMessage) {
      updatedState.uploadStatus = UploadStatus.Error;
    } else {
      if (this.state.uploadStatus === UploadStatus.Error) {
        updatedState.uploadStatus = UploadStatus.Waiting;
      }
    }
    if (nextProps.initialUploadName) {
      if (!this.state.name) {
        updatedState.name = sanitizeName(nextProps.initialUploadName);
      }
    }
    this.setState(updatedState);
  }

  private onNameChange = (event: ChangeEvent<any>) => {
    let newName = sanitizeName(event.target.value);
    if (this.state.name !== newName) {
      this.setState({
        name: newName,
      });
    }
  };

  private onAddEmoji = () => {
    const { onUploadEmoji } = this.props;
    const { filename, name, previewImage, uploadStatus } = this.state;

    if (uploadStatus === UploadStatus.Uploading) {
      return;
    }

    if (filename && name && previewImage) {
      const notifyUpload = (size: { width: number; height: number }) => {
        const { width, height } = size;
        this.setState({
          uploadStatus: UploadStatus.Uploading,
        });

        onUploadEmoji(
          {
            name: toEmojiName(name),
            shortName: `:${name}:`,
            filename,
            dataURL: previewImage,
            width,
            height,
          },
          uploadStatus === UploadStatus.Error,
        );
      };
      ImageUtil.getNaturalImageSize(previewImage)
        .then((size) => {
          notifyUpload(size);
        })
        .catch((error) => {
          debug('getNaturalImageSize error', error);
          // Just set arbitrary size, worse case is it may render
          // in wrong aspect ratio in some circumstances.
          notifyUpload({
            width: 32,
            height: 32,
          });
        });
    }
  };

  private errorOnUpload = (event: any): void => {
    debug('File load error: ', event);
    this.setState({
      chooseEmojiErrorMessage: messages.emojiUploadFailed,
    });
    this.cancelChooseFile();
  };

  private onFileLoad = (file: File) => (f: any): Promise<any> => {
    return ImageUtil.parseImage(f.target.result)
      .then(() => {
        const state = {
          previewImage: f.target.result,
          filename: file.name,
        };
        this.setState(state);
      })
      .catch(() => {
        this.setState({
          chooseEmojiErrorMessage: messages.emojiInvalidImage,
        });
        this.cancelChooseFile();
      });
  };

  private cancelChooseFile = () => {
    this.setState({
      previewImage: undefined,
    });
  };

  private onChooseFile = (event: ChangeEvent<any>): void => {
    const files = event.target.files;

    if (files.length) {
      const reader = new FileReader();
      const file: File = files[0];

      if (ImageUtil.hasFileExceededSize(file)) {
        this.setState({
          chooseEmojiErrorMessage: messages.emojiImageTooBig,
        });
        this.cancelChooseFile();
        return;
      }

      reader.addEventListener('load', this.onFileLoad(file));
      reader.addEventListener('abort', this.errorOnUpload);
      reader.addEventListener('error', this.errorOnUpload);
      reader.readAsDataURL(file);
    } else {
      this.cancelChooseFile();
    }
  };

  clearUploadPicker = () => {
    this.setState({
      name: undefined,
      previewImage: undefined,
      uploadStatus: UploadStatus.Waiting,
    });
  };

  render() {
    const { errorMessage, onUploadCancelled, intl } = this.props;
    const {
      name,
      previewImage,
      uploadStatus,
      chooseEmojiErrorMessage,
    } = this.state;

    const cancelUpload = () => {
      this.clearUploadPicker();
      onUploadCancelled();
    };

    if (name && previewImage) {
      return (
        <EmojiUploadPreview
          errorMessage={errorMessage}
          name={name}
          onAddEmoji={this.onAddEmoji}
          onUploadCancelled={cancelUpload}
          previewImage={previewImage}
          uploadStatus={uploadStatus}
        />
      );
    }

    return (
      <ChooseEmojiFile
        name={name}
        onChooseFile={this.onChooseFile}
        onClick={this.props.onFileChooserClicked}
        onNameChange={this.onNameChange}
        onUploadCancelled={cancelUpload}
        errorMessage={
          chooseEmojiErrorMessage ? (
            <FormattedMessage {...chooseEmojiErrorMessage} />
          ) : undefined
        }
        intl={intl}
      />
    );
  }
}

export default injectIntl(EmojiUploadPicker, { forwardRef: true });
