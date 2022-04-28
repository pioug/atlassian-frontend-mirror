import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { css } from '@emotion/core';
import { render } from '@testing-library/react';

import DateTime from '../index';

describe('Element: Text', () => {
  const testId = 'smart-element-date-time';
  let oldDateNowFn: () => number;
  const mockedNow = new Date('2022-01-25T16:44:00.000+1000').getTime();
  beforeAll(() => {
    oldDateNowFn = Date.now;
    Date.now = jest.fn(() => mockedNow);
  });

  afterAll(() => {
    Date.now = oldDateNowFn;
  });

  it('should render created at element', async () => {
    const { findByTestId } = render(
      <IntlProvider locale="en">
        <DateTime
          date={new Date('2020-02-04T12:40:12.353+0800')}
          type="created"
        />
      </IntlProvider>,
    );
    const element = await findByTestId(testId);
    expect(element).toBeTruthy();
    expect(element.textContent).toBe('Created 2 years ago');
  });

  it('should render modified at element', async () => {
    const { findByTestId } = render(
      <IntlProvider locale="en">
        <DateTime
          date={new Date('2021-12-31T12:40:12.353+0800')}
          type="modified"
        />
      </IntlProvider>,
    );
    const element = await findByTestId(testId);
    expect(element).toBeTruthy();
    expect(element.textContent).toBe('Updated last year');
  });

  it('should render another modified at element', async () => {
    const { findByTestId } = render(
      <IntlProvider locale="en">
        <DateTime
          date={new Date('2022-01-12T12:40:12.353+0800')}
          type="modified"
        />
      </IntlProvider>,
    );
    const element = await findByTestId(testId);
    expect(element).toBeTruthy();
    expect(element.textContent).toBe('Updated 2 weeks ago');
  });

  it('renders with override css', async () => {
    const overrideCss = css`
      font-weight: bold;
    `;
    const { findByTestId } = render(
      <IntlProvider locale="en">
        <DateTime
          date={new Date('2020-02-04T12:40:12.353+0800')}
          overrideCss={overrideCss}
          type="created"
        />
      </IntlProvider>,
    );

    const element = await findByTestId(testId);

    expect(element).toHaveStyleDeclaration('font-weight', 'bold');
  });
});
