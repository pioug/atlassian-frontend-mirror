import React from 'react';
import { render, act } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { SaveIndicator } from './SaveIndicator';
import { SaveIndicatorProps } from './types';

jest.useFakeTimers();

function setup(props: Partial<Omit<SaveIndicatorProps, 'children'>> = {}) {
  let onSaveStarted = () => {};
  const result = render(
    <IntlProvider locale="en">
      <SaveIndicator duration={2000} {...props}>
        {({ onSaveStarted: _onSaveStarted }) => {
          onSaveStarted = _onSaveStarted;
          return <div data-testid="my-component" />;
        }}
      </SaveIndicator>
    </IntlProvider>,
  );

  return {
    ...result,
    onSaveStarted,
  };
}

describe('Extension Context Panel - Save Indicator', () => {
  it('should call the render function ', () => {
    const renderFunction = jest.fn().mockImplementation(() => {
      return <div data-testid="my-component" />;
    });
    const { queryByTestId } = render(
      <IntlProvider locale="en">
        <SaveIndicator duration={1000}>{renderFunction}</SaveIndicator>
      </IntlProvider>,
    );

    expect(queryByTestId('my-component')).not.toBeNull();
  });

  it('should show the save indicator when is saving ', () => {
    const { onSaveStarted, queryByTestId } = setup();

    act(() => {
      onSaveStarted();
    });

    expect(queryByTestId('save-indicator-content')).not.toBeNull();
  });

  it('should hide once the duration is over ', () => {
    jest.clearAllTimers();
    const duration = 2000;
    const { onSaveStarted, queryByTestId } = setup({ duration });

    act(() => {
      onSaveStarted();
    });

    act(() => {
      jest.advanceTimersByTime(duration);
    });

    expect(queryByTestId('save-indicator-content')).toBeNull();
  });

  it('should not show the save indicator after saving when visible is false ', () => {
    const { onSaveStarted, queryByTestId } = setup({ visible: false });

    act(() => {
      onSaveStarted();
    });

    expect(queryByTestId('save-indicator-content')).toBeNull();
  });
});
