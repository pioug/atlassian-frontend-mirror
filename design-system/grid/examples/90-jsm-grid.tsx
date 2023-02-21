/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import {
  UNSAFE_Box as Box,
  UNSAFE_Inline as Inline,
  UNSAFE_Stack as Stack,
} from '@atlaskit/ds-explorations';
import Heading from '@atlaskit/heading';
import { JiraServiceManagementLogo } from '@atlaskit/logo';
import Textfield from '@atlaskit/textfield';
import { useThemeObserver } from '@atlaskit/tokens';

import Grid, { BREAKPOINTS, GridItem } from '../src';

import JSMCard from './91-jsm-card';
import JSMConfigCard from './92-jsm-config-card';
import SecondaryCard from './93-jsm-secondary-card';
import IconLink from './95-icon-link';

const responsiveWidthSearchStyles = css({
  minWidth: '100%',
});

// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const dynamicSizedVerticalPaddingStyles = css(
  Object.entries(BREAKPOINTS).reduce((configs, [_, config]) => {
    return Object.assign(configs, {
      [`@media (min-width: ${config.min}px) and (max-width: ${config.max}px)`]:
        {
          paddingBlock: `calc(${config.offset} * 2)`,
        },
    });
  }, {}),
);

const JSMGrid = () => {
  const { colorMode: theme } = useThemeObserver();
  return (
    <div>
      <Box
        UNSAFE_style={{
          background:
            'linear-gradient(180deg, #0C2759 0%, rgba(12, 39, 89, 0) 77.57%), url(./img/jsm.png)',
          backgroundSize: 'cover, 1440px',
        }}
        display="block"
      >
        {/* Nav */}
        <Box paddingBlock="space.300" paddingInline="space.400">
          <JiraServiceManagementLogo
            appearance={theme === 'dark' ? 'brand' : 'inverse'}
          />
        </Box>
        {/* Search */}
        <Box
          justifyContent="center"
          alignItems="center"
          paddingBlock="space.1000"
          UNSAFE_style={{ paddingBottom: 144 }}
        >
          <Grid maxWidth="wide">
            <GridItem offset={{ md: 3 }} span={{ md: 8 }}>
              <Stack gap="space.200" alignItems="center">
                <Heading
                  level="h700"
                  color={theme === 'light' ? 'inverse' : 'default'}
                >
                  Welcome to the Internal Help Center
                </Heading>
                <Textfield
                  css={responsiveWidthSearchStyles}
                  placeholder="Find help and services"
                  type="search"
                />
              </Stack>
            </GridItem>
          </Grid>
        </Box>
      </Box>
      <Box css={dynamicSizedVerticalPaddingStyles} justifyContent="center">
        <Stack gap="space.800">
          <Grid maxWidth="wide">
            <GridItem span={{ sm: 3, md: 4 }}>
              <Stack gap="space.300">
                <JSMConfigCard title="Design Collection">
                  <IconLink>Join Figma support slack channel</IconLink>
                  <IconLink>Join Figma support slack channel</IconLink>
                </JSMConfigCard>
                <JSMConfigCard title="Covid Updates" />
              </Stack>
            </GridItem>
            <GridItem span={{ sm: 3, md: 4 }}>
              <Stack gap="space.300">
                <JSMConfigCard title="New hire basics" />
                <JSMConfigCard title="Payroll">
                  <IconLink>Join Figma support slack channel</IconLink>
                  <IconLink>Request for laptop exchange</IconLink>
                </JSMConfigCard>
              </Stack>
            </GridItem>
            <GridItem span={{ sm: 3, md: 4 }}>
              <JSMConfigCard title="Infra Management" />
            </GridItem>
          </Grid>
          <Grid maxWidth="wide">
            <GridItem>
              <Inline justifyContent="space-between" gap="space.0">
                <Heading level="h800" as="h2">
                  Featured service desks
                </Heading>
              </Inline>
            </GridItem>
            <GridItem span={{ sm: 3, md: 4 }}>
              <JSMCard iconColor="information.bold" title="Onboarding" />
            </GridItem>
            <GridItem span={{ sm: 3, md: 4 }}>
              <JSMCard iconColor="brand.bold" title="HR Service Desk" />
            </GridItem>
            <GridItem span={{ sm: 3, md: 4 }}>
              <JSMCard title="Travel Service desk" iconColor="information" />
            </GridItem>
            <GridItem span={{ sm: 3, md: 4 }}>
              <JSMCard iconColor="danger.bold" title="SWAGs" />
            </GridItem>
            <GridItem span={{ sm: 3, md: 4 }}>
              <JSMCard iconColor="warning.bold" title="IT Support" />
            </GridItem>
            <GridItem span={{ sm: 3, md: 4 }}>
              <JSMCard title="IT Operations" iconColor="discovery" />
            </GridItem>
            <GridItem span={{ sm: 3, md: 4 }}>
              <JSMCard iconColor="discovery.bold" title="Sales Ops" />
            </GridItem>
            <GridItem span={{ sm: 3, md: 4 }}>
              <JSMCard title="Customer Support" iconColor="neutral.bold" />
            </GridItem>
            <GridItem span={{ sm: 3, md: 4 }}>
              <JSMCard title="Financial Month End" iconColor="danger" />
            </GridItem>
          </Grid>
          <Grid maxWidth="wide">
            <GridItem>
              <Inline justifyContent="space-between" gap="space.0">
                <Heading level="h800" as="h2">
                  Recently used forms
                </Heading>
              </Inline>
            </GridItem>
            <GridItem span={{ sm: 2, md: 4 }}>
              <SecondaryCard />
            </GridItem>
            <GridItem span={{ sm: 2, md: 4 }}>
              <SecondaryCard />
            </GridItem>
            <GridItem span={{ sm: 2, md: 4 }}>
              <SecondaryCard />
            </GridItem>
          </Grid>
        </Stack>
      </Box>
    </div>
  );
};

export default JSMGrid;
