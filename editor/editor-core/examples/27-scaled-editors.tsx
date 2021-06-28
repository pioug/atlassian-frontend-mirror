import React from 'react';
import styled from 'styled-components';
import Button, { ButtonProps } from '@atlaskit/button/standard-button';
import { N40, N50A } from '@atlaskit/theme/colors';
import { default as FullPageExample } from './5-full-page';

const User = styled.div`
  width: 100%;
  padding: 12px 0px;
  display: flex;
  align-items: center;
`;

const Avatar = styled.img`
  margin-right: 4px;
  border-radius: 50%;
  height: 24px;
  width: 24px;
`;
const Author: React.FunctionComponent<{}> = () => (
  <User>
    <Avatar src="https://i.imgur.com/zJi8dw9.jpg"></Avatar>
    <span>Philip J. Fry</span>
  </User>
);

const Frame = styled.div`
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
const PaddedButton = styled(ButtonHack)`
  /* increase specificity to override default Button styles */
  && {
    margin: 10px 0px 10px auto;
  }
`;

const EditorWrapper = styled.div`
  padding: 8px;
  background-color: white;
  border: 1px solid ${N40};
  border-radius: 4px;

  .ProseMirror {
    min-height: 125px;
  }
`;

const InlineCommentEditor: React.FunctionComponent<{
  editor: JSX.Element;
}> = (props) => (
  <Frame>
    <Author />
    <EditorWrapper>{props.editor}</EditorWrapper>
    <PaddedButton appearance="primary">Save</PaddedButton>
  </Frame>
);

export default class ScaledEditorsExample extends React.Component {
  render() {
    const editor = (
      <FullPageExample
        appearance="chromeless"
        placeholder=""
        placeholderHints={[]}
        contentComponents={undefined}
        disabled={false}
      />
    );

    return (
      <div style={{ padding: '20px' }}>
        <InlineCommentEditor editor={editor} />
      </div>
    );
  }
}
