/** @jsx jsx */
import { Fragment } from 'react';

import { CSSObject, jsx } from '@emotion/core';

import {
  Content,
  LeftSidebarWithoutResize,
  Main,
  PageLayout,
  TopNavigation,
} from '../src';

const scrollableContentCSS = {
  height: '2rem',
  width: '80%',
  backgroundColor: 'papayawhip',
  margin: '2rem auto',
  boxSizing: 'border-box',
  borderRadius: 3,
  ':nth-of-type(4n)': {
    backgroundColor: 'cornflowerblue',
    position: 'sticky',
    textAlign: 'center',
    padding: 4,
    top: 65,
    '&::after': {
      content: '"Stickied element"',
      color: '#FFF',
    },
  },
} as CSSObject;

const topNavCSS = {
  backgroundColor: '#FFF',
  boxSizing: 'border-box',
  padding: '1rem',
  borderBottom: '1px solid lightgray',
} as CSSObject;

const ScrollableContent = () => {
  const arr = new Array(50);

  return <Fragment>{arr.fill(<div css={scrollableContentCSS} />)}</Fragment>;
};

const WithStickyElement = () => {
  return (
    <PageLayout>
      <TopNavigation testId="topNavigation" height={60}>
        <div css={topNavCSS}>
          <h3 css={{ textAlign: 'center' }}>TopNavigation</h3>
        </div>
      </TopNavigation>
      <Content testId="content">
        <LeftSidebarWithoutResize testId="leftSidebar" width={250}>
          <div css={{ padding: '0 20px' }}>
            <h3 css={{ textAlign: 'center' }}>LeftSidebar</h3>
          </div>
        </LeftSidebarWithoutResize>
        <Main testId="main">
          <h3 css={{ textAlign: 'center' }}>Main</h3>
          <ScrollableContent />
        </Main>
      </Content>
    </PageLayout>
  );
};

export default WithStickyElement;
