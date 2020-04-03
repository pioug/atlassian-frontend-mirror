import React, { Fragment } from 'react';
import GlobalNavigation from '@atlaskit/global-navigation';
import { AtlassianIcon, AtlassianWordmark } from '@atlaskit/logo';
import {
  GroupHeading,
  HeaderSection,
  Item,
  LayoutManager,
  MenuSection,
  NavigationProvider,
  Separator,
  Wordmark,
} from '../../../src';

const MyGlobalNavigation = () => (
  <GlobalNavigation
    productIcon={() => <AtlassianIcon size="medium" />}
    onProductClick={() => {}}
  />
);

const MyProductNavigation = () => (
  <Fragment>
    <HeaderSection>
      {({ className }) => (
        <div className={className}>
          <Wordmark wordmark={AtlassianWordmark} />
        </div>
      )}
    </HeaderSection>
    <MenuSection>
      {({ className }) => (
        <div className={className}>
          <Item text="Dashboard" />
          <Item text="Things" />
          <Item text="Settings" />
          <Separator />
          <GroupHeading>Add-ons</GroupHeading>
          <Item text="My plugin" />
        </div>
      )}
    </MenuSection>
  </Fragment>
);

export default () => (
  <NavigationProvider>
    <LayoutManager
      globalNavigation={MyGlobalNavigation}
      productNavigation={MyProductNavigation}
      containerNavigation={null}
    >
      <div css={{ padding: '32px 40px' }}>Page content goes here.</div>
    </LayoutManager>
  </NavigationProvider>
);
