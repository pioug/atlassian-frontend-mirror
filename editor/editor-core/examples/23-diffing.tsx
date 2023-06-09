/** @jsx jsx */
import React, { ReactNode } from 'react';
import { css, jsx } from '@emotion/react';
import Button from '@atlaskit/button/standard-button';
import TextArea from '@atlaskit/textarea';
import { codeFontFamily } from '@atlaskit/theme/constants';
import { N900, N10, N40, G75, R75 } from '@atlaskit/theme/colors';
import { diffLines, Change } from 'diff';

const container = css`
  display: flex;
  flex-direction: column;
  margin: 0.5em;
  height: calc(100% - 30px);

  > * {
    margin: 0.5em 0;
  }
`;

const textContainer = css`
  flex: 1 1 auto;
  display: flex;
`;

const diffContainer = css`
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

const buttonContainer = css`
  flex: 0 0 auto;
  display: flex;
  justify-content: flex-end;
`;

const lineStyle = css`
  margin: 0;
`;

const addedLineStyle = css`
  background-color: ${G75};
`;

const removedLineStyle = css`
  background-color: ${R75};
`;

type LineProps = {
  children: React.ReactNode;
};

const Line = ({ children }: LineProps) => <p css={lineStyle}>{children}</p>;
const AddedLine = ({ children }: LineProps) => (
  <p css={[lineStyle, addedLineStyle]}>{children}</p>
);
const RemovedLine = ({ children }: LineProps) => (
  <p css={[lineStyle, removedLineStyle]}>{children}</p>
);

const label = css`
  width: 100%;
  text-align: center;
  border-top: 1px solid ${N40};
  font-size: 16px;
  padding-top: 1em;
`;

type State = {
  editMode: boolean;
  diffs: Change[];
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

  renderDiff = (diffs: Change[]): ReactNode[] =>
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
      <div css={container}>
        <p>Use this example to help diff document structures</p>
        <p>
          Paste any text into the fields and click Compare to see the difference
        </p>
        {editMode ? (
          <div css={textContainer}>
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
          </div>
        ) : diffs.length === 1 ? (
          <div css={textContainer}>
            <p css={label}>No differences found</p>
          </div>
        ) : (
          <div css={diffContainer}>{this.renderDiff(diffs)}</div>
        )}
        <div css={buttonContainer}>
          <Button appearance="primary" onClick={this.onBtnClick}>
            {editMode ? 'Compare' : 'Edit'}
          </Button>
        </div>
      </div>
    );
  }
}
