import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { InlineCardForbiddenView } from '../..';
import { expectElementWithText } from '../../../../../__tests__/__utils__/unit-helpers';

jest.mock('react-render-image');

const URL =
  'http://product.example.com/lorem/ipsum/dolor/sit/amet/consectetur/adipiscing/volutpat/';

describe('Forbidden view', () => {
  it('should do click if try again clicked', async () => {
    const onRetrySpy = jest.fn();
    render(
      <IntlProvider locale={'en'}>
        <InlineCardForbiddenView url={URL} onAuthorise={onRetrySpy} />
      </IntlProvider>,
    );
    fireEvent.click(
      await screen.findByRole('button', { name: 'Restricted content' }),
    );
    expect(onRetrySpy).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick if onRetry was triggered', async () => {
    const onClickSpy = jest.fn();
    const onRetrySpy = jest.fn();
    render(
      <IntlProvider locale={'en'}>
        <InlineCardForbiddenView
          url={URL}
          onAuthorise={onRetrySpy}
          onClick={onClickSpy}
        />
      </IntlProvider>,
    );
    fireEvent.click(
      await screen.findByRole('button', { name: 'Restricted content' }),
    );
    expect(onRetrySpy).toHaveBeenCalledTimes(1);
    expect(onClickSpy).not.toHaveBeenCalled();
  });

  it('should show correct text', async () => {
    render(
      <IntlProvider locale={'en'}>
        <InlineCardForbiddenView url={URL} />
      </IntlProvider>,
    );
    await expectElementWithText('inline-card-forbidden-view', URL);
  });

  it('should show correct text if actionable', async () => {
    render(
      <IntlProvider locale={'en'}>
        <InlineCardForbiddenView url={URL} onAuthorise={jest.fn()} />
      </IntlProvider>,
    );

    await expectElementWithText(
      'inline-card-forbidden-view',
      `${URL}Restricted content`,
    );
  });

  it('should show correct icon if present', async () => {
    const iconUrl = 'https://google.com/favicon.ico';
    render(
      <IntlProvider locale={'en'}>
        <InlineCardForbiddenView
          url={URL}
          icon="https://google.com/favicon.ico"
          onAuthorise={jest.fn()}
        />
      </IntlProvider>,
    );
    await expectElementWithText(
      'inline-card-forbidden-view',
      `${URL}Restricted content`,
    );
    expect(await screen.findByRole('img')).toHaveAttribute('src', iconUrl);
  });

  it('should show correct icon if not present (fallback icon)', async () => {
    render(
      <IntlProvider locale={'en'}>
        <InlineCardForbiddenView url={URL} onAuthorise={jest.fn()} />
      </IntlProvider>,
    );
    await expectElementWithText(
      'inline-card-forbidden-view',
      `${URL}Restricted content`,
    );
    expect(
      await screen.findByTestId('forbidden-view-fallback-icon'),
    ).toHaveAttribute('aria-label', 'error');
  });

  it('should show correct text if request access type is DIRECT_ACCESS', async () => {
    const requestAccessContext = { callToActionMessageKey: 'click_to_join' };
    render(
      <IntlProvider locale={'en'}>
        <InlineCardForbiddenView
          url={URL}
          requestAccessContext={requestAccessContext as any}
          context="Jira"
        />
      </IntlProvider>,
    );
    await expectElementWithText(
      'inline-card-forbidden-view',
      `${URL} - Join Jira`,
    );
  });

  it('should do promise if Join to preview clicked', async () => {
    const promise = jest.fn();
    const requestAccessContext = {
      callToActionMessageKey: 'click_to_join',
      action: { promise },
    };
    render(
      <IntlProvider locale={'en'}>
        <InlineCardForbiddenView
          url={URL}
          requestAccessContext={requestAccessContext as any}
        />
      </IntlProvider>,
    );
    fireEvent.click(await screen.findByRole('button', { name: 'Join' }));
    expect(promise).toHaveBeenCalledTimes(1);
  });

  it('should show correct text if request access type is REQUEST_ACCESS', async () => {
    const requestAccessContext = { callToActionMessageKey: 'request_access' };
    render(
      <IntlProvider locale={'en'}>
        <InlineCardForbiddenView
          url={URL}
          requestAccessContext={requestAccessContext as any}
        />
      </IntlProvider>,
    );

    await expectElementWithText(
      'inline-card-forbidden-view',
      `${URL} - Request access`,
    );
  });

  it('should do promise if request access is clicked', async () => {
    const promise = jest.fn();
    const requestAccessContext = {
      callToActionMessageKey: 'request_access',
      action: { promise },
    };
    render(
      <IntlProvider locale={'en'}>
        <InlineCardForbiddenView
          url={URL}
          requestAccessContext={requestAccessContext as any}
        />
      </IntlProvider>,
    );
    fireEvent.click(
      await screen.findByRole('button', { name: 'Request access' }),
    );
    expect(promise).toHaveBeenCalledTimes(1);
  });
});
