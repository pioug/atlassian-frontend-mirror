/** @jsx jsx */
import React from 'react';
import { FormattedMessage } from 'react-intl-next';
import { css, jsx } from '@emotion/react';
import EditorPanelIcon from '@atlaskit/icon/glyph/editor/panel';
import { token } from '@atlaskit/tokens';
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';

import { messages } from '../../../../../../messages';
import AIIcon from '../../../../../common/ai-icon';
import AIIndicatorTooltip from './ai-indicator-tooltip';
import AIIndicatorContainer from './ai-indicator-container';
import AILearnMoreAnchor from './ai-learn-more-anchor';
import type { AIStateIndicatorProps } from './types';

const tooltipMsgStyles = xcss({
  color: 'color.text',
  fontSize: '14px',
  fontWeight: '400',
  lineHeight: '20px',
});

const iconTooltipLinkStyles = css({
  color: token('color.text.subtlest', '#626F86'),
  '&:link, :visited': {
    color: token('color.text.subtlest', '#626F86'),
  },
  '&:hover': {
    color: token('color.text.subtle', '#44546F'),
  },
  '&:active': {
    color: token('color.text', '#172B4D'),
  },
  textDecoration: 'underline',
});

const iconTooltipTitleStyles = xcss({
  color: 'color.text',
  fontSize: '12px',
  fontWeight: '400',
  lineHeight: '16px',
});

const iconTooltipDescStyles = xcss({
  color: 'color.text.subtlest',
  fontSize: '11px',
  fontWeight: '400',
  lineHeight: '14px',
});

const iconTooltipTriggerStyles = xcss({
  position: 'relative',
  bottom: 'space.negative.050',
});

const AIStateDone: React.FC<Partial<AIStateIndicatorProps>> = ({
  appearance,
  testId,
}) => {
  const icon = (
    <AIIcon label="AI" size="small" testId={`${testId}-done-icon`} />
  );

  switch (appearance) {
    case 'icon-only':
      return (
        <AIIndicatorTooltip
          content={
            <Inline alignBlock="center" space="space.100">
              <AIIcon
                label="AI"
                size="medium"
                testId={`${testId}-done-tooltip-icon`}
              />
              <Stack>
                <Box
                  xcss={iconTooltipTitleStyles}
                  testId={`${testId}-done-tooltip-title`}
                >
                  <FormattedMessage {...messages.ai_summarized} />
                </Box>
                <Box xcss={iconTooltipDescStyles}>
                  <FormattedMessage
                    {...messages.ai_summarized_info}
                    values={{
                      a: (chunks: string) => (
                        <AILearnMoreAnchor css={iconTooltipLinkStyles}>
                          {chunks}
                        </AILearnMoreAnchor>
                      ),
                    }}
                  />
                </Box>
              </Stack>
            </Inline>
          }
          trigger={icon}
          xcss={iconTooltipTriggerStyles}
        />
      );
    default:
      return (
        <AIIndicatorContainer
          icon={icon}
          content={
            <Inline alignBlock="center" alignInline="start" space="space.050">
              <Box testId={`${testId}-done-message`}>
                <FormattedMessage {...messages.ai_summarized} />
              </Box>
              <AIIndicatorTooltip
                content={
                  <Box
                    xcss={tooltipMsgStyles}
                    testId={`${testId}-done-tooltip`}
                  >
                    <FormattedMessage
                      {...messages.ai_summarized_info}
                      values={{
                        a: (chunks: string) => (
                          <AILearnMoreAnchor>{chunks}</AILearnMoreAnchor>
                        ),
                      }}
                    />
                  </Box>
                }
                trigger={
                  <EditorPanelIcon
                    label="Info"
                    size="small"
                    testId={`${testId}-done-info`}
                  />
                }
              />
            </Inline>
          }
          testId={`${testId}-done`}
        />
      );
  }
};

export default AIStateDone;
