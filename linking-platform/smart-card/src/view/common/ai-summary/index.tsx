/** @jsx jsx */
import React from 'react';
import Markdown, { type MarkdownToJSX } from 'markdown-to-jsx';
import { SerializedStyles, css, jsx } from '@emotion/react';
import AIStateIndicator from '../../FlexibleCard/components/blocks/ai-summary-block/ai-state-indicator';

const AITooltipIcon: MarkdownToJSX.Override = () => (
  <AIStateIndicator appearance="icon-only" state="done" testId="ai-tooltip" />
);

const AISummaryCSS = css({
  fontSize: '0.75rem',
  lineHeight: '1rem',
  wordWrap: 'break-word',
  whiteSpace: 'normal',
});

type AISummaryProps = {
  /* Raw markdawn format text to display.*/
  content?: string;
  /* Should the summary icon be shown at the end of the content */
  showIcon?: boolean;
  /* Optional icon component to override icon at the end of content */
  iconComponent?: MarkdownToJSX.Override;
  /* Additional CSS properties */
  overrideCss?: SerializedStyles;
  /**
   * appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests
   */
  testId?: string;
  /**
   * Minimum height requirement for the AISummary component to prevent fluctuations in a card size on the summary action.
   */
  minHeight?: number;
};

/**
 * A component to render a response from AI in markdown text.
 * @internal
 * @param {AISummaryProps} AISummaryProps
 */

const AISummary: React.FC<AISummaryProps> = ({
  content = '',
  showIcon = false,
  iconComponent,
  overrideCss,
  testId = 'ai-summary',
  minHeight = 0,
}) => {
  if (!content && minHeight === 0) {
    return null;
  }

  return (
    <Markdown
      data-testid={testId}
      css={[AISummaryCSS, overrideCss]}
      children={showIcon ? `${content}&nbsp;<Icon />` : content}
      options={{
        forceWrapper: true,
        overrides: { Icon: iconComponent ?? AITooltipIcon },
      }}
      style={{ minHeight: minHeight }}
    />
  );
};

export default AISummary;
