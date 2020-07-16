import React from 'react';
import { TitleBoxWrapper, TitleBoxHeader, ErrorMessageWrapper } from './styled';
import { Breakpoint } from '../common';
import EditorWarningIcon from '@atlaskit/icon/glyph/editor/warning';
import { R300 } from '@atlaskit/theme/colors';
import { NewExpRetryButton } from '../../../files/cardImageView/cardOverlay/retryButton';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { Truncate } from './truncateText';

export type OnRetryFunction = () => void;

export type FailedTitleBoxProps = {
  name?: string;
  breakpoint: Breakpoint;
  onRetry?: OnRetryFunction;
};

export type ErrorMessageProps = { onRetry?: OnRetryFunction };

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ onRetry }) => (
  <ErrorMessageWrapper>
    <EditorWarningIcon label={'Warning'} size={'small'} primaryColor={R300} />
    {getErrorMessage('error')}
    {onRetry ? <NewExpRetryButton onClick={onRetry} /> : null}
  </ErrorMessageWrapper>
);

export const FailedTitleBox: React.FC<FailedTitleBoxProps> = ({
  name,
  onRetry,
  breakpoint,
}) => {
  return (
    <TitleBoxWrapper breakpoint={breakpoint}>
      {name ? (
        <>
          <TitleBoxHeader>
            <Truncate text={name} />
          </TitleBoxHeader>
          <ErrorMessage onRetry={onRetry} />
        </>
      ) : (
        <ErrorMessage onRetry={onRetry} />
      )}
    </TitleBoxWrapper>
  );
};
