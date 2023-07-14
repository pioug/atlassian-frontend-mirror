import React, { Fragment, MouseEvent } from 'react';

import Button from '@atlaskit/button';
import Box from '@atlaskit/ds-explorations/box';
import Icon from '@atlaskit/icon';

import { Footer, NavigationFooter } from '../src';

import SampleIcon from './common/next-gen-project-icon';

const Example = () => {
  return (
    <Box
      display="block"
      onClick={(e: MouseEvent) => e.preventDefault()}
      as="div"
    >
      <NavigationFooter>
        <Footer
          useDeprecatedApi={false}
          description={
            <Fragment>
              <Button appearance="link" href="/feedback" spacing="none">
                Give feedback
              </Button>
              {' ∙ '}
              <Button appearance="link" href="/learn" spacing="none">
                Learn more
              </Button>
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
              <Button appearance="link" href="/feedback" spacing="none">
                Give feedback
              </Button>
              {' ∙ '}
              <Button appearance="link" href="/learn" spacing="none">
                Learn more
              </Button>
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
