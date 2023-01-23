/** @jsx jsx */
import { FC, useState } from 'react';

import { css, jsx } from '@emotion/react';

import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

import InlineEdit from '../src';

const readViewContainerStyles = css({
  margin: `${token('spacing.scale.100', '8px')} ${token(
    'spacing.scale.0',
    '0px',
  )}`,
});

const ReadViewContainer: FC = ({ children }) => (
  <div css={readViewContainerStyles}>{children}</div>
);

const messageStyles = css({
  margin: `${token('spacing.scale.100', '8px')} ${token(
    'spacing.scale.0',
    '0px',
  )}`,
  // TODO Delete this comment after verifying spacing token -> previous value `'8px'`
  padding: token('spacing.scale.100', '8px'),
  backgroundColor: token('color.background.danger.bold', 'orangered'),
  bordeRadius: '3px',
  color: token('color.text.inverse', 'white'),
});

const Message: FC = ({ children }) => <div css={messageStyles}>{children}</div>;

const headingOneStyles = css({
  fontSize: token('font.size.400', '24px'),
  fontWeight: token('font.weight.medium', '500'),
  lineHeight: 'inherit',
});

const HeadingOne: FC = ({ children }) => (
  <h1 css={headingOneStyles}>{children}</h1>
);

const textFieldStyles = css({
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '& > [data-ds--text-field--input]': {
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
    margin: '-11px -4px',
    padding: `${token('spacing.scale.100', '8px')} ${token(
      'spacing.scale.075',
      '6px',
    )}`,
    fontSize: token('font.size.400', '24px'),
  },
});

const wrapperStyles = css({
  padding: `${token('spacing.scale.100', '8px')} ${token(
    'spacing.scale.100',
    '8px',
  )} ${token('spacing.scale.600', '48px')}`,
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
