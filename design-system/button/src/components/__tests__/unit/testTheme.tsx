/** @jsx jsx */
import { jsx } from '@emotion/core';
import { matchers } from 'jest-emotion';
import * as renderer from 'react-test-renderer';
import Button from '../../Button';
import { ButtonProps } from '../../../types';

const ThemedButton = (props: ButtonProps) => (
  <Button
    theme={(current, themeProps) => {
      const { buttonStyles, ...spinnerStyles } = current(themeProps);
      return {
        buttonStyles: {
          ...buttonStyles,
          width: '100px',
          height: '200px',
          margin: '20px',
        },
        spinnerStyles: {
          ...spinnerStyles,
          top: '90%',
        },
      };
    }}
    {...props}
  />
);

expect.extend(matchers);

describe('Theme: button', () => {
  it('should render button styles defined in custom theme', () => {
    const wrapper = renderer.create(<ThemedButton />).toJSON();

    expect(wrapper).toHaveStyleRule('width', '100px');
  });

  it('should render button styles defined in ADG theme if no custom theme passed in', () => {
    const wrapper = renderer
      .create(<Button theme={(current, props) => current(props)} />)
      .toJSON();

    expect(wrapper).toHaveStyleRule('width', 'auto');
  });

  it('should render spinner styles in custom theme', () => {
    const wrapper = renderer.create(<ThemedButton isLoading />).toJSON();

    const parent = wrapper && wrapper.children && wrapper.children[0].children;
    const child = parent && parent[0];

    expect(child).toHaveStyleRule('top', '90%');
  });

  it('should render spinner styles defined in ADG theme if no custom theme passed in', () => {
    const wrapper = renderer
      .create(<Button isLoading theme={(current, props) => current(props)} />)
      .toJSON();

    const parent = wrapper && wrapper.children && wrapper.children[0].children;
    const child = parent && parent[0];

    expect(child).toHaveStyleRule('top', '50%');
  });
});
