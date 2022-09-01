/** @jsx jsx */
import { FC, useState } from 'react';

import { css, jsx } from '@emotion/react';

import Textfield from '@atlaskit/textfield';
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import InlineEdit from '../src';

const readViewContainerStyles = css({
  margin: '8px 0px',
});

const ReadViewContainer: FC = ({ children }) => (
  <div css={readViewContainerStyles}>{children}</div>
);

const messageStyles = css({
  margin: '8px 0',
  padding: '8px',
  backgroundColor: token('color.background.danger.bold', 'orangered'),
  bordeRadius: '3px',
  color: token('color.text.inverse', 'white'),
});

const Message: FC = ({ children }) => <div css={messageStyles}>{children}</div>;

const headingOneStyles = css({
  fontSize: '24px',
  fontWeight: 500,
  lineHeight: 'inherit',
});

const HeadingOne: FC = ({ children }) => (
  <h1 css={headingOneStyles}>{children}</h1>
);

const textFieldStyles = css({
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '& > [data-ds--text-field--input]': {
    margin: '-11px -4px',
    padding: '8px 6px',
    fontSize: 24,
  },
});

const wrapperStyles = css({
  padding: `${gridSize()}px ${gridSize()}px ${gridSize() * 6}px`,
});

const InlineEditExample = () => {
  const [editValue, setEditValue] = useState('Field value');

  return (
    <div css={wrapperStyles}>
      <InlineEdit
        defaultValue={editValue}
        label="Inline edit"
        editView={({ errorMessage, ...fieldProps }) => (
          <Textfield {...fieldProps} autoFocus css={textFieldStyles} />
        )}
        readView={() => (
          <ReadViewContainer>
            <HeadingOne>{editValue || 'Click to enter value'}</HeadingOne>
          </ReadViewContainer>
        )}
        onConfirm={(value) => setEditValue(value)}
      />

      <Message>Some content beneath a inline edit as a placeholder</Message>
    </div>
  );
};

export default InlineEditExample;
