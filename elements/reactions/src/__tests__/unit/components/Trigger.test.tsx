import Button from '@atlaskit/button/standard-button';
import { mount } from 'enzyme';
import React from 'react';
import { Trigger } from '../../../components/Trigger';

const noop = () => {};

describe('@atlaskit/reactions/trigger', () => {
  it('should render a button', () => {
    const trigger = mount(<Trigger onClick={noop} />);
    expect(trigger.find(Button).length).toEqual(1);
  });

  it('should add "miniMode" css-class when miniMode is true', () => {
    const trigger = mount(<Trigger miniMode={true} onClick={noop} />);
    expect(trigger.find('button.miniMode').length).toEqual(1);
  });

  it('should call "onClick" when clicked', () => {
    const onClick = jest.fn();
    const trigger = mount(<Trigger onClick={onClick} />);
    trigger.simulate('click');
    expect(onClick).toHaveBeenCalled();
  });

  it('should disable button', () => {
    const onClick = jest.fn();
    const trigger = mount(<Trigger onClick={onClick} disabled />);
    trigger.find(Button).simulate('click');
    expect(onClick).not.toHaveBeenCalled();
  });
});
