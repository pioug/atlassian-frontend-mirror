import React from 'react';

import { render } from '@testing-library/react';

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
} from '../../../index';

describe('page-layout', () => {
  it('should have data attribute for all the page layout slots', () => {
    render(
      <PageLayout testId="grid">
        <Banner height={60}>
          <h3>Banner</h3>
        </Banner>
        <TopNavigation testId="component" height={50}>
          Contents
        </TopNavigation>
        <LeftPanel width={200}>left panel</LeftPanel>
        <Content testId="content">
          <LeftSidebarWithoutResize testId="component" width={200}>
            Contents
          </LeftSidebarWithoutResize>
          <Main testId="main">Main</Main>
          <RightSidebar width={50}>Contents</RightSidebar>
        </Content>
        <RightPanel width={200}>Right panel</RightPanel>
      </PageLayout>,
    );
    const elements = document.querySelectorAll('[data-ds--page-layout--slot]');
    expect(elements.length).toEqual(7);
  });

  it('renders skip links panel', () => {
    const bannerName = 'Banner panel';
    const topNavName = 'Top Navigation panel';

    const { container } = render(
      <PageLayout>
        <Banner
          testId="banner"
          height={60}
          skipLinkTitle={bannerName}
          id="banner"
        >
          <h3 css={{ textAlign: 'center' }}>Banner</h3>
        </Banner>

        <TopNavigation
          testId="topNavigation"
          height={60}
          skipLinkTitle={topNavName}
          id="top-navigation"
        >
          <h3 css={{ textAlign: 'center' }}>TopNavigation</h3>
        </TopNavigation>

        <LeftPanel testId="leftPanel" width={200} id="left-panel">
          <h3 css={{ textAlign: 'center' }}>LeftPanel</h3>
        </LeftPanel>
      </PageLayout>,
    );

    const panel = container.querySelector('div[data-skip-link-wrapper="true"]');
    const links = panel!.querySelectorAll('ol li a');

    expect(panel!.querySelector('h5')!.innerText).toBe('Skip to:');
    expect(links.length).toBe(2);

    expect(links[0]!.getAttribute('title')).toEqual(`Skip to: ${bannerName}`);
    expect(links[1]!.getAttribute('title')).toEqual(`Skip to: ${topNavName}`);
  });
});
