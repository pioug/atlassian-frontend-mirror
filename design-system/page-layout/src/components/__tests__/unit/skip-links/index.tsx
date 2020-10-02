import React from 'react';

import { render } from '@testing-library/react';

import { SkipLinksContext } from '../../../../controllers/skip-link-context';
import { SkipLinkWrapper, useCustomSkipLink } from '../../../skip-links';
import Banner from '../../../slots/banner';
import PageLayout from '../../../slots/page-layout';

describe('skip links', () => {
  describe('SkipLinkWrapper', () => {
    it('generate 3 links', () => {
      const title = '跳转到';
      const context = {
        skipLinksData: [
          { id: 'left', skipLinkTitle: 'Left panel' },
          { id: 'right', skipLinkTitle: 'Right panel' },
        ],
        registerSkipLink: () => {},
        unregisterSkipLink: () => {},
      };
      const { container } = render(
        <SkipLinksContext.Provider value={context}>
          <SkipLinkWrapper skipLinksLabel={title}></SkipLinkWrapper>,
        </SkipLinksContext.Provider>,
      );

      expect(container.querySelector('h5')!.innerText).toBe(title);
      expect(container.querySelectorAll('a').length).toBe(2);
    });
  });

  describe('Custom skip links', () => {
    it('generates 3 links - 1 through standard slot method, 2 custom, in the correct order', () => {
      const IntroSection = () => {
        useCustomSkipLink('intro-section', 'Intro Section', 0);

        return <div id="intro-section">intro</div>;
      };
      const ExternalFooter = () => {
        useCustomSkipLink('external-footer', 'External Footer', 7);

        return <div id="intro-section">intro</div>;
      };
      const { container, getByText } = render(
        <PageLayout>
          <IntroSection />
          <ExternalFooter />
          {
            <Banner
              testId="banner"
              id="banner"
              skipLinkTitle="Banner"
              height={60}
              isFixed={false}
            >
              <p>Child</p>
            </Banner>
          }
        </PageLayout>,
      );

      expect(container.querySelectorAll('a').length).toBe(3);
      expect(getByText('Intro Section')).toBe(
        container.querySelectorAll('a')[0],
      );
      expect(getByText('Banner')).toBe(container.querySelectorAll('a')[1]);
      expect(getByText('External Footer')).toBe(
        container.querySelectorAll('a')[2],
      );
    });
  });
});
