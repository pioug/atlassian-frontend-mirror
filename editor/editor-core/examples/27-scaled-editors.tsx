/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/react';

import type { ButtonProps } from '@atlaskit/button/standard-button';
import Button from '@atlaskit/button/standard-button';
import { N40, N50A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { default as FullPageExample } from './5-full-page';

const user = css({
  width: '100%',
  padding: `${token('space.150', '12px')} 0px`,
  display: 'flex',
  alignItems: 'center',
});

const avatar = css({
  marginRight: token('space.050', '4px'),
  borderRadius: '50%',
  height: '24px',
  width: '24px',
});
const Author = () => (
  <div css={user}>
    <img css={avatar} src="https://i.imgur.com/zJi8dw9.jpg"></img>
    <span>Philip J. Fry</span>
  </div>
);

const frame = css({
  display: 'flex',
  flexDirection: 'column',
  width: '280px',
  maxWidth: '280px',
  padding: `0px ${token('space.200', '16px')}`,
  border: `1px solid ${token('color.border', N40)}`,
  borderRadius: '4px',
  boxShadow: token('elevation.shadow.overlay', `0 8px 16px -4px ${N50A}`),
});

function ButtonHack(props: ButtonProps) {
  return <Button {...props} />;
}
const paddedButton = css({
  '&&': {
    margin: `${token('space.150', '12px')} 0px ${token(
      'space.150',
      '12px',
    )} auto`,
  },
});

const PaddedButton = (props: ButtonProps) => (
  <ButtonHack {...props} css={paddedButton} />
);

const editorWrapper = css({
  padding: token('space.100', '8px'),
  backgroundColor: 'white',
  border: `1px solid ${token('color.border', N40)}`,
  borderRadius: '4px',
  '.ProseMirror': {
    minHeight: '125px',
  },
});

const InlineCommentEditor = (props: { editor: React.ReactNode }) => (
  <div css={frame}>
    <Author />
    <div css={editorWrapper}>{props.editor}</div>
    <PaddedButton appearance="primary">Save</PaddedButton>
  </div>
);

const editor = (
  <FullPageExample
    editorProps={{
      appearance: 'chromeless',
      placeholder: '',
      contentComponents: undefined,
      disabled: false,
    }}
  />
);

const ScaledEditorsExample = () => (
  <div style={{ padding: token('space.250', '20px') }}>
    <InlineCommentEditor editor={editor} />
  </div>
);

export default ScaledEditorsExample;
