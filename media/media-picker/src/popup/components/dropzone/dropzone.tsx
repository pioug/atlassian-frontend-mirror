import React from 'react';
import { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { messages } from '@atlaskit/media-ui';
import { Wrapper, Content, Label, Glass } from './styled';
import { UploadIcon } from './icons';

export interface DropzoneProps {
  isActive: boolean;
}

export class Dropzone extends Component<DropzoneProps, {}> {
  render() {
    const { isActive } = this.props;

    return (
      <Wrapper isActive={isActive}>
        <Content>
          <UploadIcon />
          <Label>
            <FormattedMessage {...messages.drop_your_files} />
          </Label>
        </Content>
        <Glass />
      </Wrapper>
    );
  }
}
