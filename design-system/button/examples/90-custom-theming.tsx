/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/** @jsx jsx */
import { CSSObject, jsx } from '@emotion/core';

import AddIcon from '@atlaskit/icon/glyph/editor/add';
import * as colors from '@atlaskit/theme/colors';

import {
  ButtonGroup,
  CustomThemeButton,
  Theme,
  ThemeProps,
  ThemeTokens,
} from '../src';

function ourTheme(
  currentTheme: (props: ThemeProps) => ThemeTokens,
  themeProps: ThemeProps,
): ThemeTokens {
  const { buttonStyles, ...rest } = currentTheme(themeProps);
  return {
    buttonStyles: {
      ...buttonStyles,
      ...baseStyles,
      ...extract(themeProps),
    },
    ...rest,
  };
}

function Example() {
  return (
    <div css={{ margin: 20 }}>
      <h3 css={{ marginBottom: 15 }}>ADG Button</h3>
      <ButtonGroup>
        <CustomThemeButton iconBefore={<AddIcon label="add" />}>
          Button
        </CustomThemeButton>
        <CustomThemeButton appearance="primary">Button</CustomThemeButton>
        <CustomThemeButton appearance="warning">Button</CustomThemeButton>
      </ButtonGroup>

      <h3 css={{ marginBottom: 15 }}>Themed Button</h3>
      <ButtonGroup>
        <CustomThemeButton
          theme={ourTheme}
          iconBefore={<AddIcon label="add" />}
        >
          Button
        </CustomThemeButton>
        <CustomThemeButton theme={ourTheme} appearance="primary">
          Button
        </CustomThemeButton>
        <CustomThemeButton theme={ourTheme} appearance="primary" isLoading>
          Button
        </CustomThemeButton>
        <CustomThemeButton theme={ourTheme} isDisabled>
          Button
        </CustomThemeButton>
      </ButtonGroup>

      <h3 css={{ marginBottom: 15 }}>Themed using Theme.Provider</h3>
      <Theme.Provider value={ourTheme}>
        <ButtonGroup>
          <CustomThemeButton iconBefore={<AddIcon label="add" />}>
            Button
          </CustomThemeButton>
          <CustomThemeButton appearance="primary">Button</CustomThemeButton>
          <CustomThemeButton appearance="primary" isLoading>
            Button
          </CustomThemeButton>
          <CustomThemeButton isDisabled>Button</CustomThemeButton>
        </ButtonGroup>
      </Theme.Provider>
    </div>
  );
}

export default () => <Example />;

const baseStyles: CSSObject = {
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

function extract({
  mode,
  appearance = 'default',
  state,
}: ThemeProps): CSSObject | undefined {
  // @ts-ignore
  const root = customTheme[appearance];

  if (!root) {
    return undefined;
  }
  return Object.keys(root).reduce((acc: { [index: string]: string }, val) => {
    let node = root;
    [val, state, mode].forEach((item) => {
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
