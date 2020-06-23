/** @jsx jsx */

import { jsx } from '@emotion/core';

import {
  Banner,
  Content,
  LeftPanel,
  LeftSidebarWithoutResize,
  Main,
  PageLayout,
  RightPanel,
  RightSidebar,
  TopNavigation,
} from '../src';

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
      {
        <Banner testId="banner" height={60} isFixed={false}>
          <Wrapper borderColor="gold">
            <h3 css={{ textAlign: 'center' }}>Banner</h3>
          </Wrapper>
        </Banner>
      }
      {
        <TopNavigation testId="topNavigation" height={60} isFixed={false}>
          <Wrapper borderColor="blue">
            <h3 css={{ textAlign: 'center' }}>TopNavigation</h3>
          </Wrapper>
        </TopNavigation>
      }
      {
        <LeftPanel testId="leftPanel" isFixed={false} width={125}>
          <Wrapper borderColor="orange">
            <h3 css={{ textAlign: 'center' }}>LeftPanel</h3>
          </Wrapper>
        </LeftPanel>
      }
      <Content testId="content">
        {
          <LeftSidebarWithoutResize
            testId="leftSidebar"
            isFixed={false}
            width={125}
          >
            <Wrapper borderColor="darkgreen">
              <div css={{ minWidth: 50, padding: '0 20px' }}>
                <h4 css={{ textAlign: 'center' }}>LeftSidebar</h4>
              </div>
            </Wrapper>
          </LeftSidebarWithoutResize>
        }
        {
          <Main testId="main">
            <Wrapper borderColor="black">
              <h4 css={{ textAlign: 'center' }}>Main</h4>
            </Wrapper>
          </Main>
        }
        {
          <RightSidebar testId="rightSidebar" isFixed={false} width={125}>
            <Wrapper borderColor="darkgreen">
              <h4 css={{ textAlign: 'center' }}>RightSidebar</h4>
            </Wrapper>
          </RightSidebar>
        }
      </Content>
      {
        <RightPanel testId="rightPanel" isFixed={false} width={125}>
          <Wrapper borderColor="orange">
            <h3 css={{ textAlign: 'center' }}>RightPanel</h3>
          </Wrapper>
        </RightPanel>
      }
    </PageLayout>
  );
};

export default BasicGrid;
