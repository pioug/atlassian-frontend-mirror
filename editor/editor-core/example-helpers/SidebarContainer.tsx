import React from 'react';
import styled from 'styled-components';
import { N70 } from '@atlaskit/theme/colors';
import { ConfluenceIcon } from '@atlaskit/logo/confluence-icon';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';

export const App = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const Sidebar = styled.div`
  flex: 0 0 64px;
  color: ${N70};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
`;

export const EditorWrapper = styled.div`
  flex: 1 1 calc(100% - 64px);
`;

/**
 * Creates layout with 64px sidebar and main container where children are added
 */
export default class SidebarContainer extends React.Component {
  render() {
    return (
      <App>
        <Sidebar>
          <ConfluenceIcon label="Confluence" />
          <QuestionCircleIcon label="Help" />
        </Sidebar>
        <EditorWrapper>{this.props.children}</EditorWrapper>
      </App>
    );
  }
}

export function withSidebarContainer<T>(
  Component: React.ComponentType<T>,
): React.ComponentType<T> {
  return (props) => (
    <SidebarContainer>
      <Component {...props} />
    </SidebarContainer>
  );
}
