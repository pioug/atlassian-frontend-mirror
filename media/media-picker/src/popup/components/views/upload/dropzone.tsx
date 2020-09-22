'use strict';
import React from 'react';
import { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { messages } from '@atlaskit/media-ui';
import LocalBrowserButton from './uploadButton';
import { filesIcon } from '../../../../icons';
import {
  ButtonWrapper,
  DefaultImage,
  DropzoneText,
  DropzoneContainer,
  DropzoneContentWrapper,
  TextWrapper,
} from './styled';
import { BrowserBase } from '../../../../components/browser/browser';
import { getMediaFeatureFlag, MediaFeatureFlags } from '@atlaskit/media-common';

export interface DropzoneProps {
  readonly isEmpty?: boolean;
  readonly browserRef: React.RefObject<BrowserBase>;
  readonly featureFlags?: MediaFeatureFlags;
}

export class Dropzone extends Component<DropzoneProps> {
  render() {
    const { isEmpty, browserRef } = this.props;

    const isFolderUploadsEnabled = getMediaFeatureFlag(
      'folderUploads',
      this.props.featureFlags,
    )
      ? messages.drag_and_drop_your_files_and_folders
      : messages.drag_and_drop_your_files;

    return (
      <DropzoneContainer isEmpty={isEmpty}>
        <DropzoneContentWrapper>
          <DefaultImage src={filesIcon} />
          <TextWrapper>
            <DropzoneText>
              <FormattedMessage {...isFolderUploadsEnabled} />
            </DropzoneText>
            <ButtonWrapper>
              <LocalBrowserButton browserRef={browserRef} />
            </ButtonWrapper>
          </TextWrapper>
        </DropzoneContentWrapper>
      </DropzoneContainer>
    );
  }
}
