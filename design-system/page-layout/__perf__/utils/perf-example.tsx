/** @jsx jsx */

import { css, jsx } from '@emotion/core';

import {
  Content,
  LeftSidebar,
  Main,
  PageLayout,
  TopNavigation,
} from '../../src';

import JiraIntegrationExample from './product-integration/AtlassianNavigation';
import Sidebar from './product-integration/SideNavigation';

const Wrapper = ({
  borderColor,
  children,
  noOutline,
  noHorizontalScrollbar,
}: {
  borderColor: string;
  children: React.ReactNode;
  noOutline?: boolean;
  noHorizontalScrollbar?: boolean;
}) => (
  <div
    css={{
      outline: noOutline ? 'none' : `2px dashed ${borderColor}`,
      outlineOffset: -4,
      padding: 8,
      height: '100%',
      boxSizing: 'border-box',
      overflowY: 'auto',
      overflowX: noHorizontalScrollbar ? 'hidden' : 'auto',
      backgroundColor: 'white',
    }}
  >
    {children}
  </div>
);

const BasicGrid = () => {
  return (
    <PageLayout>
      <TopNavigation height={60} isFixed={true}>
        <JiraIntegrationExample />
      </TopNavigation>
      <Content testId="content">
        <LeftSidebar testId="left-sidebar" isFixed={false} width={450}>
          <div
            css={css`
              height: 100%;
              & nav {
                min-width: 20px;
                overflow-x: hidden;
              }
            `}
          >
            <Sidebar />
          </div>
        </LeftSidebar>
        <Main>
          <Wrapper noOutline borderColor="black">
            <h3 css={{ textAlign: 'center' }}>Main</h3>
          </Wrapper>
        </Main>
      </Content>
    </PageLayout>
  );
};

export default BasicGrid;
