import React, { lazy, Suspense } from 'react';

import BacklogIcon from '@atlaskit/icon/glyph/backlog';
import BoardIcon from '@atlaskit/icon/glyph/board';
import GraphLineIcon from '@atlaskit/icon/glyph/graph-line';
import RoadmapIcon from '@atlaskit/icon/glyph/roadmap';
import SettingsIcon from '@atlaskit/icon/glyph/settings';

import {
  ButtonItem,
  HeadingItem,
  LinkItem,
  NavigationHeader,
  NestableNavigationContent,
  NestingItem,
  Section,
  SideNavigation,
  SkeletonHeadingItem,
  SkeletonItem,
} from '../src';

import AppFrame from './common/app-frame';
import SampleHeader from './common/sample-header';

/**
 * This turns a component into a lazy component.
 * You'll want to do proper code splitting instead of forcing the async behavior!
 */
const makeLazy = <TComponent extends React.ComponentType>(
  component: TComponent,
) => {
  return lazy(() => {
    return new Promise<{ default: TComponent }>((resolve) => {
      setTimeout(() => {
        resolve({ default: component });
      }, 1000);
    });
  });
};

const LazySettingsSectionItems = makeLazy(() => {
  return (
    <Section title="Project settings">
      <ButtonItem>Details</ButtonItem>
      <ButtonItem>Access</ButtonItem>
      <ButtonItem>Issue types</ButtonItem>
      <ButtonItem>Features</ButtonItem>
      <ButtonItem>Apps</ButtonItem>
    </Section>
  );
});

const LazyRootItems = makeLazy(() => {
  return (
    <Section title="My project">
      <LinkItem href="#" iconBefore={<RoadmapIcon label="" />}>
        Roadmap
      </LinkItem>
      <LinkItem href="#" iconBefore={<BacklogIcon label="" />}>
        Backlog
      </LinkItem>
      <LinkItem href="#" iconBefore={<BoardIcon label="" />}>
        Board
      </LinkItem>
      <LinkItem href="#" iconBefore={<GraphLineIcon label="" />}>
        Reports
      </LinkItem>
      <SettingsSection />
    </Section>
  );
});

const SettingsSection = () => {
  return (
    <NestingItem
      iconBefore={<SettingsIcon label="" />}
      id="settings"
      title="Project settings"
      isSelected
    >
      <Suspense
        fallback={
          <>
            <HeadingItem>Project settings</HeadingItem>
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
          </>
        }
      >
        <LazySettingsSectionItems />
      </Suspense>
    </NestingItem>
  );
};

const LoadingSkeleton = () => {
  return (
    <AppFrame hideAppBar>
      <SideNavigation label="project" testId="side-navigation">
        <NavigationHeader>
          <SampleHeader />
        </NavigationHeader>
        <NestableNavigationContent>
          <Suspense
            fallback={
              <>
                <SkeletonHeadingItem isShimmering />
                <SkeletonItem isShimmering hasIcon />
                <SkeletonItem isShimmering hasIcon />
                <SkeletonItem isShimmering hasIcon />
              </>
            }
          >
            <LazyRootItems />
          </Suspense>
        </NestableNavigationContent>
      </SideNavigation>
    </AppFrame>
  );
};

export default LoadingSkeleton;
