/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';

import { TextProps } from './types';
import { getFormattedMessage, getTruncateStyles } from '../../utils';
import { tokens } from '../../../../../utils/token';

const styles = css`
  color: ${tokens.text};
  font-size: 0.75rem;
  line-height: 1rem;
  ${getTruncateStyles(1)}
`;

const Text: React.FC<TextProps> = ({
  content,
  message,
  testId = 'smart-element-text',
}) => {
  if (!message && !content) {
    return null;
  }

  return (
    <span css={styles} data-smart-element-text data-testid={testId}>
      {getFormattedMessage(message) || content}
    </span>
  );
};

export default Text;
