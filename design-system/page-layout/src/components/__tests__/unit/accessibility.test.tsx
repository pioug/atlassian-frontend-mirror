import React from 'react';

import { render, screen } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';
import { token } from '@atlaskit/tokens';

import { SlotLabel, SlotWrapper } from '../../../../examples/common';
import {
  Banner,
  Content,
  LeftSidebar,
  LeftSidebarWithoutResize,
  Main,
  PageLayout,
  RightPanel,
  TopNavigation,
} from '../../../index';

let testId: string = 'basic-layout';
const renderPageLayout = (isBasic: boolean = true) => {
  render(
    <PageLayout testId={`${testId}-pageLayout`}>
      {isBasic && (
        <Banner
          testId={`${testId}-banner`}
          id="banner"
          skipLinkTitle="Banner"
          height={60}
          isFixed={false}
        >
          <SlotWrapper borderColor={token('color.border.accent.yellow')}>
            <SlotLabel>Banner</SlotLabel>
          </SlotWrapper>
        </Banner>
      )}
      <TopNavigation
        testId={`${testId}-topNavigation`}
        id="product-navigation"
        skipLinkTitle="Product Navigation"
        height={60}
        isFixed={false}
      >
        <SlotWrapper borderColor={token('color.border.accent.blue')}>
          <SlotLabel>Product Navigation</SlotLabel>
        </SlotWrapper>
      </TopNavigation>
      <Content testId="content">
        {isBasic && (
          <LeftSidebarWithoutResize
            testId={`${testId}-leftSidebar`}
            id="space-navigation"
            skipLinkTitle="Space Navigation"
            isFixed={false}
            width={125}
          >
            <SlotWrapper
              borderColor={token('color.border.accent.green')}
              hasExtraPadding
            >
              <SlotLabel isSmall>Space Navigation</SlotLabel>
            </SlotWrapper>
          </LeftSidebarWithoutResize>
        )}
        {!isBasic && (
          <LeftSidebar
            isFixed={false}
            width={450}
            id="project-navigation"
            skipLinkTitle="Project Navigation"
            testId={`${testId}-left-sidebar`}
            resizeButtonLabel="Resize Left Navigation"
          >
            <SlotWrapper>
              <SlotLabel>Left Navigation Content</SlotLabel>
            </SlotWrapper>
          </LeftSidebar>
        )}
        <Main testId={`${testId}-main`} id="main" skipLinkTitle="Main Content">
          <SlotWrapper borderColor={token('color.border')} minHeight={400}>
            <SlotLabel isSmall>Main Content</SlotLabel>
            <p>
              Visit the first focusable element on the page to see the skip
              links menu
            </p>
          </SlotWrapper>
        </Main>
      </Content>
      {isBasic && (
        <RightPanel
          testId={`${testId}-righPanels`}
          id="help-panel"
          skipLinkTitle="Help Panel"
          isFixed={false}
          width={125}
        >
          <SlotWrapper borderColor={token('color.border.accent.orange')}>
            <SlotLabel>Help Panel</SlotLabel>
          </SlotWrapper>
        </RightPanel>
      )}
    </PageLayout>,
  );
};

describe('Page Layout Accessibility', () => {
  it('Basic layout should pass basic aXe audit', async () => {
    renderPageLayout();
    const container = screen.getByTestId('basic-layout-pageLayout');
    await axe(container);
  });

  // DSP-12584 - once the axe-core rule is updated (using button element
  // with a slider/separator role), we can remove `xit`
  xit('Integrated layout should pass basic aXe audit', async () => {
    testId = 'integrated-layout';
    renderPageLayout(false);
    const container = screen.getByTestId('integrated-layout-pageLayout');
    await axe(container);
  });

  it('Main content slot has role="main', async () => {
    renderPageLayout();
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });
});
