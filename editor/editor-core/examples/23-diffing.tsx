import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button/standard-button';
import TextArea from '@atlaskit/textarea';
import { codeFontFamily } from '@atlaskit/theme/constants';
import { N900, N10, N40, G75, R75 } from '@atlaskit/theme/colors';
import { diffLines } from 'diff';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.5em;
  height: calc(100% - 30px);

  > * {
    margin: 0.5em 0;
  }
`;

const TextContainer = styled.div`
  flex: 1 1 auto;
  display: flex;
`;

const DiffContainer = styled.div`
  flex: 1 1 auto;
  height: 100%;
  white-space: pre;
  font-family: ${codeFontFamily()};
  color: ${N900};
  background-color: ${N10};
  border: 2px solid ${N40};
  border-radius: 3px;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 16px;
  overflow: auto;
  word-wrap: break-word;
  padding: 6px 6px;
`;

const ButtonContainer = styled.div`
  flex: 0 0 auto;
  display: flex;
  justify-content: flex-end;
`;

const Line = styled.p`
  margin: 0;
`;

const AddedLine = styled(Line)`
  background-color: ${G75};
`;

const RemovedLine = styled(Line)`
  background-color: ${R75};
`;

const Label = styled.p`
  width: 100%;
  text-align: center;
  border-top: 1px solid ${N40};
  font-size: 16px;
  padding-top: 1em;
`;

type LineDiff = {
  value: string;
  count: number;
  added?: boolean;
  removed?: boolean;
};

type State = {
  editMode: boolean;
  diffs: LineDiff[];
  documentOne: string;
  documentTwo: string;
};

export default class DiffingExample extends React.Component<null, State> {
  state = {
    editMode: true,
    diffs: [],
    documentOne: '',
    documentTwo: '',
  };

  onBtnClick = () => {
    const { documentOne, documentTwo, editMode } = this.state;
    if (editMode) {
      this.setState({
        diffs: diffLines(documentOne, documentTwo),
        editMode: false,
      });
    } else {
      this.setState({ editMode: true });
    }
  };

  onDocumentOneChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ documentOne: e.target.value });
  };

  onDocumentTwoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ documentTwo: e.target.value });
  };

  renderDiff = (diffs: LineDiff[]): ReactNode[] =>
    diffs.map((diff, idx) => {
      let LineComponent = Line;
      if (diff.added) {
        LineComponent = AddedLine;
      } else if (diff.removed) {
        LineComponent = RemovedLine;
      }
      return <LineComponent key={idx}>{diff.value}</LineComponent>;
    });

  render() {
    const { editMode, diffs, documentOne, documentTwo } = this.state;
    return (
      <Container>
        <p>Use this example to help diff document structures</p>
        <p>
          Paste any text into the fields and click Compare to see the difference
        </p>
        {editMode ? (
          <TextContainer>
            <TextArea
              value={documentOne}
              isMonospaced
              maxHeight="inherit"
              onChange={this.onDocumentOneChange}
            />
            <TextArea
              value={documentTwo}
              isMonospaced
              maxHeight="inherit"
              onChange={this.onDocumentTwoChange}
            />
          </TextContainer>
        ) : diffs.length === 1 ? (
          <TextContainer>
            <Label>No differences found</Label>
          </TextContainer>
        ) : (
          <DiffContainer>{this.renderDiff(diffs)}</DiffContainer>
        )}
        <ButtonContainer>
          <Button appearance="primary" onClick={this.onBtnClick}>
            {editMode ? 'Compare' : 'Edit'}
          </Button>
        </ButtonContainer>
      </Container>
    );
  }
}
