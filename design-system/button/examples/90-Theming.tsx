/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Component, CSSProperties } from 'react';
import AddIcon from '@atlaskit/icon/glyph/editor/add';
import Select, { OptionType, ValueType } from '@atlaskit/select';
import * as colors from '@atlaskit/theme/colors';

import Button, { ButtonGroup, Theme as ButtonTheme, ButtonProps } from '../src';

interface ThemeProps {
  mode?: any;
  appearance?: any;
  state?: any;
}

const ThemedButton = (props: ButtonProps) => (
  <Button
    {...props}
    theme={(currentTheme, themeProps) => {
      const { buttonStyles, ...rest } = currentTheme(themeProps);
      return {
        buttonStyles: {
          ...buttonStyles,
          ...baseStyles,
          ...extract(customTheme, themeProps),
        },
        ...rest,
      };
    }}
  />
);

const options: OptionType[] = [
  { value: 'light', label: 'Light Theme' },
  { value: 'dark', label: 'Dark Mode' },
];

export default class extends Component {
  state = {
    mode: options[1],
  };

  render() {
    const { mode } = this.state;

    return (
      <div css={{ margin: 20 }}>
        <h3 css={{ marginBottom: 15 }}>ADG Button</h3>
        <ButtonGroup>
          <Button iconBefore={<AddIcon label="add" />}>Button</Button>
          <Button appearance="primary">Button</Button>
          <Button appearance="warning">Button</Button>
        </ButtonGroup>

        <h3 css={{ marginBottom: 15 }}>Themed Button</h3>
        <ButtonGroup>
          <ThemedButton iconBefore={<AddIcon label="add" />}>
            Button
          </ThemedButton>
          <ThemedButton appearance="primary">Button</ThemedButton>
          <ThemedButton isDisabled>Button</ThemedButton>
        </ButtonGroup>

        <h3 css={{ marginBottom: 15 }}>Light + Dark Themes</h3>
        <div
          style={{
            padding: 20,
            backgroundColor: mode.value === 'light' ? colors.N0 : colors.N800,
            border: mode.value === 'light' ? `2px solid ${colors.N800}` : '',
            borderRadius: '5px',
          }}
        >
          <ButtonTheme.Provider
            value={(current, props) =>
              current({ ...props, mode: mode.value as any })
            }
          >
            <ButtonGroup>
              <Button>Default Button</Button>
              <Button appearance="primary">Primary Button</Button>
              <Button appearance="subtle">Subtle Button</Button>
            </ButtonGroup>
          </ButtonTheme.Provider>
          <Select
            styles={{
              container: (provided: CSSProperties) => ({
                ...provided,
                marginTop: 10,
              }),
            }}
            options={options}
            defaultValue={mode}
            onChange={(mode: ValueType<OptionType>) => this.setState({ mode })}
          />
        </div>
      </div>
    );
  }
}

const baseStyles = {
  border: 'none',
  padding: '0px 15px',
  borderRadius: '15px',
  fontWeight: 'bold',
};

const customTheme = {
  default: {
    background: {
      default: colors.N30,
      hover: colors.N40,
      active: colors.N50,
    },
    boxShadow: {
      default: `1px 2px 0 0 ${colors.N40A}`,
      hover: `1px 2px 0 0 ${colors.N50A}`,
      active: '0px 0px 0 0',
    },
    transform: {
      default: 'initial',
      active: 'translateY(2px) translateX(1px)',
    },
    transition: {
      default:
        'background 0.1s ease-out, box-shadow 0.1s cubic-bezier(0.47, 0.03, 0.49, 1.38) transform:0.1s',
      active:
        'background 0s ease-out, box-shadow 0s cubic-bezier(0.47, 0.03, 0.49, 1.38) transform:0s',
    },
  },
  primary: {
    background: {
      default: '#00AECC',
      hover: '#0098B7',
      active: '#0082A0',
    },
    boxShadow: {
      default: `1px 2px 0 0 #0098B7`,
      hover: `1px 2px 0 0 #0082A0`,
      active: '0px 0px 0 0',
    },
    transform: {
      default: 'initial',
      active: 'translateY(2px) translateX(1px)',
    },
    transition: {
      default:
        'background 0.1s ease-out, box-shadow 0.1s cubic-bezier(0.47, 0.03, 0.49, 1.38) transform:0.1s',
      active:
        'background 0s ease-out, box-shadow 0s cubic-bezier(0.47, 0.03, 0.49, 1.38) transform:0s',
    },
  },
};

function extract(newTheme: any, { mode, appearance, state }: ThemeProps) {
  if (!newTheme[appearance]) {
    return undefined;
  }
  const root = newTheme[appearance];
  return Object.keys(root).reduce((acc: { [index: string]: string }, val) => {
    let node = root;
    [val, state, mode].forEach(item => {
      if (!node[item]) {
        return undefined;
      }
      if (typeof node[item] !== 'object') {
        acc[val] = node[item];
        return undefined;
      }
      node = node[item];
      return undefined;
    });
    return acc;
  }, {});
}
