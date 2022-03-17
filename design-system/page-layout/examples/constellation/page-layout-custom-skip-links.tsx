/** @jsx jsx */

import { useState } from 'react';

import { jsx } from '@emotion/core';

import { token } from '@atlaskit/tokens';

import {
  Banner,
  Content,
  LeftSidebarWithoutResize,
  Main,
  PageLayout,
  RightPanel,
  TopNavigation,
  useCustomSkipLink,
} from '../../src';
import { SlotLabel, SlotWrapper } from '../common';

const baseId = 'list-example';
const ListExample = () => {
  const skipLinkCount = document.querySelectorAll('[data-skip-link-wrapper] a')
    .length;
  const [id, setId] = useState(baseId);
  const [position, setPosition] = useState(2);
  useCustomSkipLink(id, 'List example', position);

  const moveDown = () => {
    setPosition((pos) => Math.min(pos + 1, skipLinkCount));
  };
  const moveUp = () => {
    setPosition((pos) => Math.max(pos - 1, 0));
  };
  const changeId = () => {
    setId(`${baseId}${Date.now()}`);
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
          <SlotWrapper
            borderColor={token('color.border.accent.yellow', 'gold')}
          >
            <SlotLabel>Banner</SlotLabel>
          </SlotWrapper>
        </Banner>
        <TopNavigation
          testId="topNavigation"
          id="product-navigation"
          skipLinkTitle="Product Navigation"
          height={60}
          isFixed={false}
        >
          <SlotWrapper borderColor={token('color.border.accent.blue', 'blue')}>
            <SlotLabel>Product Navigation</SlotLabel>
          </SlotWrapper>
        </TopNavigation>
        <Content testId="content">
          <LeftSidebarWithoutResize
            testId="leftSidebar"
            id="space-navigation"
            skipLinkTitle="Space Navigation"
            isFixed={false}
            width={125}
          >
            <SlotWrapper
              borderColor={token('color.border.accent.green', 'darkgreen')}
              hasExtraPadding
            >
              <SlotLabel isSmall>Space Navigation</SlotLabel>
            </SlotWrapper>
          </LeftSidebarWithoutResize>
          <Main testId="main" id="main" skipLinkTitle="Main Content">
            <SlotWrapper
              borderColor={token('color.border', 'black')}
              minHeight={400}
            >
              <SlotLabel isSmall>Main Content</SlotLabel>
              <p>
                Visit the first focusable element on the page to see the skip
                links menu
              </p>
              <ListExample />
            </SlotWrapper>
          </Main>
        </Content>
        <RightPanel
          testId="rightPanel"
          id="help-panel"
          skipLinkTitle="Help Panel"
          isFixed={false}
          width={125}
        >
          <SlotWrapper
            borderColor={token('color.border.accent.orange', 'orange')}
          >
            <SlotLabel>Help Panel</SlotLabel>
            <p>It's also possible to</p>
          </SlotWrapper>
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
