import React from 'react';
import { shallow } from 'enzyme';
import { ColorPaletteMenuWithoutAnalytics as ColorPaletteMenu } from '../..';
import { ColorCardWrapper } from '../../styled/ColorPalette';
import ColorCard from '../../components/ColorCard';

describe('ColorPaletteMenu', () => {
  test('should render Color option', () => {
    const mockFn = jest.fn();
    const value = { value: 'blue', label: 'Blue' };
    const wrapper = shallow(
      <ColorPaletteMenu palette={[value]} onChange={mockFn} />,
    );

    expect(wrapper.find(ColorCardWrapper)).toHaveLength(1);
    expect(wrapper.find(ColorCard)).toHaveLength(1);

    expect(wrapper.find(ColorCard).props()['value']).toBe('blue');
    expect(wrapper.find(ColorCard).props()['label']).toBe('Blue');
  });

  test('should call onChange prop onClick', () => {
    const mockFn = jest.fn();
    const value = { value: 'blue', label: 'Blue' };
    const wrapper = shallow(
      <ColorPaletteMenu palette={[value]} onChange={mockFn} />,
    );

    const colorCard = wrapper.find(ColorCard);

    (colorCard.props() as any).onClick('blue');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('should call onChange prop onKeydown', () => {
    const mockFn = jest.fn();
    const value = { value: 'blue', label: 'Blue' };
    const wrapper = shallow(
      <ColorPaletteMenu palette={[value]} onChange={mockFn} />,
    );
    const colorCard = wrapper.find(ColorCard);

    (colorCard.props() as any).onKeyDown('blue');

    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
