import React from 'react';
import { TitleBoxWrapper, ErrorMessageWrapper } from './styled';
import { Breakpoint } from '../Breakpoint';
import EditorWarningIcon from '@atlaskit/icon/glyph/editor/warning';
import { R300 } from '@atlaskit/theme/colors';
import { getErrorMessage } from '../../../utils/getErrorMessage';

export type OnRetryFunction = () => void;

export type FailedTitleBoxProps = {
  breakpoint: Breakpoint;
};

export const FailedTitleBox: React.FC<FailedTitleBoxProps> = ({
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
