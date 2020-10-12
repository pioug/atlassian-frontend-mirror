import React, { ComponentType } from 'react';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import styled from 'styled-components';

const FakeTrelloInlineDialog = styled.div`
  width: 280px;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 0 8px;
  display: inline-block;
  margin: 5px;
  vertical-align: top;
  box-shadow: 0 8px 16px -4px rgba(9, 30, 66, 0.25),
    0 0 0 1px rgba(9, 30, 66, 0.08);
`;

const Header = styled.div`
  text-align: center;
  position: relative;
  width: 100%;
  padding: 10px 0;
  color: #5e6c84;
  border-bottom: 1px solid rgba(9, 30, 66, 0.13);
  box-sizing: border-box;
  font-weight: 400;
`;

const Content = styled.div`
  padding: 8px 0;
`;

const CloseButtonWrapper = styled.div`
  position: absolute;
  right: 0px;
  top: 7px;
`;

export const FakeTrelloChrome: ComponentType = ({ children }) => {
  return (
    <FakeTrelloInlineDialog>
      <Header>
        More from Atlassian
        <CloseButtonWrapper>
          <EditorCloseIcon label="Close" />
        </CloseButtonWrapper>
      </Header>
      <Content>{children}</Content>
    </FakeTrelloInlineDialog>
  );
};
