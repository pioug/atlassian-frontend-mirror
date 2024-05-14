import React from 'react';
import { FormattedMessage, type MessageDescriptor } from 'react-intl-next';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import { getAISummaryErrorMessage } from '../../../../../../utils/ai-summary';
import AILearnMoreAnchor from '../../../common/ai-summary/ai-learn-more-anchor';
import AIIndicatorContainer from './ai-indicator-container';
import { type AIStateIndicatorProps } from './types';

const contentStyles = xcss({
  color: 'color.text.subtle',
  fontSize: '11px',
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '14px',
});

const FormattedErrorMessage = ({
  message,
  url,
}: {
  message: MessageDescriptor;
  url?: string;
}) => (
  <FormattedMessage
    {...message}
    values={{
      a: (chunks: React.ReactNode[]) => (
        <AILearnMoreAnchor href={url}>{chunks}</AILearnMoreAnchor>
      ),
    }}
  />
);

const AIStateError: React.FC<Partial<AIStateIndicatorProps>> = ({
  appearance,
  testId,
  error,
}) => {
  const { message, url } = getAISummaryErrorMessage(error);

  switch (appearance) {
    case 'icon-only':
      return null;
    default:
      return (
        <AIIndicatorContainer
          icon={
            <ErrorIcon
              primaryColor={token('color.icon.danger', '#C9372C')}
              label="AI"
              size="small"
              testId={`${testId}-error-icon`}
            />
          }
          content={
            <Box testId={`${testId}-error-message`} xcss={contentStyles}>
              <FormattedErrorMessage message={message} url={url} />
            </Box>
          }
          testId={`${testId}-error`}
        />
      );
  }
};

export default AIStateError;
