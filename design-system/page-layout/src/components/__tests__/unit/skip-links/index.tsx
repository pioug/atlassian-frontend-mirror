import React from 'react';

import { render } from '@testing-library/react';

import { SkipLinksContext } from '../../../../controllers/skip-link-context';
import { SkipLinkWrapper } from '../../../skip-links';

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
          <SkipLinkWrapper i18n={{ title }}></SkipLinkWrapper>,
        </SkipLinksContext.Provider>,
      );

      expect(container.querySelector('h5')!.innerText).toBe(title);
      expect(container.querySelectorAll('a').length).toBe(2);
    });
  });
});
