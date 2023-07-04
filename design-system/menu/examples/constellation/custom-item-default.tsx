/** @jsx jsx */
import type { MouseEvent } from 'react';

import { jsx } from '@emotion/react';

import Icon from '@atlaskit/icon';
import { Box } from '@atlaskit/primitives';
import { B100 } from '@atlaskit/theme/colors';

import { CSSFn, CustomItem, CustomItemComponentProps } from '../../src';
import Slack from '../icons/slack';

type CustomComponentWithHrefProps = CustomItemComponentProps & {
  href: string;
};

const CustomComponent = ({
  children,
  href,
  ...props
}: CustomComponentWithHrefProps) => {
  return (
    // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
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
    '::before': state.isDisabled
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

          backgroundColor: B100,
        },

    ':hover::before': state.isDisabled
      ? {}
      : {
          transform: 'translateX(0)',
        },
  };
};

export default () => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
  <Box onClick={(e: MouseEvent) => e.preventDefault()}>
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
  </Box>
);
