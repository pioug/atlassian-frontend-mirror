import React from 'react';

import { render } from '@testing-library/react';

import { Banner, LeftPanel, PageLayout, TopNavigation } from '../../../index';

describe('page-layout', () => {
  it('basic renders', () => {
    const bannerName = 'Banner panel';
    const bannerContent = 'This is the banner';

    const { getByTestId } = render(
      <PageLayout>
        <Banner
          testId="banner"
          height={60}
          skipLinkTitle={bannerName}
          id="banner"
        >
          <h3 css={{ textAlign: 'center' }}>{bannerContent}</h3>
        </Banner>
      </PageLayout>,
    );

    expect(getByTestId('banner').firstElementChild!.textContent).toEqual(
      bannerContent,
    );
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
