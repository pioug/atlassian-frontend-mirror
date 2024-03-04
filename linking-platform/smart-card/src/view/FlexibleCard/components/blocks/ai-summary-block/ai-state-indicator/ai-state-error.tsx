import React from 'react';
import { FormattedMessage } from 'react-intl-next';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { messages } from '../../../../../../messages';
import AIIndicatorContainer from './ai-indicator-container';
import { AIStateIndicatorProps } from './types';
import AILearnMoreAnchor from './ai-learn-more-anchor';
import { CONTENT_URL_AI_TROUBLESHOOTING } from '../../../../../../constants';

const contentStyles = xcss({
  color: 'color.text.subtle',
  fontSize: '11px',
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '14px',
});

const AIStateError: React.FC<Partial<AIStateIndicatorProps>> = ({
  appearance,
  testId,
}) => {
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
              <FormattedMessage
                {...messages.ai_summary_error_generic}
                values={{
                  a: (chunks: string) => (
                    <AILearnMoreAnchor href={CONTENT_URL_AI_TROUBLESHOOTING}>
                      {chunks}
                    </AILearnMoreAnchor>
                  ),
                }}
              />
            </Box>
          }
          testId={`${testId}-error`}
        />
      );
  }
};

export default AIStateError;
