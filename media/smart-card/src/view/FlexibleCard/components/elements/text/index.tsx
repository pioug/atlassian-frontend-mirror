/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';

import { TextProps } from './types';
import { getFormattedMessage, getTruncateStyles } from '../../utils';
import { tokens } from '../../../../../utils/token';

const getStyles = (maxLines: number, color: string) => css`
  color: ${color};
  font-size: 0.75rem;
  line-height: 1rem;
  ${getTruncateStyles(maxLines)}
`;

const Text: React.FC<TextProps> = ({
  color = tokens.text,
  content,
  maxLines = 1,
  message,
  testId = 'smart-element-text',
}) => {
  if (!message && !content) {
    return null;
  }

  return (
    <span
      css={getStyles(maxLines, color)}
      data-smart-element-text
      data-testid={testId}
    >
      {getFormattedMessage(message) || content}
    </span>
  );
};

export default Text;
