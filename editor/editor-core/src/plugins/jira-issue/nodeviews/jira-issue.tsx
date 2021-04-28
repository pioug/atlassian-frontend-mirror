import React from 'react';
import styled from 'styled-components';
import { Node as PMNode } from 'prosemirror-model';
import { JiraIcon } from '@atlaskit/logo/jira-icon';
import { borderRadius } from '@atlaskit/theme/constants';
import { N30, N50 } from '@atlaskit/theme/colors';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';

const WrapperNode = styled.span`
  align-items: center;
  background: ${N30};
  border: 1px solid ${N50};
  border-radius: ${borderRadius()}px;
  box-sizing: border-box;
  cursor: default;
  display: inline-flex;
  font-size: ${relativeFontSizeToBase16(13)};
  margin: 0 2px;
  min-height: 24px;
  padding: 0 4px;
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;

  .ProseMirror-selectednode & {
    background: ${N50};
    outline: none;
  }
`;

const JiraChildNode = styled.span`
  display: inline-block;
  color: #707070;
  line-height: 24px;
  vertical-align: top;

  &::before {
    color: black;
    content: 'JIRA | ';
  }
`;

const SvgChildNode = styled.span`
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
    <WrapperNode>
      <SvgChildNode>
        <JiraIcon size="small" />
      </SvgChildNode>
      <JiraChildNode>{issueKey}</JiraChildNode>
    </WrapperNode>
  );
}
