import React from 'react';
import { mount } from 'enzyme';

import Drawer from '../../index';

describe('Drawer portal', () => {
  it('should not be rendered if not open', () => {
    mount(
      <Drawer width="narrow" isOpen={false}>
        <div />
      </Drawer>,
    );

    const renderedPortal = document.querySelector(
      'body > .atlaskit-portal-container .atlaskit-portal',
    );
    expect(renderedPortal).toBe(null);
  });
});
