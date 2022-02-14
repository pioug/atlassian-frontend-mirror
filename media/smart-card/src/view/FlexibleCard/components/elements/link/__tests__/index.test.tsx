import React from 'react';
import { fireEvent, render, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Link from '../index';
import { SmartLinkSize, SmartLinkTheme } from '../../../../../../constants';

describe('Element: Link', () => {
  const testId = 'smart-element-link';
  const text = 'Some title';
  const url = 'https://some.url';

  it('renders element', async () => {
    const { getByTestId } = render(<Link text={text} url={url} />);

    const element = await waitForElement(() => getByTestId(testId));

    expect(element).toBeTruthy();
    expect(element.getAttribute('data-smart-element-link')).toBeTruthy();
    expect(element).toBeInstanceOf(HTMLAnchorElement);
    expect(element.getAttribute('href')).toBe(url);
    expect(element.textContent).toBe(text);
  });

  describe('size', () => {
    it.each([
      [SmartLinkSize.XLarge, '1.25rem'],
      [SmartLinkSize.Large, '0.875rem'],
      [SmartLinkSize.Medium, '0.875rem'],
      [SmartLinkSize.Small, '0.75rem'],
    ])(
      'renders element in %s size',
      async (size: SmartLinkSize, expectedFontSize) => {
        const { getByTestId } = render(
          <Link text={text} url={url} size={size} />,
        );

        const element = await waitForElement(() => getByTestId(testId));

        expect(element).toHaveStyleDeclaration('font-size', expectedFontSize);
      },
    );
  });

  describe('maxLines', () => {
    it('renders with default two maxLines', async () => {
      const { getByTestId } = render(<Link text={text} url={url} />);

      const element = await waitForElement(() => getByTestId(testId));

      expect(element).toHaveStyleDeclaration('-webkit-line-clamp', '2');
    });

    it('renders element to two lines when maxLines exceeds maximum', async () => {
      const { getByTestId } = render(
        <Link text={text} url={url} maxLines={10} />,
      );

      const element = await waitForElement(() => getByTestId(testId));

      expect(element).toHaveStyleDeclaration('-webkit-line-clamp', '2');
    });

    it('renders element to one lines when maxLines belows minimum', async () => {
      const { getByTestId } = render(
        <Link text={text} url={url} maxLines={-10} />,
      );

      const element = await waitForElement(() => getByTestId(testId));

      expect(element).toHaveStyleDeclaration('-webkit-line-clamp', '1');
    });
  });

  describe('theme', () => {
    it('renders with default theme', async () => {
      const { getByTestId } = render(<Link text={text} url={url} />);

      const element = await waitForElement(() => getByTestId(testId));

      expect(element).toHaveStyleDeclaration(
        'color',
        expect.stringContaining('#0C66E4'),
      );
    });

    it(`renders with ${SmartLinkTheme.Link} theme`, async () => {
      const { getByTestId } = render(
        <Link text={text} url={url} theme={SmartLinkTheme.Link} />,
      );

      const element = await waitForElement(() => getByTestId(testId));

      expect(element).toHaveStyleDeclaration(
        'color',
        expect.stringContaining('#0C66E4'),
      );
    });

    it(`renders with ${SmartLinkTheme.Black} theme`, async () => {
      const { getByTestId } = render(
        <Link text={text} url={url} theme={SmartLinkTheme.Black} />,
      );

      const element = await waitForElement(() => getByTestId(testId));

      expect(element).toHaveStyleDeclaration(
        'color',
        expect.stringContaining('#44546F'),
      );
      expect(element).toHaveStyleDeclaration('font-weight', '500');
    });
  });

  it('shows tooltip on hover', async () => {
    const { getByTestId } = render(<Link text={text} url={url} />);

    const element = await waitForElement(() => getByTestId(testId));
    fireEvent.mouseOver(element);
    const tooltip = await waitForElement(() =>
      getByTestId(`${testId}-tooltip`),
    );

    expect(tooltip).toBeTruthy();
    expect(tooltip.textContent).toBe(text);
  });
});
