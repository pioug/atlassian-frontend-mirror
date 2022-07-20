import { mount } from 'enzyme';
import React from 'react';

import { Breakpoint } from '../../common';
import { NewFileExperienceWrapper } from '../newFileExperienceWrapper';
import { NewFileExperienceWrapperProps } from '../types';

const setup = (props: NewFileExperienceWrapperProps) => {
  return mount(<NewFileExperienceWrapper {...props} />);
};

const setupProps = (props: any) => {
  const wrapperProps = {
    breakpoint: Breakpoint.SMALL,
    displayBackground: false,
    disableOverlay: false,
    selected: false,
    isPlayButtonClickable: false,
    isTickBoxSelectable: false,
    shouldDisplayTooltip: false,
  };
  return Object.assign(wrapperProps, props);
};

describe('New File Experience Wrapper styles', () => {
  it('Should apply background if displayBackground is true', () => {
    const props = setupProps({ displayBackground: true });
    const component = setup(props);

    const wrapper = component.find('div#newFileExperienceWrapper');
    const styles = getComputedStyle(wrapper.getDOMNode());

    expect(styles.backgroundColor).toBe('rgb(244, 245, 247)');
  });
});
