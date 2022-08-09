/** @jsx jsx */

import { css, jsx } from '@emotion/core';

import { token } from '@atlaskit/tokens';

import {
  Content,
  LeftSidebar,
  Main,
  PageLayout,
  TopNavigation,
} from '../../src';

import JiraIntegrationExample from './product-integration/atlassian-navigation';
import Sidebar from './product-integration/side-navigation';

const wrapperStyles = css({
  boxSizing: 'border-box',
  height: '100%',
  padding: 8,
  backgroundColor: token('color.background.neutral.subtle', 'white'),
  outlineOffset: -4,
  overflowY: 'auto',
});

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
    css={wrapperStyles}
    style={{
      outline: noOutline ? 'none' : `2px dashed ${borderColor}`,
      overflowX: noHorizontalScrollbar ? 'hidden' : 'auto',
    }}
  >
    {children}
  </div>
);

const sidebarWrapperStyles = css({
  height: '100%',
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  nav: {
    minWidth: 20,
    overflowX: 'hidden',
  },
});

const slotLabelStyles = css({ textAlign: 'center' });

const BasicGrid = () => {
  return (
    <PageLayout>
      <TopNavigation height={60} isFixed={true}>
        <JiraIntegrationExample />
      </TopNavigation>
      <Content testId="content">
        <LeftSidebar testId="left-sidebar" isFixed={false} width={450}>
          <div css={sidebarWrapperStyles}>
            <Sidebar />
          </div>
        </LeftSidebar>
        <Main>
          <Wrapper noOutline borderColor={token('color.border', 'black')}>
            <h3 css={slotLabelStyles}>Main</h3>
          </Wrapper>
        </Main>
      </Content>
    </PageLayout>
  );
};

export default BasicGrid;
