import React from 'react';
import { Component } from 'react';
import { messages } from '@atlaskit/media-ui';
import { FormattedMessage } from 'react-intl';
import { FileDetails, ImageResizeMode } from '@atlaskit/media-client';
import { SharedCardProps, CardStatus } from '../..';
import { CardAction } from '../../actions';
import { FileCardImageView } from '../cardImageView';
import { toHumanReadableMediaSize } from '../../utils';

export interface FileCardProps extends SharedCardProps {
  readonly status: CardStatus;
  readonly details?: FileDetails;
  readonly dataURI?: string;
  readonly progress?: number;
  readonly onRetry?: () => void;
  readonly resizeMode?: ImageResizeMode;
  readonly disableOverlay?: boolean;
  readonly previewOrientation?: number;
  readonly onDisplayImage?: () => void;
}

export class FileCard extends Component<FileCardProps, {}> {
  static defaultProps: Partial<FileCardProps> = {
    actions: [],
  };

  render() {
    return this.renderFile();
  }

  renderFile(): JSX.Element {
    const {
      status,
      dimensions,
      selectable,
      selected,
      details,
      dataURI,
      progress,
      resizeMode,
      onRetry,
      disableOverlay,
      previewOrientation,
      alt,
      onDisplayImage,
    } = this.props;
    const defaultDetails: FileDetails = {
      id: '',
      name: undefined,
      mediaType: undefined,
      size: undefined,
    };
    const { name, mediaType, size } = details || defaultDetails;
    const errorMessage = this.isError && (
      <FormattedMessage {...messages.failed_to_load} />
    );
    const fileSize = size ? toHumanReadableMediaSize(size) : '';

    return (
      <FileCardImageView
        error={errorMessage}
        dimensions={dimensions}
        selectable={selectable}
        selected={selected}
        dataURI={dataURI}
        mediaName={name}
        mediaType={mediaType}
        fileSize={fileSize}
        status={status}
        progress={progress}
        resizeMode={resizeMode}
        onRetry={onRetry}
        onDisplayImage={onDisplayImage}
        actions={this.getActions()}
        disableOverlay={disableOverlay}
        previewOrientation={previewOrientation}
        alt={alt}
      />
    );
  }

  private getActions(): Array<CardAction> {
    const { details, actions = [] } = this.props;
    if (!details) {
      return [];
    }

    return actions.map((action: CardAction) => ({
      ...action,
      handler: () => {
        action.handler({ type: 'file', details });
      },
    }));
  }

  private get isError(): boolean {
    const { status } = this.props;
    return status === 'error';
  }
}
