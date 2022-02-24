import React from 'react';
import { render, waitForElement } from '@testing-library/react';

import Media from '../index';
import { MediaType } from '../../../../../../constants';

jest.mock('react-render-image', () => () => (
  <img data-testid="smart-element-media-image" src="src-loaded" />
));

describe('Element: Media', () => {
  const testId = 'smart-element-media';

  it('renders element', async () => {
    const { getByTestId } = render(
      <Media type={MediaType.Image} url="src-loaded" />,
    );

    const element = await waitForElement(() => getByTestId(testId));
    const image = await waitForElement(() => getByTestId(`${testId}-image`));

    expect(element).toBeTruthy();
    expect(element.getAttribute('data-smart-element-media')).toBeTruthy();
    expect(image).toBeTruthy();
  });

  it('does not render element when neither type nor url is provided', async () => {
    const { container } = render(<Media />);
    expect(container.children.length).toBe(0);
  });

  it('does not render element when type is not provided', async () => {
    const { container } = render(<Media url="src-loaded" />);
    expect(container.children.length).toBe(0);
  });

  it('does not render element when url is not provided', async () => {
    const { container } = render(<Media type={MediaType.Image} />);
    expect(container.children.length).toBe(0);
  });
});
