import React from 'react';
import { mount } from 'enzyme';
import merge from 'lodash.merge';
import Checkbox from '../../Checkbox';
import { ComponentTokens, ThemeTokens } from '../../types';

beforeEach(async () => {
  jest.spyOn(global.console, 'error');
});

afterEach(() => {
  // @ts-ignore - Property 'mockRestore' does not exist
  global.console.error.mockRestore();
});

describe('<Checkbox/>', () => {
  const makeCustomTheme = jest.fn((customTheme: ComponentTokens) => {
    return (
      current: (props: {
        tokens: ComponentTokens;
        mode: string;
      }) => ThemeTokens,
      props: { tokens: ComponentTokens; mode: string },
    ) => {
      const themeTokens = current(props);
      return merge({}, themeTokens, customTheme);
    };
  });

  it('should use custom theming function', () => {
    const customTheme = makeCustomTheme({
      label: {
        spacing: {
          top: '6px',
        },
      },
    });

    mount(<Checkbox theme={customTheme} />);
    expect(makeCustomTheme).toHaveBeenCalled();
  });

  it('should pass custom tokens into internal LabelText component', () => {
    const customTheme = makeCustomTheme({
      label: {
        spacing: {
          top: '6px',
        },
      },
    });

    const wrapper = mount(<Checkbox theme={customTheme} />);
    const labelText = wrapper.find('LabelText');
    expect((labelText.prop('tokens') as ThemeTokens).label.spacing.top).toEqual(
      '6px',
    );
  });

  it('should pass custom tokens into internal CheckboxIcon component', () => {
    const customTheme = makeCustomTheme({
      icon: {
        size: 'large',
      },
    });

    const wrapper = mount(<Checkbox theme={customTheme} />);
    const icon = wrapper.find('Icon');
    expect(icon.prop('size')).toEqual('large');
  });

  it('should pass custom tokens into internal IconWrapper component', () => {
    const customTheme = makeCustomTheme({
      icon: {
        borderWidth: '2px',
      },
    });

    const wrapper = mount(<Checkbox theme={customTheme} />);
    const iconWrapper = wrapper.find('IconWrapper');
    expect(
      (iconWrapper.prop('tokens') as ThemeTokens).icon.borderWidth,
    ).toEqual('2px');
  });

  it('should not break with the inclusion of non-existent user tokens', () => {
    const customTheme = makeCustomTheme({
      label: {
        spacing: {
          top: '6px',
          nonexistent_token: '',
        },
        // @ts-ignore
        nonexistent_token: {},
      },
    });
    mount(<Checkbox theme={customTheme} />);
    expect(global.console.error).not.toHaveBeenCalled();
  });
});
