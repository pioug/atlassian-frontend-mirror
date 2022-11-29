/** @jsx jsx */
import { useState } from 'react';

import { jsx } from '@emotion/react';

import {
  ButtonItem,
  Header,
  NavigationHeader,
  NestableNavigationContent,
  NestingItem,
  Section,
  SideNavigation,
} from '../src';

import AppFrame from './common/app-frame';

const BasicExample = () => {
  const [stack, setStack] = useState<string[]>(['1-0']);

  return (
    <AppFrame shouldHideAppBar>
      <div
        style={{
          display: 'grid',
          minHeight: 800,
          gap: 48,
        }}
      >
        <SideNavigation label="project" testId="controlled-invalid">
          <NavigationHeader>
            <Header
              description={
                <span>
                  The provided stack level does not exist.
                  <br />
                  onUnknownNest callback is triggered with '1-0'
                </span>
              }
            >
              Controlled
            </Header>
          </NavigationHeader>
          <NestableNavigationContent
            onChange={setStack}
            stack={stack}
            onUnknownNest={(stack) => console.warn(`invalid stack: ${stack}`)}
          >
            <Section title="Top level">
              <NestingItem id="1" title="Item B">
                <Section title="Nesting level 1">
                  <ButtonItem>Item B</ButtonItem>
                </Section>
              </NestingItem>
            </Section>
          </NestableNavigationContent>
        </SideNavigation>

        <SideNavigation label="project" testId="uncontrolled-invalid">
          <NavigationHeader>
            <Header
              description={
                <span>
                  'Go Back' takes us to an invalid state.
                  <br />
                  onUnknownNest callback is triggered with the provided stack,
                  `1,1-1,1-2,1-3`
                </span>
              }
            >
              Uncontrolled
            </Header>
          </NavigationHeader>
          <NestableNavigationContent
            initialStack={['1', '1-1', '1-2', '1-3', '1-1']}
            onUnknownNest={(stack) => console.warn(`invalid stack: ${stack}`)}
          >
            <Section title="Top level">
              <NestingItem id="1" title="Item A">
                <NestingItem id="1-1" title="Item A-1">
                  Level 1-1
                </NestingItem>
              </NestingItem>
            </Section>
          </NestableNavigationContent>
        </SideNavigation>
      </div>
    </AppFrame>
  );
};

export default BasicExample;
