import React from 'react';
import { mount } from 'enzyme';
import Button, { ButtonGroup } from '../../..';

const Component = React.forwardRef<
  HTMLElement,
  React.AllHTMLAttributes<HTMLElement>
>((props, ref) => null);

const customProps: Record<string, any> = { customProp: 1 };

describe('getButtonProps', () => {
  it('should pass through all props to a custom component', () => {
    const cmp = mount(<Button {...customProps} component={Component} />);
    expect(cmp.find(Component).prop('customProp')).toBe(1);
  });

  it('should not pass through all props to an inbuilt component', () => {
    const cmp = mount(<Button {...customProps} />);
    expect(cmp.find('button').prop('customProp')).toBe(1);
  });

  it('should add appearance props', () => {
    const cmp = mount(<Button />);
    expect(Object.keys(cmp.find('button').props())).toEqual(
      expect.arrayContaining([
        'onClick',
        'autoFocus',
        'onMouseEnter',
        'onMouseLeave',
        'onMouseDown',
        'onMouseUp',
        'onFocus',
        'onBlur',
      ]),
    );
  });

  it('should add interaction handler props', () => {
    const cmp = mount(<Button />);
    expect(Object.keys(cmp.find('button').props())).toEqual(
      expect.arrayContaining([
        'onBlur',
        'onFocus',
        'onMouseDown',
        'onMouseEnter',
        'onMouseLeave',
        'onMouseUp',
      ]),
    );
  });

  it('should pass interaction handler functions directly from the component', () => {
    const onBlur = () => {};
    const onFocus = () => {};
    const onMouseDown = () => {};
    const onMouseEnter = () => {};
    const onMouseLeave = () => {};
    const onMouseUp = () => {};

    const cmp = mount(
      <Button
        onBlur={onBlur}
        onFocus={onFocus}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
      />,
    );

    expect(cmp.find('button').prop('onBlur')).not.toBe(onBlur);
    expect(cmp.find('button').prop('onFocus')).not.toBe(onFocus);
    expect(cmp.find('button').prop('onMouseDown')).not.toBe(onMouseDown);
    expect(cmp.find('button').prop('onMouseEnter')).not.toBe(onMouseEnter);
    expect(cmp.find('button').prop('onMouseLeave')).not.toBe(onMouseLeave);
    expect(cmp.find('button').prop('onMouseUp')).not.toBe(onMouseUp);
  });

  it('should pass the onClick handler from props', () => {
    const onClick = () => {};
    const cmp = mount(<Button onClick={onClick} />);
    expect(cmp.find('button').prop('onClick')).toEqual(expect.anything());
  });

  it('should add href and target props to a link', () => {
    const cmp = mount(<Button href="#" target="" />);
    expect(Object.keys(cmp.find('a').props())).toEqual(
      expect.arrayContaining(['href', 'target']),
    );

    const cmp2 = mount(<Button href="#" target="" isDisabled />);
    expect(
      Object.keys(
        cmp2
          .find('span')
          .first()
          .props(),
      ),
    ).not.toEqual(expect.arrayContaining(['href', 'target']));
  });
});

describe('getButtonGroupProps > ', () => {
  it('should not default appearance', () => {
    const cmp = mount(
      <ButtonGroup>{<Button appearance="primary" />}</ButtonGroup>,
    );
    expect(cmp.find(Button).prop('appearance')).toBe('primary');
  });

  it('should not default to another value if changed', () => {
    const cmp = mount(
      <ButtonGroup>{<Button appearance="warning" />}</ButtonGroup>,
    );
    expect(cmp.find(Button).prop('appearance')).toBe('warning');
  });
});
