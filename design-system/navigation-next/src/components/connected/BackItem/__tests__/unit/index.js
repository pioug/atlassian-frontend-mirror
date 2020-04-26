import React from 'react';

import { shallow } from 'enzyme';

import ArrowLeftCircleIcon from '@atlaskit/icon/glyph/arrow-left-circle';

import ConnectedItem from '../../../ConnectedItem';
import BackItem from '../../index';

describe('BackItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should render a ConnectedItem', () => {
    const wrapper = shallow(<BackItem />);

    expect(wrapper.find(ConnectedItem)).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should provide a default before prop if one is not provided', () => {
    const wrapper = shallow(<BackItem />);

    const BeforeComp = wrapper.find(ConnectedItem).prop('before');
    expect(BeforeComp).toEqual(expect.any(Function));

    const beforeEl = shallow(<BeforeComp />);
    expect(beforeEl.find(ArrowLeftCircleIcon)).toHaveLength(1);
    expect(beforeEl).toMatchSnapshot();
  });

  it('should use before prop if one exists', () => {
    const MyBeforeComp = () => <span>...</span>;
    const wrapper = shallow(<BackItem before={MyBeforeComp} />);

    expect(wrapper.find(ConnectedItem).prop('before')).toEqual(MyBeforeComp);
  });

  it("should use default text of 'Back' if no text prop is provided", () => {
    const wrapper = shallow(<BackItem />);

    expect(wrapper.find(ConnectedItem).prop('text')).toBe('Back');

    wrapper.setProps({ text: 'Settings' });
    expect(wrapper.find(ConnectedItem).prop('text')).toBe('Settings');
  });

  it("should explicitly set after prop of ConnectedItem to null to opt-out of GoTo item's default after icon", () => {
    const wrapper = shallow(<BackItem />);

    expect(wrapper.find(ConnectedItem).prop('after')).toBe(null);
  });
});
