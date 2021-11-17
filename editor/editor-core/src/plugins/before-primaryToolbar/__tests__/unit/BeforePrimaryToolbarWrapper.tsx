import React from 'react';
import { render } from '@testing-library/react';

import { BeforePrimaryToolbarWrapper } from '../../ui/BeforePrimaryToolbarWrapper';

describe('Before Primary Toolbar Components', () => {
  it('renders save indicator plugin wrapper and beforePrimaryToolbarComponents', () => {
    const mockComponent = <div data-testid="mock-component" />;
    const { getByTestId } = render(
      <BeforePrimaryToolbarWrapper
        beforePrimaryToolbarComponents={mockComponent}
      />,
    );

    expect(
      getByTestId('before-primary-toolbar-components-plugin'),
    ).toBeTruthy();
    expect(getByTestId('mock-component')).toBeTruthy();
  });
});
