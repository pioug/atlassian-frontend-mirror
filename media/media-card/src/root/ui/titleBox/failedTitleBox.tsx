import React from 'react';
import { FormattedMessage } from 'react-intl-next';

import EditorWarningIcon from '@atlaskit/icon/glyph/editor/warning';
import { messages } from '@atlaskit/media-ui';
import { R300 } from '@atlaskit/theme/colors';
import { ErrorMessageWrapper, TitleBoxWrapper } from './titleBoxComponents';
import { FailedTitleBoxProps } from './types';

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
        <span>
          <FormattedMessage {...customMessage} />
        </span>
      </ErrorMessageWrapper>
    </TitleBoxWrapper>
  );
};
