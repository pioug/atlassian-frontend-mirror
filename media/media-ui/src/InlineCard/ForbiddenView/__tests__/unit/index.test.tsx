import React from 'react';
import { mount } from 'enzyme';
import { InlineCardForbiddenView } from '../..';
import { IntlProvider } from 'react-intl';

const URL =
  'http://product.example.com/lorem/ipsum/dolor/sit/amet/consectetur/adipiscing/volutpat/';

describe('Unauth view', () => {
  it('should do click if try again clicked', () => {
    const onRetrySpy = jest.fn();
    const element = mount(
      <IntlProvider locale={'en'}>
        <InlineCardForbiddenView url={URL} onAuthorise={onRetrySpy} />
      </IntlProvider>,
    );
    element.find('button').simulate('click');
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
    element.find('button').simulate('click');
    expect(onRetrySpy).toHaveBeenCalledTimes(1);
    expect(onClickSpy).not.toHaveBeenCalled();
  });
});
