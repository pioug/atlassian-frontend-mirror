import React from 'react';
import { IntlProvider, MessageFormatElement } from 'react-intl-next';
import { render, waitForElement } from '@testing-library/react';

import { IconType } from '../../../../../../constants';
import Badge from '../index';
import { messages } from '../../../../../../messages';

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

describe('Element: Badge', () => {
  it('renders element', async () => {
    const { getByTestId } = render(
      <Badge icon={IconType.Comment} label="99" />,
    );

    const element = await waitForElement(() =>
      getByTestId('smart-element-badge'),
    );

    expect(element).toBeTruthy();
    expect(element.getAttribute('data-smart-element-badge')).toBeTruthy();
    expect(element.textContent).toBe('99');
  });

  it('renders image as badge icon', async () => {
    const { getByTestId } = render(<Badge label="desc" url="src-loaded" />);

    const element = await waitForElement(() =>
      getByTestId('smart-element-badge-image'),
    );

    expect(element).toBeTruthy();
  });

  describe('size', () => {
    it('renders icon at  0.75rem', async () => {
      const { getByTestId } = render(
        <Badge icon={IconType.Comment} label="99" />,
      );

      const icon = await waitForElement(() =>
        getByTestId('smart-element-badge-icon'),
      );

      expect(icon).toHaveStyle(`height: 1rem`);
      expect(icon).toHaveStyle(`width: 1rem`);
    });

    it('renders text at .75rem', async () => {
      const { getByTestId } = render(
        <Badge icon={IconType.Comment} label="99" />,
      );

      const text = await waitForElement(() =>
        getByTestId('smart-element-badge-label'),
      );

      expect(text).toHaveStyleDeclaration('font-size', '0.75rem');
    });
  });

  describe('priority', () => {
    it.each([
      [IconType.PriorityBlocker, messages.priority_blocker.defaultMessage],
      [IconType.PriorityCritical, messages.priority_critical.defaultMessage],
      [IconType.PriorityHigh, messages.priority_high.defaultMessage],
      [IconType.PriorityHighest, messages.priority_highest.defaultMessage],
      [IconType.PriorityLow, messages.priority_low.defaultMessage],
      [IconType.PriorityLowest, messages.priority_lowest.defaultMessage],
      [IconType.PriorityMajor, messages.priority_major.defaultMessage],
      [IconType.PriorityMedium, messages.priority_medium.defaultMessage],
      [IconType.PriorityMinor, messages.priority_minor.defaultMessage],
      [IconType.PriorityTrivial, messages.priority_trivial.defaultMessage],
      [IconType.PriorityUndefined, messages.priority_undefined.defaultMessage],
    ])(
      'renders formatted message for priority badge',
      async (
        icon: IconType,
        content: string | MessageFormatElement[] | undefined,
      ) => {
        const { getByTestId } = render(
          <IntlProvider locale="en">
            <Badge icon={icon} />
          </IntlProvider>,
        );

        const element = await waitForElement(() =>
          getByTestId('smart-element-badge'),
        );

        expect(element.textContent).toBe(content);
      },
    );
  });

  it('does not render if there is no icon nor content', async () => {
    const { container } = render(<Badge />);

    expect(container.children.length).toEqual(0);
  });

  it('does not render if content is not provided and no formatted message available', async () => {
    const { container } = render(<Badge icon={IconType.Comment} />);

    expect(container.children.length).toEqual(0);
  });
});
