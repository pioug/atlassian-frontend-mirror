/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { render } from '@testing-library/react';

import { DEFAULT_I18N_PROPS_SKIP_LINKS } from '../../../../common/constants';
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

const slotLabelStyles = css({ textAlign: 'center' });

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

    const component = render(
      <PageLayout>
        <Banner
          testId="banner"
          height={60}
          skipLinkTitle={bannerName}
          id="banner"
        >
          <h3 css={slotLabelStyles}>Banner</h3>
        </Banner>

        <TopNavigation
          testId="topNavigation"
          height={60}
          skipLinkTitle={topNavName}
          id="top-navigation"
        >
          <h3 css={slotLabelStyles}>TopNavigation</h3>
        </TopNavigation>

        <LeftPanel testId="leftPanel" width={200} id="left-panel">
          <h3 css={slotLabelStyles}>LeftPanel</h3>
        </LeftPanel>
      </PageLayout>,
    );

    // Heading
    expect(
      component.getByText(DEFAULT_I18N_PROPS_SKIP_LINKS, { selector: 'p' }),
    ).toBeInTheDocument();

    const nameRegExp = new RegExp(`^${DEFAULT_I18N_PROPS_SKIP_LINKS}`);
    const skipLinks = component.getAllByRole('link', {
      name: nameRegExp,
    });
    expect(skipLinks).toHaveLength(2);
    expect(skipLinks[0]).toHaveTextContent(
      `${DEFAULT_I18N_PROPS_SKIP_LINKS} ${bannerName}`,
    );
    expect(skipLinks[1]).toHaveTextContent(
      `${DEFAULT_I18N_PROPS_SKIP_LINKS} ${topNavName}`,
    );
  });
});
