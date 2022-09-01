import React from 'react';
import { mount } from 'enzyme';
import { matchers } from '@emotion/jest';
import Button from '@atlaskit/button/standard-button';
import { Trigger } from './Trigger';
import { DISABLED_BUTTON_COLOR } from './styles';

// Add the custom matchers provided by '@emotion/jest'
expect.extend(matchers);

const noop = () => {};

describe('@atlaskit/reactions/components/Trigger', () => {
  it('should render a button', () => {
    const trigger = mount(<Trigger onClick={noop} />);
    expect(trigger.find(Button).length).toEqual(1);
  });

  it('should have miniMode css when miniMode is true', () => {
    const trigger = mount(<Trigger miniMode={true} onClick={noop} />);
    expect(trigger.find('button')).toHaveStyleRule('width', '24px');
  });

  it('should have disabled css when disabled is true', () => {
    const trigger = mount(<Trigger disabled={true} onClick={noop} />);
    // need to remove the whitespace for expected string, as emotion removed whitespace when compile styling
    const colorValue = DISABLED_BUTTON_COLOR.replace(/\s/g, '');
    expect(trigger.find('button')).toHaveStyleRule('cursor', 'not-allowed');
    expect(trigger.find('button')).toHaveStyleRule('color', colorValue);
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
