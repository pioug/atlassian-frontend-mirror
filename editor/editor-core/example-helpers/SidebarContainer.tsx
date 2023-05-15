/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { N70 } from '@atlaskit/theme/colors';
import { ConfluenceIcon } from '@atlaskit/logo/confluence-icon';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';

export const app = css`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const sidebar = css`
  flex: 0 0 64px;
  color: ${N70};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
`;

export const editorWrapper = css`
  flex: 1 1 calc(100% - 64px);
`;

/**
 * Creates layout with 64px sidebar and main container where children are added
 */
export default class SidebarContainer extends React.Component {
  render() {
    return (
      <div css={app}>
        <div css={sidebar}>
          <ConfluenceIcon label="Confluence" />
          <QuestionCircleIcon label="Help" />
        </div>
        <div css={editorWrapper}>{this.props.children}</div>
      </div>
    );
  }
}

export function withSidebarContainer<T extends {}>(
  Component: React.ComponentType<T>,
): React.ComponentType<T> {
  return (props) => (
    <SidebarContainer>
      <Component {...props} />
    </SidebarContainer>
  );
}
