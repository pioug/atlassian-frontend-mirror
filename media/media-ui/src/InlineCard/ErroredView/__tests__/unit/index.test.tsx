import React from 'react';
import { mount } from 'enzyme';
import { InlineCardErroredView } from '../..';
import { IntlProvider } from 'react-intl';

const URL =
  'http://product.example.com/lorem/ipsum/dolor/sit/amet/consectetur/adipiscing/volutpat/';

describe('Unauth view', () => {
  it('should do click if try again clicked', () => {
    const onRetrySpy = jest.fn();
    const element = mount(
      <IntlProvider locale={'en'}>
        <InlineCardErroredView url={URL} message="Error" onRetry={onRetrySpy} />
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
        <InlineCardErroredView
          url={URL}
          onRetry={onRetrySpy}
          message="Error"
          onClick={onClickSpy}
        />
      </IntlProvider>,
    );
    element.find('button').simulate('click');
    expect(onRetrySpy).toHaveBeenCalledTimes(1);
    expect(onClickSpy).not.toHaveBeenCalled();
  });
});
