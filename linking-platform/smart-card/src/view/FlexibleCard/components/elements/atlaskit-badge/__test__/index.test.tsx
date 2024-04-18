import React from 'react';
import { css } from '@emotion/react';
import { render } from '@testing-library/react';

import AtlaskitBadge from '../index';

describe('Element: AtlaskitBadge', () => {
  const testId = 'smart-element-atlaskit-badge';

  it('renders element', async () => {
    const { findByTestId } = render(<AtlaskitBadge value={5} />);

    const element = await findByTestId(testId);

    expect(element).toBeTruthy();
    expect(
      element.getAttribute('data-smart-element-atlaskit-badge'),
    ).toBeTruthy();
    expect(element.textContent).toBe('5');
  });

  it('renders with override css', async () => {
    const overrideCss = css({
      color: 'black',
    });
    const { findByTestId } = render(
      <AtlaskitBadge value={5} overrideCss={overrideCss} />,
    );
    const element = await findByTestId(testId);
    expect(element).toHaveStyleDeclaration('color', 'black');
  });
});
