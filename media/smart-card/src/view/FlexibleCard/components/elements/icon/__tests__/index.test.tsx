import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import Icon from '../index';
import { IconType, SmartLinkSize } from '../../../../../../constants';

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

  describe('size', () => {
    it.each([
      [SmartLinkSize.XLarge, '1.75rem'],
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

  describe('AtlaskitIcon', () => {
    const logos = [IconType.Confluence, IconType.Jira];

    it.each(
      Object.values(IconType)
        .filter((icon) => !logos.includes(icon))
        .map((icon: IconType) => [icon]),
    )('renders atlaskit icon for %s', async (icon: IconType) => {
      const { getByTestId } = render(<Icon icon={icon} />);

      const element = await waitForElement(() =>
        getByTestId('smart-element-icon-icon'),
      );

      expect(element).toMatchSnapshot();
    });

    // Atlaskit logo component does not accept testId,
    // so we will have to use different approach for the test to find it.
    it.each(logos.map((icon: IconType) => [icon]))(
      'renders atlaskit icon for %s',
      async (icon: IconType) => {
        const { findByRole } = render(<Icon icon={icon} />);

        const element = await waitForElement(() => findByRole('img'));

        expect(element).toMatchSnapshot();
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

    it('renders default icon on error', async () => {
      const { getByTestId } = render(<Icon url="src-error" />);

      const element = await waitForElement(() =>
        getByTestId('smart-element-icon-default'),
      );

      expect(element).toBeTruthy();
    });
  });
});
