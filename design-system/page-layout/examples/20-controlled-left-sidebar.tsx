/** @jsx jsx */

import { jsx } from '@emotion/core';

import { Content, LeftSidebar, Main, PageLayout, TopNavigation } from '../src';

const Wrapper = ({
  borderColor,
  children,
  minHeight,
  noOutline,
  noHorizontalScrollbar,
}: {
  borderColor?: string;
  children: React.ReactNode;
  minHeight?: string;
  noOutline?: boolean;
  noHorizontalScrollbar?: boolean;
}) => (
  <div
    css={{
      outline: noOutline ? 'none' : `2px dashed ${borderColor}`,
      outlineOffset: -4,
      padding: 8,
      minHeight: minHeight,
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
      <TopNavigation
        testId="topNavigation"
        id="product-navigation"
        skipLinkTitle="Product Navigation"
        height={60}
        isFixed={false}
      >
        <Wrapper borderColor="blue">
          <h3 css={{ textAlign: 'center' }}>Product Navigation</h3>
        </Wrapper>
      </TopNavigation>
      <Content testId="content">
        <LeftSidebar
          testId="leftSidebar"
          id="space-navigation"
          skipLinkTitle="Space Navigation"
          width={350}
          collapsedState="collapsed"
        >
          <Wrapper noOutline noHorizontalScrollbar>
            <div css={{ minWidth: 50, padding: '0 20px' }}>
              <h4 css={{ textAlign: 'center' }}>Space Navigation</h4>
            </div>
          </Wrapper>
        </LeftSidebar>
        <Main testId="main" id="main" skipLinkTitle="Main Content">
          <Wrapper noOutline noHorizontalScrollbar minHeight="400px">
            <h4 css={{ textAlign: 'center' }}>Main Content</h4>
            <p>
              When you set <b>collapsedState</b> to <b>expanded</b> the
              LeftSidebar will always mount expanded, and when you set{' '}
              <b>collapsedState</b> to <b>collapsed</b> the LeftSidebar will
              always mount collapsed.
              <br />
              Try expanding the LeftSidebar then refreshing the page, the
              LeftSidebar will mount in a <b>collapsed</b> state.
            </p>
            <p>
              When you set <b>width</b> the LeftSidebar will always mount with
              the value passed. You can still resize the LeftSidebar but it will
              ignore what width value exists in localStorage when mounting.
              <br />
              Try expanding and then resizing the LeftSidebar, then refresh the
              page and expand the LeftSidebar again, the LeftSidebar will mount
              with a width of <b>350</b>.
            </p>
          </Wrapper>
        </Main>
      </Content>
    </PageLayout>
  );
};

export default BasicGrid;
