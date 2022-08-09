import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { ReactWrapper } from 'enzyme';
import React from 'react';
import Color from '../../../../components/internal/color';
import ColorPalette from '../../../../components/internal/color-palette';

describe('ColorPalette', () => {
  it('should render 6 colors', () => {
    const onClick = jest.fn();
    const onHover = jest.fn();
    const component = mountWithIntl(
      <ColorPalette
        onClick={onClick}
        onHover={onHover}
        selectedColor={'red'}
      />,
    );

    const colorComponent = component.find(Color);
    expect(colorComponent.length).toBe(6);
    expect(colorComponent.first().props().onClick).toBe(onClick);
    expect(colorComponent.first().props().onHover).toBe(onHover);
  });

  it('should select selected color', () => {
    const component = mountWithIntl(
      <ColorPalette onClick={jest.fn()} selectedColor={'red'} />,
    );

    expect(
      component.findWhere(
        (n: ReactWrapper) => n.is(Color) && n.prop('isSelected'),
      ).length,
    ).toBe(1);
  });

  it('should not select if no selected color', () => {
    const component = mountWithIntl(<ColorPalette onClick={jest.fn()} />);

    expect(
      component.findWhere((n: any) => n.is(Color) && n.prop('isSelected'))
        .length,
    ).toBe(0);
  });
});

describe('ColorPalette keyboard navigation', () => {
  it('should select next color on tab', () => {
    const onClick = jest.fn();
    const component = mountWithIntl(
      <ColorPalette onClick={onClick} selectedColor={'neutral'} />,
    );

    // Simulate pressing of TAB key. Colors order defined internally in color-palette.tsx
    component.find('div').simulate('keydown', { keyCode: 9 });
    expect(onClick).toHaveBeenCalledWith('purple');
  });

  it('should select first color on tab at last color', () => {
    const onClick = jest.fn();
    const component = mountWithIntl(
      <ColorPalette onClick={onClick} selectedColor={'green'} />,
    );
    component.find('div').simulate('keydown', { keyCode: 9 });
    expect(onClick).toHaveBeenCalledWith('neutral');
  });

  it('should select previous color on shift-tab', () => {
    const onClick = jest.fn();
    const component = mountWithIntl(
      <ColorPalette onClick={onClick} selectedColor={'purple'} />,
    );
    component.find('div').simulate('keydown', { keyCode: 9, shiftKey: true });
    expect(onClick).toHaveBeenCalledWith('neutral');
  });

  it('should select last color on shift-tab at first color', () => {
    const onClick = jest.fn();
    const component = mountWithIntl(
      <ColorPalette onClick={onClick} selectedColor={'neutral'} />,
    );
    component.find('div').simulate('keydown', { keyCode: 9, shiftKey: true });
    expect(onClick).toHaveBeenCalledWith('green');
  });
});
