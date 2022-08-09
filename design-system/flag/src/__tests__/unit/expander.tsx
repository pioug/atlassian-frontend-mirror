import React from 'react';

import { act, fireEvent, render } from '@testing-library/react';

import Flag from '../../flag';

describe('Flag Expander', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should only render children when isExpanded true (and while doing expand/contract animation)', () => {
    // Check that default collapsed state doesn't render children
    const { queryByText, getByTestId } = render(
      <Flag
        id=""
        icon={<div />}
        title="Flag"
        appearance="info"
        description="Hi!"
        testId="expander-test"
      />,
    );
    expect(queryByText('Hi!')).toBeNull();

    // Trigger expand
    let toggleButton = getByTestId('expander-test-toggle');
    fireEvent.click(toggleButton);
    expect(queryByText('Hi!')).not.toBeNull();
    act(() => jest.runAllTimers());

    // Trigger collapse
    toggleButton = getByTestId('expander-test-toggle');
    fireEvent.click(toggleButton);
    expect(queryByText('Hi!')).not.toBeNull();

    // ..once collapse animation finishes, children not rendered
    act(() => jest.runAllTimers());
    expect(queryByText('Hi!')).toBeNull();
  });

  it('should set aria-hidden true on content when isExpanded is false', () => {
    const { getByTestId } = render(
      <Flag
        id=""
        icon={<div />}
        title="Flag"
        appearance="info"
        description="Hi!"
        testId="expander-test"
      />,
    );

    expect(
      getByTestId('expander-test-expander').getAttribute('aria-hidden'),
    ).toEqual('true');
  });

  it('should set aria-hidden false on content when isExpanded is true', () => {
    const { getByTestId } = render(
      <Flag
        id=""
        icon={<div />}
        title="Flag"
        appearance="info"
        description="Hi!"
        testId="expander-test"
      />,
    );

    const toggleButton = getByTestId('expander-test-toggle');
    fireEvent.click(toggleButton);

    expect(
      getByTestId('expander-test-expander').getAttribute('aria-hidden'),
    ).toEqual('false');
  });
});
