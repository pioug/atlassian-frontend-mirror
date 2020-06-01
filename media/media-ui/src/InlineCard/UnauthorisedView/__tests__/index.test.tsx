import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { InlineCardUnauthorizedView } from '..';

describe('Unauthorised View', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('should have correct text', () => {
    const testUrl = 'http://unauthorised-test/';
    const { container } = render(
      <IntlProvider locale="en">
        <InlineCardUnauthorizedView url={testUrl} />
      </IntlProvider>,
    );

    expect(container.textContent).toEqual(testUrl);
  });

  it('should have a link to the url', () => {
    const testUrl = 'http://unauthorised-test/';
    const { getByText } = render(
      <IntlProvider locale="en">
        <InlineCardUnauthorizedView url={testUrl} />
      </IntlProvider>,
    );
    const link = getByText(testUrl, { exact: false }).closest('a');

    expect(link).not.toBeNull;
    expect(link!.href).toBe(testUrl);
  });

  it('should show correct text if action is available', () => {
    const testUrl = 'http://unauthorised-test/';
    const { container } = render(
      <IntlProvider locale="en">
        <InlineCardUnauthorizedView url={testUrl} onAuthorise={jest.fn()} />
      </IntlProvider>,
    );

    expect(container.textContent).toEqual(`${testUrl} - Connect to preview`);
  });

  it('should not redirect user if they do not click on the authorize button', () => {
    const onClick = jest.fn();
    const onAuthorise = jest.fn();
    const testUrl = 'http://unauthorised-test/';
    const { getByText } = render(
      <IntlProvider locale="en">
        <InlineCardUnauthorizedView
          url={testUrl}
          onClick={onClick}
          onAuthorise={onAuthorise}
        />
      </IntlProvider>,
    );

    const message = getByText(testUrl);
    fireEvent.click(message!);
    expect(onClick).toHaveBeenCalled();
    expect(onAuthorise).not.toHaveBeenCalled();
  });
});
