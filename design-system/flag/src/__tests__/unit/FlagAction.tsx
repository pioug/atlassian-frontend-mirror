import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { AppearanceTypes, FlagProps } from '../../types';
import Flag from '../../flag';

describe('actions prop', () => {
  const generateFlag = (extraProps: Partial<FlagProps>) => (
    <Flag id="" icon={<div />} title="Flag" {...extraProps} />
  );

  it('actions with normal appearance should be rendered with dots', () => {
    const actionSpy = jest.fn();
    const { getByTestId } = render(
      generateFlag({
        testId: 'flag-action-test',
        actions: [
          { content: 'Hello!', onClick: actionSpy },
          { content: 'Goodbye!', onClick: actionSpy },
          { content: 'with href', href: 'hrefString' },
        ],
      }),
    );

    const actions = getByTestId('flag-action-test-actions');

    expect(actions.textContent).toBe('Hello!·Goodbye!·with href');
  });

  it('actions with bold appearance should be rendered without dots', () => {
    (['info', 'warning', 'error', 'success'] as Array<AppearanceTypes>).forEach(
      (appearance) => {
        const { getByTestId, unmount } = render(
          generateFlag({
            testId: 'flag-action-test',
            actions: [
              { content: 'Hello!', onClick: () => {} },
              { content: 'Goodbye!', onClick: () => {} },
              { content: 'with href', href: 'hrefString' },
            ],
            appearance: appearance,
          }),
        );

        fireEvent.click(getByTestId('flag-action-test-toggle'));
        const actions = getByTestId('flag-action-test-actions');

        expect(actions.textContent).toBe('Hello!Goodbye!with href');

        unmount();
      },
    );
  });

  it('actions without a href should should be rendered as a button', () => {
    const { getByTestId } = render(
      generateFlag({
        testId: 'flag-action-test',
        actions: [{ content: 'Hello!', onClick: () => {} }],
        appearance: 'error',
      }),
    );

    fireEvent.click(getByTestId('flag-action-test-toggle'));

    const action = getByTestId('flag-action-test-actions').querySelector(
      'button',
    );

    expect(action).not.toBeNull();
  });

  it('actions with href should be rendered as an anchor', () => {
    const { getByTestId } = render(
      generateFlag({
        testId: 'flag-action-test',
        actions: [{ content: 'Hello!', onClick: () => {}, href: 'google.com' }],
      }),
    );

    const action = getByTestId('flag-action-test-actions').querySelector('a');

    expect(action).not.toBeNull();
  });

  it('action onClick should be triggered on click', () => {
    const actionSpy = jest.fn();
    const { getByText } = render(
      generateFlag({
        testId: 'flag-action-test',
        actions: [
          { content: 'Hello!', onClick: actionSpy },
          { content: 'Goodbye!', onClick: actionSpy },
          { content: 'with href', href: 'hrefString' },
        ],
      }),
    );

    fireEvent.click(getByText('Hello!'));

    expect(actionSpy).toHaveBeenCalledTimes(1);
  });

  it('should pass down href and target to the button', () => {
    const { getByText } = render(
      generateFlag({
        actions: [
          {
            content: 'Hello!',
            href: 'https://some-unique-url.org',
            target: '_blank',
          },
        ],
        description: 'Hi there',
      }),
    );

    const buttonText = getByText('Hello!');
    const button: HTMLAnchorElement | null = buttonText.closest('a');

    if (!button) {
      throw new Error('unable to find button');
    }

    expect(button.getAttribute('href')).toBe('https://some-unique-url.org');
    expect(button.getAttribute('target')).toBe('_blank');
  });
});
