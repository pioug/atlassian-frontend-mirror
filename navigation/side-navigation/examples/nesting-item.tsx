/** @jsx jsx */
import { Fragment, MouseEvent } from 'react';

import { jsx } from '@emotion/react';

import Box from '@atlaskit/ds-explorations/box';
import OpenIcon from '@atlaskit/icon/glyph/open';
import SettingsIcon from '@atlaskit/icon/glyph/settings';

import {
  CustomItemComponentProps,
  GoBackItem,
  NestableNavigationContent,
  NestingItem,
  Section,
} from '../src';

const CustomNestingItem = ({
  children,
  href,
  ...props
}: CustomItemComponentProps & { href: string }) => {
  return (
    // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
    <a href={href} {...props}>
      {children}
    </a>
  );
};

const BasicExample = () => {
  return (
    <Box
      display="block"
      onClick={(e: MouseEvent) => e.preventDefault()}
      overflow="hidden"
      UNSAFE_style={{
        height: 340,
      }}
      as="div"
    >
      <NestableNavigationContent>
        <Section>
          <NestingItem id="0" title="Settings">
            <Fragment />
          </NestingItem>
          <NestingItem
            id="1"
            isSelected
            iconBefore={<SettingsIcon label="" />}
            title="Settings"
          >
            <Fragment />
          </NestingItem>
          <NestingItem
            description="I have a description"
            id="2"
            title="Settings"
          >
            <Fragment />
          </NestingItem>
          <NestingItem
            id="3"
            iconBefore={<SettingsIcon label="" />}
            iconAfter={<OpenIcon label="" />}
            title="Settings"
            description="I have a custom after element"
          >
            <Fragment />
          </NestingItem>
          <NestingItem
            id="4"
            iconBefore={<SettingsIcon label="" />}
            title="Settings"
            description="I have a custom back button"
            // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
            overrides={{
              GoBackItem: {
                render: (props) => (
                  <GoBackItem isSelected {...props}>
                    Go home, man!
                  </GoBackItem>
                ),
              },
            }}
          >
            <Fragment />
          </NestingItem>
          <NestingItem
            id="5"
            iconBefore={<SettingsIcon label="" />}
            title="Settings"
            description="I'm disabled"
            isDisabled
          >
            <Fragment />
          </NestingItem>
          <NestingItem
            id="6"
            href="/custom-link"
            iconBefore={<SettingsIcon label="" />}
            title="Settings"
            // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
            cssFn={() => ({
              // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
              color: 'red',
              '&:hover': {
                // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
                color: 'blue',
              },
            })}
            description="I have a custom item"
            component={CustomNestingItem}
          >
            <Fragment />
          </NestingItem>
        </Section>
      </NestableNavigationContent>
    </Box>
  );
};

export default BasicExample;
