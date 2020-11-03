/** @jsx jsx */
import { jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import SelectedIcon from '@atlaskit/icon/glyph/check';
import ButtonIcon from '@atlaskit/icon/glyph/checkbox-indeterminate';
import CustomIcon from '@atlaskit/icon/glyph/discover';
import LinkIcon from '@atlaskit/icon/glyph/link';

import {
  ButtonItem,
  HeadingItem,
  LinkItem,
  NavigationContent,
  NavigationFooter,
  NavigationHeader,
  Section,
  SideNavigation,
} from '../src';

import AppFrame from './common/app-frame';
import SampleFooter from './common/sample-footer';
import SampleHeader from './common/sample-header';

const BasicExample = () => {
  return (
    <AppFrame hideAppBar>
      <SideNavigation label="project" testId="side-navigation">
        <NavigationHeader>
          <SampleHeader />
        </NavigationHeader>
        <NavigationContent>
          <Section>
            <HeadingItem>This is a simple flat sidebar</HeadingItem>
            <ButtonItem iconBefore={<ButtonIcon label="" />}>
              It can contain buttons
            </ButtonItem>
            <LinkItem href="#" iconBefore={<LinkIcon label="" />}>
              Or anchor links
            </LinkItem>
            <ButtonItem isSelected iconBefore={<SelectedIcon label="" />}>
              Or selected items
            </ButtonItem>
          </Section>
          <Button
            iconBefore={<CustomIcon label="" />}
            appearance="primary"
            shouldFitContainer
          >
            Or custom components
          </Button>
        </NavigationContent>
        <NavigationFooter>
          <SampleFooter />
        </NavigationFooter>
      </SideNavigation>
    </AppFrame>
  );
};

export default BasicExample;
