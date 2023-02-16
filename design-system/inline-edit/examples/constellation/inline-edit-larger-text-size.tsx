/** @jsx jsx */
import { useState } from 'react';

import { css, jsx } from '@emotion/react';

import Textfield from '@atlaskit/textfield';
import {
  fontSize as getFontSize,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import InlineEdit from '../../src';

const fontSize = getFontSize();
const gridSize = getGridSize();

const readViewContainerStyles = css({
  display: 'flex',
  maxWidth: '100%',
  minHeight: `${(gridSize * 2.5) / fontSize}em`,
  padding: `${token('space.100', '8px')} ${token('space.075', '6px')}`,
  lineHeight: (gridSize * 2.5) / fontSize,
  wordBreak: 'break-word',
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

const wrapperStyles = css({
  padding: token('space.100', '8px'),
  fontSize: '24px',
  fontWeight: 'bold',
  lineHeight: '24px',
});

const InlineEditExample = () => {
  const [editValue, setEditValue] = useState('');

  return (
    <div css={wrapperStyles}>
      <InlineEdit
        defaultValue={editValue}
        editView={({ errorMessage, ...fieldProps }) => (
          <Textfield {...fieldProps} autoFocus css={textFieldStyles} />
        )}
        readView={() => (
          <div css={readViewContainerStyles} data-testid="read-view">
            {editValue || 'Click to enter text'}
          </div>
        )}
        onConfirm={(value) => {
          setEditValue(value);
        }}
      />
    </div>
  );
};

export default InlineEditExample;
