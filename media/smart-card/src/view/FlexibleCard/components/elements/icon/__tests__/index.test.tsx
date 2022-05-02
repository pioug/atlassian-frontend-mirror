/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */

import React from 'react';
import { render } from '@testing-library/react';
import { css } from '@emotion/core';
import Icon from '../index';
import {
  IconType,
  SmartLinkPosition,
  SmartLinkSize,
} from '../../../../../../constants';

jest.mock(
  'react-render-image',
  () => ({ src, loading, loaded, errored }: any) => {
    switch (src) {
      case 'src-loading':
        return loading;
      case 'src-loaded':
        return loaded;
      case 'src-error':
        return errored;
      default:
        return <span>{src}</span>;
    }
  },
);

describe('Element: Icon', () => {
  it('renders element', async () => {
    const { findByTestId } = render(<Icon />);

    const element = await findByTestId('smart-element-icon');

    expect(element).toBeTruthy();
    expect(element.getAttribute('data-smart-element-icon')).toBeTruthy();
  });

  it('renders icon using render function when provided', async () => {
    const testId = 'custom-icon';
    const renderCustomIcon = () => <span data-testid={testId}>💡</span>;
    const { findByTestId } = render(<Icon render={renderCustomIcon} />);

    const element = await findByTestId(testId);

    expect(element).toBeTruthy();
    expect(element.textContent).toBe('💡');
  });

  it('renders ImageIcon when url is provided', async () => {
    const { findByTestId } = render(
      <Icon icon={IconType.Document} url="src-loaded" />,
    );

    const element = await findByTestId('smart-element-icon-image');

    expect(element).toBeTruthy();
  });

  it('renders AtlaskitIcon when url is not provided', async () => {
    const { findByTestId } = render(<Icon icon={IconType.Document} />);

    const element = await findByTestId('smart-element-icon-icon');

    expect(element).toBeTruthy();
  });

  it('renders default icon when neither icon nor url is provided', async () => {
    const { findByTestId } = render(<Icon />);

    const element = await findByTestId('smart-element-icon-default');

    expect(element).toBeTruthy();
  });

  describe('priority', () => {
    it('priorities custom render function', async () => {
      const testId = 'custom-icon';
      const renderCustomIcon = () => <span data-testid={testId}>💡</span>;
      const { findByTestId, queryByTestId } = render(
        <Icon
          icon={IconType.Document}
          render={renderCustomIcon}
          url="src-loaded"
        />,
      );

      const customIcon = await findByTestId(testId);
      const imageIcon = queryByTestId('smart-element-icon-image');
      const akIcon = queryByTestId('smart-element-icon-icon');

      expect(customIcon.textContent).toBe('💡');
      expect(imageIcon).not.toBeInTheDocument();
      expect(akIcon).not.toBeInTheDocument();
    });

    it('priorities url icon', async () => {
      const renderCustomIcon = () => undefined;
      const { findByTestId, queryByTestId } = render(
        <Icon
          icon={IconType.Document}
          render={renderCustomIcon}
          url="src-loaded"
        />,
      );

      const imageIcon = await findByTestId('smart-element-icon-image');
      const akIcon = queryByTestId('smart-element-icon-icon');

      expect(imageIcon).toBeTruthy();
      expect(akIcon).not.toBeInTheDocument();
    });

    it('priorities atlaskit icon', async () => {
      const renderCustomIcon = () => undefined;
      const { findByTestId, queryByTestId } = render(
        <Icon icon={IconType.Document} render={renderCustomIcon} />,
      );

      const imageIcon = queryByTestId('smart-element-icon-image');
      const akIcon = await findByTestId('smart-element-icon-icon');

      expect(imageIcon).not.toBeInTheDocument();
      expect(akIcon).toBeTruthy();
    });
  });

  describe('size', () => {
    it.each([
      [SmartLinkSize.XLarge, '2rem'],
      [SmartLinkSize.Large, '1.5rem'],
      [SmartLinkSize.Medium, '1rem'],
      [SmartLinkSize.Small, '.75rem'],
    ])(
      'renders element in %s size',
      async (size: SmartLinkSize, expectedSize: string) => {
        const { findByTestId } = render(<Icon size={size} />);

        const element = await findByTestId('smart-element-icon');

        expect(element).toHaveStyleDeclaration('height', expectedSize);
        expect(element).toHaveStyleDeclaration('width', expectedSize);
      },
    );
  });

  describe('position', () => {
    it.each([
      [SmartLinkPosition.Top, 'flex-start'],
      [SmartLinkPosition.Center, 'center'],
    ])(
      'renders element at %s position',
      async (position, expectedAlignSelf) => {
        const { findByTestId } = render(
          <Icon position={position} size={SmartLinkSize.Small} />,
        );

        const element = await findByTestId('smart-element-icon');

        expect(element).toHaveStyleDeclaration('align-self', expectedAlignSelf);
      },
    );
  });

  describe('ImageIcon', () => {
    it('renders image icon', async () => {
      const { findByTestId } = render(<Icon url="src-loaded" />);

      const element = await findByTestId('smart-element-icon-image');

      expect(element).toBeTruthy();
    });

    it('renders shimmer placeholder on loading', async () => {
      const { findByTestId } = render(<Icon url="src-loading" />);

      const element = await findByTestId('smart-element-icon-loading');

      expect(element).toBeTruthy();
    });

    it('renders default icon on error', async () => {
      const { findByTestId } = render(<Icon url="src-error" />);

      const element = await findByTestId('smart-element-icon-default');

      expect(element).toBeTruthy();
    });
  });

  it('renders with override css', async () => {
    const overrideCss = css`
      background-color: blue;
    `;
    const { findByTestId } = render(<Icon overrideCss={overrideCss} />);

    const element = await findByTestId('smart-element-icon');

    expect(element).toHaveStyleDeclaration('background-color', 'blue');
  });
});
