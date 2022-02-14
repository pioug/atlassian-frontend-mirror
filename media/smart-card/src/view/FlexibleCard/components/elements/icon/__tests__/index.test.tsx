import React from 'react';
import { render, waitForElement } from '@testing-library/react';
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
    const { getByTestId } = render(<Icon />);

    const element = await waitForElement(() =>
      getByTestId('smart-element-icon'),
    );

    expect(element).toBeTruthy();
    expect(element.getAttribute('data-smart-element-icon')).toBeTruthy();
  });

  it('renders icon using render function when provided', async () => {
    const testId = 'custom-icon';
    const renderCustomIcon = () => <span data-testid={testId}>💡</span>;
    const { getByTestId } = render(<Icon render={renderCustomIcon} />);

    const element = await waitForElement(() => getByTestId(testId));

    expect(element).toBeTruthy();
    expect(element.textContent).toBe('💡');
  });

  it('renders ImageIcon when url is provided', async () => {
    const { getByTestId } = render(
      <Icon icon={IconType.Document} url="src-loaded" />,
    );

    const element = await waitForElement(() =>
      getByTestId('smart-element-icon-image'),
    );

    expect(element).toBeTruthy();
  });

  it('renders AtlaskitIcon when url is not provided', async () => {
    const { getByTestId } = render(<Icon icon={IconType.Document} />);

    const element = await waitForElement(() =>
      getByTestId('smart-element-icon-icon'),
    );

    expect(element).toBeTruthy();
  });

  it('renders default icon when neither icon nor url is provided', async () => {
    const { getByTestId } = render(<Icon />);

    const element = await waitForElement(() =>
      getByTestId('smart-element-icon-default'),
    );

    expect(element).toBeTruthy();
  });

  describe('priority', () => {
    it('priorities custom render function', async () => {
      const testId = 'custom-icon';
      const renderCustomIcon = () => <span data-testid={testId}>💡</span>;
      const { getByTestId, queryByTestId } = render(
        <Icon
          icon={IconType.Document}
          render={renderCustomIcon}
          url="src-loaded"
        />,
      );

      const customIcon = await waitForElement(() => getByTestId(testId));
      const imageIcon = queryByTestId('smart-element-icon-image');
      const akIcon = queryByTestId('smart-element-icon-icon');

      expect(customIcon.textContent).toBe('💡');
      expect(imageIcon).not.toBeInTheDocument();
      expect(akIcon).not.toBeInTheDocument();
    });

    it('priorities url icon', async () => {
      const renderCustomIcon = () => undefined;
      const { getByTestId, queryByTestId } = render(
        <Icon
          icon={IconType.Document}
          render={renderCustomIcon}
          url="src-loaded"
        />,
      );

      const imageIcon = await waitForElement(() =>
        getByTestId('smart-element-icon-image'),
      );
      const akIcon = queryByTestId('smart-element-icon-icon');

      expect(imageIcon).toBeTruthy();
      expect(akIcon).not.toBeInTheDocument();
    });

    it('priorities atlaskit icon', async () => {
      const renderCustomIcon = () => undefined;
      const { getByTestId, queryByTestId } = render(
        <Icon icon={IconType.Document} render={renderCustomIcon} />,
      );

      const imageIcon = queryByTestId('smart-element-icon-image');
      const akIcon = await waitForElement(() =>
        getByTestId('smart-element-icon-icon'),
      );

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
        const { getByTestId } = render(<Icon size={size} />);

        const element = await waitForElement(() =>
          getByTestId('smart-element-icon'),
        );

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
        const { getByTestId } = render(
          <Icon position={position} size={SmartLinkSize.Small} />,
        );

        const element = await waitForElement(() =>
          getByTestId('smart-element-icon'),
        );

        expect(element).toHaveStyleDeclaration('align-self', expectedAlignSelf);
      },
    );
  });

  describe('ImageIcon', () => {
    it('renders image icon', async () => {
      const { getByTestId } = render(<Icon url="src-loaded" />);

      const element = await waitForElement(() =>
        getByTestId('smart-element-icon-image'),
      );

      expect(element).toBeTruthy();
    });

    it('renders shimmer placeholder on loading', async () => {
      const { getByTestId } = render(<Icon url="src-loading" />);

      const element = await waitForElement(() =>
        getByTestId('smart-element-icon-loading'),
      );

      expect(element).toBeTruthy();
    });

    it('renders default icon on error', async () => {
      const { getByTestId } = render(<Icon url="src-error" />);

      const element = await waitForElement(() =>
        getByTestId('smart-element-icon-default'),
      );

      expect(element).toBeTruthy();
    });
  });
});
