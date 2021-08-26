/** @jsx jsx */
import { jsx } from '@emotion/core';

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
    <a href={href} {...props}>
      {children}
    </a>
  );
};

const BasicExample = () => {
  return (
    <div
      onClick={(e) => e.preventDefault()}
      css={{ height: 340, overflow: 'hidden' }}
    >
      <NestableNavigationContent>
        <Section>
          <NestingItem id="0" title="Settings">
            <span />
          </NestingItem>
          <NestingItem
            id="1"
            isSelected
            iconBefore={<SettingsIcon label="" />}
            title="Settings"
          >
            <span />
          </NestingItem>
          <NestingItem
            description="I have a description"
            id="2"
            title="Settings"
          >
            <span />
          </NestingItem>
          <NestingItem
            id="3"
            iconBefore={<SettingsIcon label="" />}
            iconAfter={<OpenIcon label="" />}
            title="Settings"
            description="I have a custom after element"
          >
            <span />
          </NestingItem>
          <NestingItem
            id="4"
            iconBefore={<SettingsIcon label="" />}
            title="Settings"
            description="I have a custom back button"
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
            <span />
          </NestingItem>
          <NestingItem
            id="5"
            iconBefore={<SettingsIcon label="" />}
            title="Settings"
            description="I'm disabled"
            isDisabled
          >
            <span />
          </NestingItem>
          <NestingItem
            id="6"
            href="/custom-link"
            iconBefore={<SettingsIcon label="" />}
            title="Settings"
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
            <span />
          </NestingItem>
        </Section>
      </NestableNavigationContent>
    </div>
  );
};

export default BasicExample;
