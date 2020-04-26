/** @jsx jsx */
import { jsx } from '@emotion/core';

import Icon from '@atlaskit/icon';
import { colors } from '@atlaskit/theme';

import { CSSFn, CustomItem, CustomItemComponentProps } from '../src';

import Slack from './icons/slack';

const CustomComponent: React.FC<CustomItemComponentProps & {
  href: string;
}> = ({ children, href, ...props }) => {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
};

const cssFn: CSSFn = (currentStyles, state) => {
  return {
    ...currentStyles,
    position: 'relative',
    overflow: 'hidden',
    userSelect: 'none',
    ':before': state.isDisabled
      ? {}
      : {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          transform: 'translateX(-1px)',
          transition: 'transform 70ms ease-in-out',
          backgroundColor: colors.B100,
        },

    ':hover:before': state.isDisabled
      ? {}
      : {
          transform: 'translateX(0)',
        },
  };
};

export default () => (
  <div onClick={e => e.preventDefault()}>
    <CustomItem
      href="/navigation-system"
      component={CustomComponent}
      cssFn={cssFn}
    >
      Navigation System
    </CustomItem>
    <CustomItem
      href="/navigation-system-1"
      isSelected
      component={CustomComponent}
      cssFn={cssFn}
    >
      Navigation System
    </CustomItem>
    <CustomItem
      href="/navigation-system-2"
      isDisabled
      component={CustomComponent}
      cssFn={cssFn}
    >
      Navigation System
    </CustomItem>
    <CustomItem
      href="/navigation-system-3"
      component={CustomComponent}
      iconBefore={<Icon glyph={Slack} label="" />}
      cssFn={cssFn}
    >
      Navigation System
    </CustomItem>
    <CustomItem
      href="/navigation-system-4"
      component={CustomComponent}
      iconBefore={<Icon glyph={Slack} label="" />}
      description="Next-gen software project"
      cssFn={cssFn}
    >
      Navigation System
    </CustomItem>
  </div>
);
