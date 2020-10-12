/** @jsx jsx */
import { jsx } from '@emotion/core';

import CustomerIcon from '@atlaskit/icon/glyph/person';

import {
  ButtonItem,
  HeadingItem,
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

const BasicExample = () => {
  return (
    <AppFrame hideAppBar>
      <SideNavigation label="project" testId="side-navigation">
        <NavigationHeader>
          <SampleHeader />
        </NavigationHeader>
        <NestableNavigationContent stack={['nested']}>
          <Section>
            <NestingItem id="nested" title="Nested">
              <HeadingItem>Heading</HeadingItem>
              <SkeletonHeadingItem />
              <SkeletonItem hasAvatar />
              <SkeletonItem hasIcon />
              <ButtonItem iconBefore={<CustomerIcon label="" />}>
                Create
              </ButtonItem>
              <SkeletonItem width="100%" />
              <SkeletonItem />
              <SkeletonItem />
              <ButtonItem>Create</ButtonItem>
            </NestingItem>
          </Section>
        </NestableNavigationContent>
      </SideNavigation>
    </AppFrame>
  );
};

export default BasicExample;
