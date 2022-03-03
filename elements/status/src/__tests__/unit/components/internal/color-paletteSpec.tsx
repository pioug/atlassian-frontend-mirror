import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme-next';
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
