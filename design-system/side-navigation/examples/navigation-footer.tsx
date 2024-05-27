import React, { Fragment, type MouseEvent } from 'react';

import { LinkButton } from '@atlaskit/button/new';
import Icon from '@atlaskit/icon';
import { Box } from '@atlaskit/primitives';

import { Footer, NavigationFooter } from '../src';

import SampleIcon from './common/next-gen-project-icon';

const Example = () => {
  return (
    <Box onClick={(e: MouseEvent) => e.preventDefault()}>
      <NavigationFooter>
        <Footer
          useDeprecatedApi={false}
          description={
            <Fragment>
              <LinkButton
                appearance="subtle-link"
                href="/feedback"
                spacing="none"
              >
                Give feedback
              </LinkButton>
              {' ∙ '}
              <LinkButton appearance="subtle-link" href="/learn" spacing="none">
                Learn more
              </LinkButton>
            </Fragment>
          }
        >
          You're in a next gen-project
        </Footer>
      </NavigationFooter>

      <NavigationFooter>
        <Footer
          useDeprecatedApi={false}
          iconBefore={<Icon label="" glyph={SampleIcon} />}
          description={
            <Fragment>
              <LinkButton
                appearance="subtle-link"
                href="/feedback"
                spacing="none"
              >
                Give feedback
              </LinkButton>
              {' ∙ '}
              <LinkButton appearance="subtle-link" href="/learn" spacing="none">
                Learn more
              </LinkButton>
            </Fragment>
          }
        >
          You're in a next gen-project
        </Footer>
      </NavigationFooter>
    </Box>
  );
};

export default Example;
