import React from 'react';
import { mount } from 'enzyme';
import LockIcon from '@atlaskit/icon/glyph/lock-filled';
import { IntlProvider } from 'react-intl';

import { InlineCardForbiddenView } from '../..';

jest.mock('react-render-image');

const URL =
  'http://product.example.com/lorem/ipsum/dolor/sit/amet/consectetur/adipiscing/volutpat/';

describe('Forbidden view', () => {
  it('should do click if try again clicked', () => {
    const onRetrySpy = jest.fn();
    const element = mount(
      <IntlProvider locale={'en'}>
        <InlineCardForbiddenView url={URL} onAuthorise={onRetrySpy} />
      </IntlProvider>,
    );
    element.find('[type="button"]').at(0).simulate('click');
    expect(onRetrySpy).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick if onRetry was triggered', () => {
    const onClickSpy = jest.fn();
    const onRetrySpy = jest.fn();
    const element = mount(
      <IntlProvider locale={'en'}>
        <InlineCardForbiddenView
          url={URL}
          onAuthorise={onRetrySpy}
          onClick={onClickSpy}
        />
      </IntlProvider>,
    );
    element.find('[type="button"]').at(0).simulate('click');
    expect(onRetrySpy).toHaveBeenCalledTimes(1);
    expect(onClickSpy).not.toHaveBeenCalled();
  });

  it('should show correct text', () => {
    const element = mount(
      <IntlProvider locale={'en'}>
        <InlineCardForbiddenView url={URL} />
      </IntlProvider>,
    );
    expect(element.text()).toEqual(URL);
  });

  it('should show correct text if actionable', () => {
    const element = mount(
      <IntlProvider locale={'en'}>
        <InlineCardForbiddenView url={URL} onAuthorise={jest.fn()} />
      </IntlProvider>,
    );
    expect(element.text()).toEqual(
      `${URL} - Restricted link, Try another account`,
    );
  });

  it('should show correct icon if present', () => {
    const iconUrl = 'https://google.com/favicon.ico';
    const element = mount(
      <IntlProvider locale={'en'}>
        <InlineCardForbiddenView
          url={URL}
          icon="https://google.com/favicon.ico"
          onAuthorise={jest.fn()}
        />
      </IntlProvider>,
    );
    expect(element.text()).toEqual(
      `${URL} - Restricted link, Try another account`,
    );
    expect(element.find('img').prop('src')).toBe(iconUrl);
  });

  it('should show correct icon if not present (fallback icon)', () => {
    const element = mount(
      <IntlProvider locale={'en'}>
        <InlineCardForbiddenView url={URL} onAuthorise={jest.fn()} />
      </IntlProvider>,
    );
    expect(element.text()).toEqual(
      `${URL} - Restricted link, Try another account`,
    );
    expect(element.find(LockIcon)).toHaveLength(1);
    expect(element.find(LockIcon).prop('label')).toBe('error');
  });

  it('should show correct text if request access type is DIRECT_ACCESS', () => {
    const requestAccessContext = { callToActionMessageKey: 'click_to_join' };
    const element = mount(
      <IntlProvider locale={'en'}>
        <InlineCardForbiddenView
          url={URL}
          requestAccessContext={requestAccessContext as any}
          context="Jira"
        />
      </IntlProvider>,
    );
    expect(element.text()).toEqual(`${URL} - Join Jira`);
  });

  it('should do promise if Join to preview clicked', () => {
    const promise = jest.fn();
    const requestAccessContext = {
      callToActionMessageKey: 'click_to_join',
      action: { promise },
    };
    const element = mount(
      <IntlProvider locale={'en'}>
        <InlineCardForbiddenView
          url={URL}
          requestAccessContext={requestAccessContext as any}
        />
      </IntlProvider>,
    );
    element.find('[type="button"]').at(0).simulate('click');
    expect(promise).toHaveBeenCalledTimes(1);
  });

  it('should show correct text if request access type is REQUEST_ACCESS', () => {
    const requestAccessContext = { callToActionMessageKey: 'request_access' };
    const element = mount(
      <IntlProvider locale={'en'}>
        <InlineCardForbiddenView
          url={URL}
          requestAccessContext={requestAccessContext as any}
        />
      </IntlProvider>,
    );
    expect(element.text()).toEqual(`${URL} - Request access`);
  });

  it('should do promise if request access is clicked', () => {
    const promise = jest.fn();
    const requestAccessContext = {
      callToActionMessageKey: 'request_access',
      action: { promise },
    };
    const element = mount(
      <IntlProvider locale={'en'}>
        <InlineCardForbiddenView
          url={URL}
          requestAccessContext={requestAccessContext as any}
        />
      </IntlProvider>,
    );
    element.find('[type="button"]').at(0).simulate('click');
    expect(promise).toHaveBeenCalledTimes(1);
  });
});
