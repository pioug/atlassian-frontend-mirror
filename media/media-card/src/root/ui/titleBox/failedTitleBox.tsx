import React from 'react';
import { TitleBoxWrapper, ErrorMessageWrapper } from './styled';
import { Breakpoint } from '../common';
import EditorWarningIcon from '@atlaskit/icon/glyph/editor/warning';
import { messages } from '@atlaskit/media-ui';
import { R300 } from '@atlaskit/theme/colors';
import { FormattedMessage } from 'react-intl';

export type OnRetryFunction = () => void;

export type FailedTitleBoxProps = {
  breakpoint: Breakpoint;
  customMessage?: FormattedMessage.MessageDescriptor;
};

export const FailedTitleBox: React.FC<FailedTitleBoxProps> = ({
  breakpoint,
  customMessage = messages.failed_to_load,
}) => {
  return (
    <TitleBoxWrapper breakpoint={breakpoint}>
      <ErrorMessageWrapper>
        <EditorWarningIcon
          label={'Warning'}
          size={'small'}
          primaryColor={R300}
        />
        <FormattedMessage {...customMessage} />
      </ErrorMessageWrapper>
    </TitleBoxWrapper>
  );
};
