import Button from '@atlaskit/button/standard-button';
import { mount, shallow } from 'enzyme';
import React from 'react';
import { Trigger } from '../../../components/Trigger';

const noop = () => {};

describe('@atlaskit/reactions/trigger', () => {
  it('should render a button', () => {
    const trigger = shallow(<Trigger onClick={noop} />);
    expect(trigger.find(Button).length).toEqual(1);
  });

  it('should add "miniMode" css-class when miniMode is true', () => {
    const trigger = shallow(<Trigger miniMode={true} onClick={noop} />);
    expect(trigger.hasClass('miniMode')).toEqual(true);
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
