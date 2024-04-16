import React from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl-next';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { messages } from '../../../../../../messages';
import AIIndicatorContainer from './ai-indicator-container';
import { AIStateIndicatorProps } from './types';
import AILearnMoreAnchor from './ai-learn-more-anchor';
import {
  CONTENT_URL_ACCEPTABLE_USE_POLICY,
  CONTENT_URL_AI_TROUBLESHOOTING,
} from '../../../../../../constants';
import { ErrorMessage } from '../../../../../../state/hooks/use-ai-summary/ai-summary-service/types';

const contentStyles = xcss({
  color: 'color.text.subtle',
  fontSize: '11px',
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '14px',
});

const MessageWithAnchor = ({
  message,
  url,
}: {
  message: MessageDescriptor;
  url: string;
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

const getErrorMesssageProps = (
  error?: ErrorMessage,
): { message: MessageDescriptor; url: string } => {
  switch (error) {
    case 'ACCEPTABLE_USE_VIOLATIONS':
      return {
        message: messages.ai_summary_error_acceptable_use_violation,
        url: CONTENT_URL_ACCEPTABLE_USE_POLICY,
      };
    default:
      return {
        message: messages.ai_summary_error_generic,
        url: CONTENT_URL_AI_TROUBLESHOOTING,
      };
  }
};

const AIStateError: React.FC<Partial<AIStateIndicatorProps>> = ({
  appearance,
  testId,
  error,
}) => {
  const { message, url } = getErrorMesssageProps(error);

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
              <MessageWithAnchor message={message} url={url} />
            </Box>
          }
          testId={`${testId}-error`}
        />
      );
  }
};

export default AIStateError;
