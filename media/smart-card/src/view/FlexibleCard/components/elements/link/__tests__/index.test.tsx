import React from 'react';
import * as typography from '@atlaskit/theme/typography';
import { render, waitForElement } from '@testing-library/react';
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
      [SmartLinkSize.XLarge, 'h800'],
      [SmartLinkSize.Large, 'h600'],
      [SmartLinkSize.Medium, 'h400'],
      [SmartLinkSize.Small, 'h200'],
    ])(
      'renders element in %s size',
      async (size: SmartLinkSize, fnName: any) => {
        const spyFn = jest.spyOn(typography, fnName);
        const { getByTestId } = render(
          <Link text={text} url={url} size={size} />,
        );

        const element = await waitForElement(() => getByTestId(testId));

        expect(element).toHaveStyleDeclaration('margin-top', 'unset');
        expect(spyFn).toHaveBeenCalled();
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

    describe('fallback when webkit is not supported', () => {
      it.each([
        [SmartLinkSize.Small, '2.667em'],
        [SmartLinkSize.Medium, '2.286em'],
        [SmartLinkSize.Large, '2.400em'],
        [SmartLinkSize.XLarge, '2.207em'],
      ])(
        'renders element in %s size',
        async (size: SmartLinkSize, expected: string) => {
          const { getByTestId } = render(
            <Link text={text} url={url} size={size} />,
          );

          const element = await waitForElement(() => getByTestId(testId));

          expect(element).toHaveStyleDeclaration('max-height', expected);
        },
      );
    });
  });

  describe('theme', () => {
    it('renders with default theme', async () => {
      const { getByTestId } = render(<Link text={text} url={url} />);

      const element = await waitForElement(() => getByTestId(testId));

      expect(element).toHaveStyleDeclaration('color', 'var(--ds-link,#0052CC)');
    });

    it(`renders with ${SmartLinkTheme.Link} theme`, async () => {
      const { getByTestId } = render(
        <Link text={text} url={url} theme={SmartLinkTheme.Link} />,
      );

      const element = await waitForElement(() => getByTestId(testId));

      expect(element).toHaveStyleDeclaration('color', 'var(--ds-link,#0052CC)');
    });

    it(`renders with ${SmartLinkTheme.Black} theme`, async () => {
      const { getByTestId } = render(
        <Link text={text} url={url} theme={SmartLinkTheme.Black} />,
      );

      const element = await waitForElement(() => getByTestId(testId));

      expect(element).toHaveStyleDeclaration(
        'color',
        'var(--ds-text-subtle,#172B4D)',
      );
      expect(element).toHaveStyleDeclaration('font-weight', '500');
    });
  });
});
