import React from 'react';

import { render } from '@testing-library/react';

import { setGlobalTheme } from '@atlaskit/tokens';

import Image from './index';

const testId = 'image';
const testSrc = 'test.jpg';
const testSrcDark = 'test-dark.jpg';

describe('Image', () => {
  it('should be found by its testid', async () => {
    const { getByTestId } = render(<Image testId={testId} />);

    expect(getByTestId(testId)).toBeTruthy();
  });

  it('should be an img element', async () => {
    const { getByTestId } = render(<Image testId={testId} />);

    expect(getByTestId(testId)).toBeInstanceOf(HTMLImageElement);
  });

  it('should use the provided src', () => {
    const { getByTestId } = render(<Image testId={testId} src={testSrc} />);

    expect(getByTestId(testId)).toHaveAttribute('src', testSrc);
  });

  it('should use src even when srcDark is provided if no theme is selected', () => {
    const { getByTestId } = render(
      <Image testId={testId} src={testSrc} srcDark={testSrcDark} />,
    );

    expect(getByTestId(testId)).toHaveAttribute('src', testSrc);
  });

  it('should use src even when srcDark is provided if theme is set to light', async () => {
    await setGlobalTheme({ colorMode: 'light' });

    const { getByTestId } = render(
      <Image testId={testId} src={testSrc} srcDark={testSrcDark} />,
    );

    expect(getByTestId(testId)).toHaveAttribute('src', testSrc);
  });

  it('should use srcDark when theme is set to dark', async () => {
    await setGlobalTheme({ colorMode: 'dark' });

    const { getByTestId } = render(
      <Image testId={testId} src={testSrc} srcDark={testSrcDark} />,
    );

    expect(getByTestId(testId)).toHaveAttribute('src', testSrcDark);
  });

  it('should use src when theme is set to dark but srcDark is not provided', async () => {
    await setGlobalTheme({ colorMode: 'dark' });

    const { getByTestId } = render(<Image testId={testId} src={testSrc} />);

    expect(getByTestId(testId)).toHaveAttribute('src', testSrc);
  });
});
