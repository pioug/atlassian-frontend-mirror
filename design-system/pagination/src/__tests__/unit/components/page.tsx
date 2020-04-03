import React from 'react';
import { mount } from 'enzyme';
import Button from '@atlaskit/button';
import Page from '../../../components/Page';
import { name } from '../../../version.json';

describe(`${name} - Page component`, () => {
  it('renders child props', () => {
    const wrapper = mount(<Page isSelected>1</Page>);
    expect(wrapper.text()).toBe('1');
  });
  it('passes in isSelected props to button', () => {
    const wrapper = mount(<Page isSelected>1</Page>);
    const button = wrapper.find(Button);
    expect(button.prop('isSelected')).toBe(true);
  });
  it('calls onClick on click', () => {
    const onClickSpy = jest.fn();
    const wrapper = mount(
      <Page isSelected={false} onClick={onClickSpy}>
        1
      </Page>,
    );
    wrapper.simulate('click');
    expect(onClickSpy).toHaveBeenCalled();
  });
  it('renders subbtle button', () => {
    const wrapper = mount(<Page isSelected>1</Page>);
    const button = wrapper.find(Button);
    expect(button.prop('appearance')).toBe('subtle');
  });
  it('passes in selected props to button', () => {
    const wrapper = mount(
      <Page href="#href" isSelected>
        1
      </Page>,
    );
    const button = wrapper.find(Button);
    expect(button.prop('href')).toBe('#href');
  });
});
