import React from 'react';

import Icon from '@atlaskit/icon';

import {
  Footer,
  Header,
  NavigationContent,
  NavigationFooter,
  NavigationHeader,
  SideNavigation,
} from '../../src';
import AppFrame from '../common/app-frame';
import SampleIcon from '../common/next-gen-project-icon';
import RocketIcon from '../common/sample-logo';

const Example = () => {
  return (
    <AppFrame hideAppBar>
      <SideNavigation label="project" testId="side-navigation">
        <NavigationHeader>
          <Header
            component={({ children, ...props }) => (
              <a href="#" {...props}>
                {children}
              </a>
            )}
            iconBefore={<RocketIcon />}
            description="Next-gen software"
          >
            Concise Systems
          </Header>
        </NavigationHeader>
        <NavigationContent> </NavigationContent>
        <NavigationFooter>
          <Footer
            iconBefore={<Icon label="" glyph={SampleIcon} />}
            description={
              <div>
                <a>Give feedback</a> {' ∙ '}
                <a>Learn more</a>
              </div>
            }
          >
            You're in a next gen-project
          </Footer>
        </NavigationFooter>
      </SideNavigation>
    </AppFrame>
  );
};

export default Example;
