import React from 'react';
import { Checkbox } from '../src';
import {
  ComponentTokens,
  ThemeTokens,
  LabelCSSProps,
  IconWrapperCSSProps,
} from '../src/types';
import merge from 'lodash.merge';

import Icon, { IconProps } from '@atlaskit/icon';

const customGlyph = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    focusable="false"
    role="presentation"
  >
    <g fillRule="evenodd">
      <rect fill="currentColor" x="4" y="4" width="16" height="16" rx="2" />
      <path
        d="M1.49022 3.21486C1.2407 2.94412 0.818938 2.92692 0.548195 3.17644C0.277453 3.42597 0.260252 3.84773 0.509776 4.11847L2.91785 6.73131C3.2762 7.08204 3.80964 7.08204 4.14076 6.75092C4.18159 6.71082 4.18159 6.71082 4.38359 6.51218C4.57995 6.31903 4.79875 6.1037 5.03438 5.87167C5.70762 5.20868 6.38087 4.54459 7.00931 3.92318L7.0362 3.89659C8.15272 2.79246 9.00025 1.9491 9.47463 1.46815C9.73318 1.20602 9.73029 0.783922 9.46815 0.525367C9.20602 0.266812 8.78392 0.269712 8.52537 0.531843C8.05616 1.00754 7.21125 1.84829 6.09866 2.94854L6.07182 2.97508C5.4441 3.59578 4.77147 4.25926 4.09883 4.92165C3.90522 5.11231 3.72299 5.29168 3.55525 5.4567L1.49022 3.21486Z"
        fill="inherit"
      />
    </g>
  </svg>
);
// would be nice if we could just inline <Icon /> as `component`
class CustomIcon extends React.Component<IconProps, {}> {
  render() {
    return (
      <Icon
        glyph={customGlyph}
        label="custom"
        size="medium"
        primaryColor="inherit"
        secondaryColor="inherit"
      />
    );
  }
}

const newThemeTokens: ComponentTokens = {
  label: {
    spacing: {
      top: '6px',
      bottom: '6px',
      left: '4px', // svg has 4px "padding" already
    },
  },
  icon: {
    borderColor: {
      rest: '#DFE1E6', // N40
      hovered: '#DFE1E6', // N40
      active: '#E4F0F6', //Blue50
      disabled: '#F4F5F7', //N20
      invalid: '#EB5A46', //red500
      checked: '#0079BF', //Blue500
      hoveredAndChecked: '#5BA4CF', //Blue300
      focused: '#0079BF', // blue500
    },
    boxColor: {
      rest: '#FAFBFC', //N10
      hovered: '#EBECF0', //N30
      active: '#E4F0F6', //Blue50
      disabled: '#F4F5F7', //N20
      checked: '#0079BF', //Blue500
      hoveredAndChecked: '#5BA4CF', //Blue300
    },
    tickColor: {
      rest: 'transparent',
      checked: '#FFF',
      activeAndChecked: '#0079BF', //Blue500
    },
  },
};

const customTheme = (
  current: (props: { tokens: ComponentTokens; mode: string }) => ThemeTokens,
  props: { tokens: ComponentTokens; mode: string },
) => {
  const themeTokens = current(props);
  return merge({}, themeTokens, newThemeTokens);
};

const customIconWrapperStyles = (
  defaultStyles: any,
  state: IconWrapperCSSProps,
) => {
  return {
    ...defaultStyles,
    '& path': {
      transform: 'translate(7px, 8.5px);',
    },
  };
};

const customLabelStyles = (defaultStyles: any, state: LabelCSSProps) => {
  return {
    ...defaultStyles,
    alignItems: 'center',
  };
};
export default () => (
  <>
    <Checkbox label="Normie" />
    <Checkbox
      label="Label"
      theme={customTheme}
      overrides={{
        Icon: {
          component: CustomIcon,
        },
        IconWrapper: {
          cssFn: customIconWrapperStyles,
        },
        Label: {
          cssFn: customLabelStyles,
        },
      }}
    />
  </>
);
