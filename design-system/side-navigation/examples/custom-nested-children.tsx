/** @jsx jsx */
import { jsx } from '@emotion/react';

import Text from '@atlaskit/ds-explorations/text';
import { Box } from '@atlaskit/primitives';

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
    <Box padding="space.100" display="block">
      <Text
        fontWeight="medium"
        textTransform="uppercase"
        textAlign="center"
        fontSize="size.075"
        as="p"
      >
        Always rendered
      </Text>
    </Box>
  );
};

const CorrectCustomLeafNodeComponent = () => {
  const { shouldRender } = useShouldNestedElementRender();
  if (!shouldRender) {
    return null;
  }

  return (
    <Box padding="space.100">
      <Text
        UNSAFE_style={{
          fontWeight: 500,
          textTransform: 'uppercase',
          textAlign: 'center',
          fontSize: 12,
        }}
        as="p"
      >
        Only rendered when parent view is shown
      </Text>
    </Box>
  );
};

const BasicExample = () => {
  return (
    <AppFrame shouldHideAppBar>
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
