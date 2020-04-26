import { render } from '@testing-library/react';
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

    expect(container.textContent).toEqual(`You don’t have access to this link`);
  });

  it('should have a link to the url', () => {
    const testUrl = 'http://unauthorised-test/';
    const { getByText } = render(
      <IntlProvider locale="en">
        <InlineCardUnauthorizedView url={testUrl} />
      </IntlProvider>,
    );
    const link = getByText('link', { exact: false }).closest('a');

    expect(link).not.toBeNull;
    expect(link!.href).toBe(testUrl);
  });
});
