/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { JiraIcon } from '@atlaskit/logo/jira-icon';
import { borderRadius } from '@atlaskit/theme/constants';
import { N30, N50 } from '@atlaskit/theme/colors';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

const wrapperNode = css`
  align-items: center;
  background: ${token('color.background.neutral', N30)};
  border: 1px solid ${token('color.border', N50)};
  border-radius: ${borderRadius()}px;
  box-sizing: border-box;
  cursor: default;
  display: inline-flex;
  font-size: ${relativeFontSizeToBase16(13)};
  margin: 0 ${token('space.025', '2px')};
  min-height: 24px;
  padding: 0 ${token('space.050', '4px')};
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;

  .ProseMirror-selectednode & {
    background: ${token('color.background.selected', N50)};
    outline: none;
  }
`;

const jiraChildNode = css`
  display: inline-block;
  color: ${token('color.text.subtlest', '#707070')};
  line-height: 24px;
  vertical-align: top;

  &::before {
    color: ${token('color.text', 'black')};
    content: 'JIRA | ';
  }
`;

const svgChildNode = css`
  display: inline-block;
  height: 24px;
  vertical-align: top;
  width: 24px;

  & > div {
    height: 24px;
    width: 24px;
  }
`;

export interface Props {
  node: PMNode;
}

export default function JIRAIssueNode(props: Props) {
  const {
    node: {
      attrs: { issueKey },
    },
  } = props;

  return (
    <span css={wrapperNode} data-testid="jira-issue-node">
      <span css={svgChildNode}>
        <JiraIcon size="small" />
      </span>
      <span css={jiraChildNode}>{issueKey}</span>
    </span>
  );
}
