/** @jsx jsx */
import React from 'react';
import Markdown from 'markdown-to-jsx';
import { SerializedStyles, css, jsx } from '@emotion/react';

const AISummaryCSS = css`
  overflow-y: auto;
  font-size: 0.75rem;
  line-height: 1rem;
  word-wrap: break-word;
  white-space: normal;
`;

type AISummaryProps = {
  /* Raw markdawn format text to display.*/
  content?: string;
  /* Adds AI Icon at the end of the markdown text*/
  showAIIcon?: boolean;
  /* Additional CSS properties */
  overrideCss?: SerializedStyles;
  /**
   * appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests
   */
  testId?: string;
};

/**
 * A component to render a response from AI in markdown text.
 * @internal
 * @param {AISummaryProps} AISummaryProps
 */

const AISummary: React.FC<AISummaryProps> = ({
  content,
  overrideCss,
  testId = 'ai-summary',
}) => {
  if (!content) {
    return null;
  }

  return (
    <Markdown
      data-testid={testId}
      css={[AISummaryCSS, overrideCss]}
      children={content}
      options={{
        forceWrapper: true,
      }}
    />
  );
};

export default AISummary;
