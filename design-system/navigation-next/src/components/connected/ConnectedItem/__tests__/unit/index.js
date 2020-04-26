import React from 'react';

import { shallow } from 'enzyme';

import Item from '../../../../presentational/Item';
import GoToItem from '../../../GoToItem';
import ConnectedItem from '../../index';

describe('ConnectedItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should render a presentational Item if goTo prop does NOT exist', () => {
    const wrapper = shallow(<ConnectedItem id="my-item" text="My item" />);

    expect(wrapper.find(Item)).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render a GoToItem if goTo prop exists', () => {
    const wrapper = shallow(
      <ConnectedItem id="my-item" text="My item" goTo="another-view" />,
    );

    expect(wrapper.find(GoToItem)).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });
});
