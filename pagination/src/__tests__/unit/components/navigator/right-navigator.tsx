import React from 'react';
import { mount } from 'enzyme';
import Button from '@atlaskit/button';
import ChevronRightLargeIcon from '@atlaskit/icon/glyph/chevron-right-large';

import { name } from '../../../../version.json';
import RightNavigator from '../../../../components/Navigators/RightNavigator';

describe(`${name} - RightNavigator`, () => {
  it('default props', () => {
    const wrapper = mount(<RightNavigator />);
    expect(wrapper.find(Button).prop('aria-label')).toBe('next');
    expect(wrapper.find(Button).prop('isDisabled')).toBe(false);
    /** renders right chevron */
    expect(wrapper.find(ChevronRightLargeIcon).length).toBe(1);
  });
  it('should passes down aria-label as aria-label to button', () => {
    const wrapper = mount(<RightNavigator aria-label="label" />);
    expect(wrapper.find(Button).prop('aria-label')).toBe('label');
  });
  it('should passes down isDisabled prop to button', () => {
    const wrapper = mount(<RightNavigator isDisabled />);
    expect(wrapper.find(Button).prop('isDisabled')).toBe(true);
  });
  it('should passes down children prop to button', () => {
    const wrapper = mount(<RightNavigator>$</RightNavigator>);
    expect(wrapper.find(Button).prop('children')).toBe('$');
  });
});
