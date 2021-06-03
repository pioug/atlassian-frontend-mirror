import React, { Fragment } from 'react';

import Icon from '@atlaskit/icon';

import { CustomItemComponentProps, Footer, NavigationFooter } from '../src';

import SampleIcon from './common/next-gen-project-icon';

const InteractiveContainer = ({
  children,
  ...props
}: CustomItemComponentProps) => {
  return (
    <a href="#" {...props}>
      {children}
    </a>
  );
};

const Example = () => {
  return (
    <div onClick={(e) => e.preventDefault()}>
      <NavigationFooter>
        <Footer
          description={
            <Fragment>
              <a>Give feedback</a> {' ∙ '}
              <a>Learn more</a>
            </Fragment>
          }
        >
          You're in a next gen-project
        </Footer>
      </NavigationFooter>

      <NavigationFooter>
        <Footer
          iconBefore={<Icon label="" glyph={SampleIcon} />}
          description={
            <Fragment>
              <a>Give feedback</a> {' ∙ '}
              <a>Learn more</a>
            </Fragment>
          }
        >
          You're in a next gen-project
        </Footer>
      </NavigationFooter>

      <NavigationFooter>
        <Footer
          iconBefore={<Icon label="" glyph={SampleIcon} />}
          description="Learn more"
          component={InteractiveContainer}
        >
          You're in a next gen-project
        </Footer>
      </NavigationFooter>
    </div>
  );
};

export default Example;
