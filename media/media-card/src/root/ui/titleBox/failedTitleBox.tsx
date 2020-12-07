import React from 'react';
import { TitleBoxWrapper, ErrorMessageWrapper } from './styled';
import { Breakpoint } from '../common';
import EditorWarningIcon from '@atlaskit/icon/glyph/editor/warning';
import { R300 } from '@atlaskit/theme/colors';
import { getErrorMessage } from '../../../utils/getErrorMessage';

export type OnRetryFunction = () => void;

export type FailedTitleBoxProps = {
  breakpoint: Breakpoint;
  onRetry?: OnRetryFunction;
};

export const FailedTitleBox: React.FC<FailedTitleBoxProps> = ({
  onRetry,
  breakpoint,
}) => {
  return (
    <TitleBoxWrapper breakpoint={breakpoint}>
      <ErrorMessageWrapper>
        <EditorWarningIcon
          label={'Warning'}
          size={'small'}
          primaryColor={R300}
        />
        {getErrorMessage('error')}
      </ErrorMessageWrapper>
    </TitleBoxWrapper>
  );
};
