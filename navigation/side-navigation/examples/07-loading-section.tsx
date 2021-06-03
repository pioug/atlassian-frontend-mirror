import React, { useEffect, useState } from 'react';

import BacklogIcon from '@atlaskit/icon/glyph/backlog';
import BoardIcon from '@atlaskit/icon/glyph/board';
import GraphLineIcon from '@atlaskit/icon/glyph/graph-line';
import RoadmapIcon from '@atlaskit/icon/glyph/roadmap';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import VidBackwardIcon from '@atlaskit/icon/glyph/vid-backward';

import {
  ButtonItem,
  CustomItemComponentProps,
  Footer,
  HeadingItem,
  LinkItem,
  LoadingItems,
  NavigationFooter,
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

const InteractiveFooter: React.FC<CustomItemComponentProps> = ({
  children,
  ...props
}) => {
  return (
    <a href="#" {...props}>
      {children}
    </a>
  );
};

const LazySettingsItems = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <LoadingItems
      fallback={
        <>
          <HeadingItem>Project settings</HeadingItem>
          <SkeletonItem />
          <SkeletonItem />
          <SkeletonItem />
          <SkeletonItem />
        </>
      }
      isLoading={isLoading}
    >
      <Section title="Project settings">
        <ButtonItem>Details</ButtonItem>
        <ButtonItem>Access</ButtonItem>
        <ButtonItem>Issue types</ButtonItem>
        <ButtonItem>Features</ButtonItem>
        <ButtonItem>Apps</ButtonItem>
      </Section>
    </LoadingItems>
  );
};

const SettingsItem = () => {
  return (
    <NestingItem
      iconBefore={<SettingsIcon label="" />}
      id="settings"
      title="Project settings"
    >
      <LazySettingsItems />
    </NestingItem>
  );
};

const LoadingSkeleton = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0);

  const reset = (incKey: boolean = true) => {
    if (incKey) {
      setKey((prev) => prev + 1);
    }
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => reset(false), []);

  return (
    <AppFrame hideAppBar>
      <SideNavigation key={key} label="project" testId="side-navigation">
        <NavigationHeader>
          <SampleHeader />
        </NavigationHeader>
        <NestableNavigationContent>
          <LoadingItems
            isLoading={isLoading}
            fallback={
              <>
                <SkeletonHeadingItem isShimmering />
                <SkeletonItem isShimmering hasIcon />
                <SkeletonItem isShimmering hasIcon />
                <SkeletonItem isShimmering hasIcon />
              </>
            }
          >
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
              <SettingsItem />
            </Section>
          </LoadingItems>
        </NestableNavigationContent>
        <NavigationFooter>
          <Footer
            onClick={() => reset()}
            iconBefore={<VidBackwardIcon label="" />}
            description="Will load everything again"
            component={InteractiveFooter}
          >
            Reset
          </Footer>
        </NavigationFooter>
      </SideNavigation>
    </AppFrame>
  );
};

export default LoadingSkeleton;
