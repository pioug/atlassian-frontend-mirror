import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import DateComponent from '../../../../react/nodes/date';
import { IntlProvider, InjectedIntl } from 'react-intl';

import {
  timestampToString,
  todayTimestampInUTC,
  DateSharedCssClassName,
} from '@atlaskit/editor-common';

describe('Renderer - React/Nodes/Date', () => {
  let timestamp: string;
  let wrapper: ReactWrapper<any>;
  let date: ReactWrapper<any>;
  let dateNowMockFn: jest.SpyInstance;
  let dateUTCMockFn: jest.SpyInstance;
  let intl: InjectedIntl;

  beforeEach(() => {
    dateNowMockFn = jest.spyOn(Date, 'now');
    dateUTCMockFn = jest.spyOn(Date, 'UTC');

    dateUTCMockFn.mockImplementation(() => '1323993600000'); // 16 December 2011 00:00:00
    dateNowMockFn.mockImplementation(() => '1323993600000'); // 16 December 2011 00:00:00

    const intlProvider = new IntlProvider({
      locale: 'en',
    });
    intl = intlProvider.getChildContext().intl;
    timestamp = todayTimestampInUTC();
    wrapper = mount(
      <IntlProvider locale="en">
        <DateComponent timestamp={timestamp.toString()} />
      </IntlProvider>,
    );
    date = wrapper.find(DateComponent);
  });

  afterEach(() => {
    dateNowMockFn.mockRestore();
    dateUTCMockFn.mockRestore();
  });

  it('should render a <span>-tag', () => {
    const dateWrapper = date.find(`.${DateSharedCssClassName.DATE_WRAPPER}`);
    expect(dateWrapper.is('span')).toEqual(true);
  });

  it('should render formatted date', () => {
    expect(date.text()).toEqual(timestampToString(timestamp, intl));
  });

  it('should render date formatted as today inside task task', () => {
    const wrapper = mount(
      <IntlProvider locale="en">
        <DateComponent
          timestamp={timestamp.toString()}
          parentIsIncompleteTask={true}
        />
      </IntlProvider>,
    );
    const date = wrapper.find(DateComponent);
    expect(date.text()).toEqual('Today');
  });
});
