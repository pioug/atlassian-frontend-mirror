/** @jsx jsx */

import { useState } from 'react';

import { jsx } from '@emotion/core';

import {
  Banner,
  Content,
  LeftSidebarWithoutResize,
  Main,
  PageLayout,
  RightPanel,
  TopNavigation,
  useCustomSkipLink,
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

const ListExample = () => {
  let baseId = `list-example`;
  let newId;
  const skipLinkCount = document.querySelectorAll('[data-skip-link-wrapper] a')
    .length;
  const [id, setId] = useState(newId || baseId);
  const [position, setPosition] = useState(2);
  useCustomSkipLink(id, 'List example', position);

  const moveDown = () => {
    const newPos = Math.min(position + 1, skipLinkCount);
    setPosition(newPos);
  };
  const moveUp = () => {
    const newPos = Math.max(position - 1, 0);
    setPosition(newPos);
  };
  const changeId = () => {
    newId = baseId + Date.now();
    setId(newId);
  };

  return (
    <ol id={id}>
      <li>
        This list is an example of an element that you can skipped to that is{' '}
        <em>nested inside</em> the PageLayout component using the
        useCustomSkipLink hook.
      </li>
      <li>
        Current position of <i>List example</i> skip link: <b>{position}</b>
        <button onClick={moveUp}>Move up</button>
        <button onClick={moveDown}>Move down</button>
      </li>
      <li>
        Current id: <b>{id}</b>
        <button onClick={changeId}>Update the id of this section</button>
      </li>
    </ol>
  );
};

// Registering custom skip links
// whose targets live outside PageLayout
const RegisterCustomSkipLinks = () => {
  useCustomSkipLink('external-footer', 'External Footer', 7);
  useCustomSkipLink('intro-section', 'Intro section', 0);

  return null;
};

const BasicGrid = () => {
  return (
    <div>
      <section id="intro-section">
        <p>
          This section isn't part of PageLayout, but you can still use skip
          links to jump to it with the `useCustomSkipLink` hook that is exported
          from PageLayout.
        </p>
      </section>
      <PageLayout>
        <RegisterCustomSkipLinks />
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
          <Main testId="main" id="main" skipLinkTitle="Main Content">
            <Wrapper borderColor="black" minHeight="400px">
              <h4 css={{ textAlign: 'center' }}>Main Content</h4>
              <p>
                Visit the first focusable element on the page to see the skip
                links menu
              </p>
              <ListExample />
            </Wrapper>
          </Main>
        </Content>
        <RightPanel
          testId="rightPanel"
          id="help-panel"
          skipLinkTitle="Help Panel"
          isFixed={false}
          width={125}
        >
          <Wrapper borderColor="orange">
            <h3 css={{ textAlign: 'center' }}>Help Panel</h3>
            <p>It's also possible to</p>
          </Wrapper>
        </RightPanel>
      </PageLayout>
      <footer id="external-footer">
        This footer isn't part of PageLayout, but you can still use skip links
        to jump to it with the `useCustomSkipLink` hook that is exported from
        PageLayout.
      </footer>
    </div>
  );
};

export default BasicGrid;
