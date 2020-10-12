/** @jsx jsx */
import { jsx } from '@emotion/core';

import {
  NestableNavigationContent,
  NestingItem,
  Section,
  SideNavigation,
  useShouldNestedElementRender,
} from '../src';

import AppFrame from './common/app-frame';

const IncorrectCustomLeafNodeComponent = () => {
  return (
    <div
      css={{
        padding: 8,
        fontWeight: 500,
        textTransform: 'uppercase',
        textAlign: 'center',
        fontSize: 12,
      }}
    >
      Always rendered
    </div>
  );
};

const CorrectCustomLeafNodeComponent = () => {
  const { shouldRender } = useShouldNestedElementRender();
  if (!shouldRender) {
    return null;
  }

  return (
    <div
      css={{
        padding: 8,
        fontWeight: 500,
        textTransform: 'uppercase',
        textAlign: 'center',
        fontSize: 12,
      }}
    >
      Only rendered when parent view is shown
    </div>
  );
};

const BasicExample = () => {
  return (
    <AppFrame hideAppBar>
      <SideNavigation label="project" testId="side-navigation">
        <NestableNavigationContent>
          <Section>
            <IncorrectCustomLeafNodeComponent />
            <NestingItem id="1" title="Go inside">
              <CorrectCustomLeafNodeComponent />
            </NestingItem>
          </Section>
        </NestableNavigationContent>
      </SideNavigation>
    </AppFrame>
  );
};

export default BasicExample;
