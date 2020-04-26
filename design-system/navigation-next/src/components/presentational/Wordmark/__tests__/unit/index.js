import React from 'react';

import { shallow } from 'enzyme';

import { JiraWordmark } from '@atlaskit/logo';

import Wordmark from '../../index';

describe('Wordmark', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should render correctly', () => {
    const wrapper = shallow(<Wordmark wordmark={JiraWordmark} />);

    expect(wrapper).toMatchSnapshot();
  });
});
