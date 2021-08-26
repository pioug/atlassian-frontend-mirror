/** @jsx jsx */
import { jsx } from '@emotion/core';

import Icon from '@atlaskit/icon';
import { B100 } from '@atlaskit/theme/colors';

import { CSSFn, CustomItem, CustomItemComponentProps } from '../src';

import Slack from './icons/slack';

const CustomComponent: React.FC<
  CustomItemComponentProps & {
    href: string;
  }
> = ({ children, href, ...props }) => {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
};

const cssFn: CSSFn = (state) => {
  return {
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
          // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
          backgroundColor: B100,
        },

    ':hover:before': state.isDisabled
      ? {}
      : {
          transform: 'translateX(0)',
        },
  };
};

export default () => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
  <div onClick={(e) => e.preventDefault()}>
    <CustomItem
      href="/navigation-system"
      component={CustomComponent}
      // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
      cssFn={cssFn}
    >
      Navigation System
    </CustomItem>
    <CustomItem
      href="/navigation-system-1"
      isSelected
      component={CustomComponent}
      // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
      cssFn={cssFn}
    >
      Navigation System
    </CustomItem>
    <CustomItem
      href="/navigation-system-2"
      isDisabled
      component={CustomComponent}
      // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
      cssFn={cssFn}
    >
      Navigation System
    </CustomItem>
    <CustomItem
      href="/navigation-system-3"
      component={CustomComponent}
      iconBefore={<Icon glyph={Slack} label="" />}
      // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
      cssFn={cssFn}
    >
      Navigation System
    </CustomItem>
    <CustomItem
      href="/navigation-system-4"
      component={CustomComponent}
      iconBefore={<Icon glyph={Slack} label="" />}
      description="Next-gen software project"
      // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
      cssFn={cssFn}
    >
      Navigation System
    </CustomItem>
  </div>
);
