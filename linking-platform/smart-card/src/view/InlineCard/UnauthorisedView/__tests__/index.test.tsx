import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { InlineCardUnauthorizedView } from '..';
import { mockAnalytics } from '../../../../utils/mocks';

describe('Unauthorised View', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('should have correct text', () => {
    const testUrl = 'http://unauthorised-test/';
    const { container } = render(
      <IntlProvider locale="en">
        <InlineCardUnauthorizedView url={testUrl} analytics={mockAnalytics} />
      </IntlProvider>,
    );

    expect(container.textContent).toEqual(testUrl);
  });

  it('should have a link to the url', () => {
    const testUrl = 'http://unauthorised-test/';
    const { getByText } = render(
      <IntlProvider locale="en">
        <InlineCardUnauthorizedView url={testUrl} analytics={mockAnalytics} />
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
        <InlineCardUnauthorizedView
          context="3P"
          url={testUrl}
          onAuthorise={jest.fn()}
          analytics={mockAnalytics}
        />
      </IntlProvider>,
    );

    expect(container.textContent).toEqual(
      `${testUrl} - Connect your 3P account`,
    );
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
          analytics={mockAnalytics}
        />
      </IntlProvider>,
    );

    const message = getByText(testUrl);
    fireEvent.click(message!);
    expect(onClick).toHaveBeenCalled();
    expect(onAuthorise).not.toHaveBeenCalled();
  });
});
