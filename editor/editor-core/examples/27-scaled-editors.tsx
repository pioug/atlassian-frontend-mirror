/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import Button, { ButtonProps } from '@atlaskit/button/standard-button';
import { N40, N50A } from '@atlaskit/theme/colors';
import { default as FullPageExample } from './5-full-page';

const user = css`
  width: 100%;
  padding: 12px 0px;
  display: flex;
  align-items: center;
`;

const avatar = css`
  margin-right: 4px;
  border-radius: 50%;
  height: 24px;
  width: 24px;
`;
const Author = () => (
  <div css={user}>
    <img css={avatar} src="https://i.imgur.com/zJi8dw9.jpg"></img>
    <span>Philip J. Fry</span>
  </div>
);

const frame = css`
  display: flex;
  flex-direction: column;
  width: 280px;
  max-width: 280px;
  padding: 0px 18px;
  border: 1px solid ${N40};
  border-radius: 4px;
  box-shadow: 0 8px 16px -4px ${N50A};
`;

function ButtonHack(props: ButtonProps) {
  return <Button {...props} />;
}
const paddedButton = css`
  /* increase specificity to override default Button styles */
  && {
    margin: 10px 0px 10px auto;
  }
`;

const PaddedButton = (props: ButtonProps) => (
  <ButtonHack {...props} css={paddedButton} />
);

const editorWrapper = css`
  padding: 8px;
  background-color: white;
  border: 1px solid ${N40};
  border-radius: 4px;

  .ProseMirror {
    min-height: 125px;
  }
`;

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
  <div style={{ padding: '20px' }}>
    <InlineCommentEditor editor={editor} />
  </div>
);

export default ScaledEditorsExample;
