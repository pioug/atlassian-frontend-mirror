import React from 'react';

import { render } from '@testing-library/react';

import Drawer from '../../index';

describe('Drawer portal', () => {
  it('should not be rendered if not open', () => {
    render(
      <Drawer width="narrow" isOpen={false} testId="drawer">
        <div />
      </Drawer>,
    );

    expect(
      document.querySelectorAll('.atlaskit-portal-container > atlaskit-portal')
        .length,
    ).toBe(0);
  });
});
