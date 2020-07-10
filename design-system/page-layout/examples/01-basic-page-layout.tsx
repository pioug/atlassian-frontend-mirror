/** @jsx jsx */

import { jsx } from '@emotion/core';

import {
  Banner,
  Content,
  LeftSidebarWithoutResize,
  Main,
  PageLayout,
  RightPanel,
  TopNavigation,
} from '../src';

const Wrapper = ({
  borderColor,
  children,
  minHeight,
  noOutline,
  noHorizontalScrollbar,
}: {
  borderColor: string;
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
      {
        <Banner
          testId="banner"
          id="banner"
          skipLinkTitle="Banner"
          height={60}
          isFixed={false}
        >
          <Wrapper borderColor="gold">
            <h3 css={{ textAlign: 'center' }}>Banner</h3>
          </Wrapper>
        </Banner>
      }
      {
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
      }
      <Content testId="content">
        {
          <LeftSidebarWithoutResize
            testId="leftSidebar"
            id="space-navigation"
            skipLinkTitle="Space Navigation"
            isFixed={false}
            width={125}
          >
            <Wrapper borderColor="darkgreen">
              <div css={{ minWidth: 50, padding: '0 20px' }}>
                <h4 css={{ textAlign: 'center' }}>Space Navigation</h4>
              </div>
            </Wrapper>
          </LeftSidebarWithoutResize>
        }
        {
          <Main testId="main" id="main" skipLinkTitle="Main Content">
            <Wrapper borderColor="black" minHeight="400px">
              <h4 css={{ textAlign: 'center' }}>Main Content</h4>
              <p>
                Visit the first focusable element on the page to see the skip
                links menu
              </p>
            </Wrapper>
          </Main>
        }
      </Content>
      {
        <RightPanel
          testId="rightPanel"
          id="help-panel"
          skipLinkTitle="Help Panel"
          isFixed={false}
          width={125}
        >
          <Wrapper borderColor="orange">
            <h3 css={{ textAlign: 'center' }}>Help Panel</h3>
          </Wrapper>
        </RightPanel>
      }
    </PageLayout>
  );
};

export default BasicGrid;
