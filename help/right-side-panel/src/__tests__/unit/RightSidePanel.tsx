import React from 'react';
import { mount } from 'enzyme';
import Page from '@atlaskit/page';
import { RightSidePanel, FlexContainer, ContentWrapper } from '../../index';
import { RightSidePanelDrawer } from '../../components/RightSidePanel/styled';

describe('RightSidePanel', () => {
  let flexContainerElm: HTMLElement | null;
  beforeEach(() => {
    let flexContainer = mount(
      <FlexContainer id="RightSidePanelTest">
        <ContentWrapper>
          <Page />
        </ContentWrapper>
      </FlexContainer>,
    );
    document.body.innerHTML += flexContainer.html();

    flexContainerElm = document.getElementById('RightSidePanelTest');
  });

  describe('Render only if the attachPanelTo prop is defined and valid', () => {
    it('Should render if the attachPanelTo value is correct', () => {
      const rightSidePanelWithWrapper = mount(
        <ContentWrapper>
          <Page />
          <RightSidePanel isOpen={true} attachPanelTo="RightSidePanelTest">
            <h1>Content</h1>
          </RightSidePanel>
        </ContentWrapper>,
        { attachTo: flexContainerElm },
      );

      expect(
        rightSidePanelWithWrapper.find(RightSidePanelDrawer).length,
      ).toEqual(1);
    });

    it('Should not render if the attachPanelTo value is not correct', () => {
      const rightSidePanelWithWrapper = mount(
        <FlexContainer id="RightSidePanelTest">
          <ContentWrapper>
            <Page />
            <RightSidePanel isOpen={true} attachPanelTo="otherId">
              <h1>Content</h1>
            </RightSidePanel>
          </ContentWrapper>
        </FlexContainer>,
        { attachTo: flexContainerElm },
      );

      expect(
        rightSidePanelWithWrapper.find(RightSidePanelDrawer).length,
      ).toEqual(0);
    });

    it('Should render content in the right-side-panel', () => {
      const rightSidePanelWithWrapper = mount(
        <FlexContainer id="RightSidePanelTest">
          <ContentWrapper>
            <Page />
            <RightSidePanel isOpen={true} attachPanelTo="RightSidePanelTest">
              <h1>Content</h1>
            </RightSidePanel>
          </ContentWrapper>
        </FlexContainer>,
        { attachTo: flexContainerElm },
      );

      expect(rightSidePanelWithWrapper.find('h1').html()).toEqual(
        '<h1>Content</h1>',
      );
    });

    it('RightSidePanelDrawer should not be visible if isOpen = false', () => {
      const rightSidePanelWithWrapper = mount(
        <FlexContainer id="RightSidePanelTest">
          <ContentWrapper>
            <Page />
            <RightSidePanel isOpen={true} attachPanelTo="RightSidePanelTest">
              <h1>Content</h1>
            </RightSidePanel>
          </ContentWrapper>
        </FlexContainer>,
        { attachTo: flexContainerElm },
      );

      expect(
        rightSidePanelWithWrapper.find(RightSidePanelDrawer).length,
      ).toEqual(1);
    });
  });
});
