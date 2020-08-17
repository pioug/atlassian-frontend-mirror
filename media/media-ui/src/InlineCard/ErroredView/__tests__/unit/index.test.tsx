import React from 'react';
import { mount } from 'enzyme';
import { InlineCardErroredView } from '../..';
import { IntlProvider } from 'react-intl';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import ErrorIcon from '@atlaskit/icon/glyph/error';

const URL =
  'http://product.example.com/lorem/ipsum/dolor/sit/amet/consectetur/adipiscing/volutpat/';

describe('Errored view', () => {
  it('should do click if try again clicked', () => {
    const onRetrySpy = jest.fn();
    const element = mount(
      <IntlProvider locale={'en'}>
        <InlineCardErroredView url={URL} message="Error" onRetry={onRetrySpy} />
      </IntlProvider>,
    );
    element.find('span[type="button"]').simulate('click');
    expect(onRetrySpy).toHaveBeenCalledTimes(1);
  });

  it('should accept custom icon', () => {
    const onRetrySpy = jest.fn();
    const element = mount(
      <IntlProvider locale={'en'}>
        <InlineCardErroredView
          url={URL}
          message="Error"
          onRetry={onRetrySpy}
          icon={<WarningIcon label="my-icon" />}
        />
      </IntlProvider>,
    );
    element.find('span[type="button"]').simulate('click');
    expect(onRetrySpy).toHaveBeenCalledTimes(1);
    expect(element.find(WarningIcon)).toHaveLength(1);
  });

  it('should render error icon by default', () => {
    const onRetrySpy = jest.fn();
    const element = mount(
      <IntlProvider locale={'en'}>
        <InlineCardErroredView url={URL} message="Error" onRetry={onRetrySpy} />
      </IntlProvider>,
    );
    element.find('span[type="button"]').simulate('click');
    expect(onRetrySpy).toHaveBeenCalledTimes(1);
    expect(element.find(ErrorIcon)).toHaveLength(1);
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
    element.find('span[type="button"]').simulate('click');
    expect(onRetrySpy).toHaveBeenCalledTimes(1);
    expect(onClickSpy).not.toHaveBeenCalled();
  });
});
