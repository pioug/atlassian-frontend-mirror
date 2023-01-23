/** @jsx jsx */
import type { FC } from 'react';

import { css, jsx } from '@emotion/react';

import Textfield from '@atlaskit/textfield';
import {
  fontSize as getFontSize,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import InlineEdit from '../src';

const fontSize = getFontSize();
const gridSize = getGridSize();

const readViewContainerStyles = css({
  display: 'flex',
  maxWidth: '100%',
  minHeight: `${(gridSize * 2.5) / fontSize}em`,
  padding: `${token('spacing.scale.100', '8px')} ${token(
    'spacing.scale.075',
    '6px',
  )}`,
  lineHeight: (gridSize * 2.5) / fontSize,
  wordBreak: 'break-word',
});

const ReadViewContainer: FC = ({ children }) => (
  <div css={readViewContainerStyles}>{children}</div>
);

const wrapperStyles = css({
  padding: `${token('spacing.scale.100', '8px')} ${token(
    'spacing.scale.100',
    '8px',
  )}`,
  fontSize: token('font.size.400', '24px'),
  fontWeight: token('font.weight.bold', '700'),
  lineHeight: token('font.lineHeight.300', '24px'),
});

const textFieldStyles = css({
  fontSize: 'inherit',
  fontWeight: 'inherit',
  lineHeight: 'inherit',
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '& > [data-ds--text-field--input]': {
    fontSize: 'inherit',
    fontWeight: 'inherit',
    lineHeight: 'inherit',
  },
});

const InlineEditExample = () => (
  <div css={wrapperStyles}>
    <InlineEdit
      defaultValue="Field value"
      onConfirm={() => {}}
      editView={(fieldProps) => (
        <Textfield {...fieldProps} autoFocus css={textFieldStyles} />
      )}
      readView={() => <ReadViewContainer>Field value</ReadViewContainer>}
    />
  </div>
);
export default InlineEditExample;
