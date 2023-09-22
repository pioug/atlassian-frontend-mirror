import { render } from '@testing-library/react';
import React from 'react';

import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { FlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import Preview from '../index';

describe('Element: Preview', () => {
  const testId = 'smart-element-media';

  it('renders media element with overrideUrl', async () => {
    const { findByTestId } = render(<Preview overrideUrl="src-loaded" />);

    const element = await findByTestId(testId);
    const image = await findByTestId(`${testId}-image-image`);

    expect(element).toBeTruthy();
    expect(element.getAttribute('data-smart-element-media')).toBeTruthy();
    expect(image).toBeTruthy();
    expect(image).toHaveAttribute('src', 'src-loaded');
  });

  it('renders media element with context', async () => {
    const { findByTestId } = render(
      <FlexibleUiContext.Provider value={context}>
        <Preview />
      </FlexibleUiContext.Provider>,
    );

    const element = await findByTestId(testId);
    const image = await findByTestId(`${testId}-image-image`);

    expect(element).toBeTruthy();
    expect(element.getAttribute('data-smart-element-media')).toBeTruthy();
    expect(image).toBeTruthy();
    expect(image).toHaveAttribute('src', 'image-url');
  });
});
