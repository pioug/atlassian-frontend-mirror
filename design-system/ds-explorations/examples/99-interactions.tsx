/** @jsx jsx */
import { Fragment } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button';
import { Code } from '@atlaskit/code';
import FocusRing from '@atlaskit/focus-ring';
import Heading from '@atlaskit/heading';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import Inline from '@atlaskit/primitives/inline';
import Stack from '@atlaskit/primitives/stack';
import Textfield from '@atlaskit/textfield';
import { B200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import {
  UNSAFE_Box as Box,
  UNSAFE_InteractionSurface as InteractionSurface,
  UNSAFE_Text as Text,
} from '../src';

const fieldsetStyles = css({
  flex: '1 1 100%',
  ':hover': {
    backgroundColor: token('color.background.input.hovered', '#bbb'),
  },
  ':invalid': {
    borderColor: token('color.border.danger', 'red'),
  },
  ':focus, :focus-within': {
    backgroundColor: token('color.background.input', '#FAFBFC'),
    borderColor: token('color.border.focused', B200),
  },
});

export default () => {
  return (
    <Box width="size.500" padding="space.100" testId="all">
      <Stack space="space.200">
        <Heading level="h400">Current ADS Buttons</Heading>
        <Inline space="space.200">
          <Button appearance="primary">brand.bold</Button>
          <Button appearance="default">neutral</Button>
          <Button appearance="warning">warning.bold</Button>
        </Inline>
        <Heading level="h400">
          Buttons with <Code>InteractionSurface</Code>
        </Heading>
        <Inline space="space.200" testId="buttons">
          {(['brand.bold', 'neutral', 'warning.bold'] as const).map((app) => (
            <FocusRing key={app}>
              <Box
                as="button"
                onClick={() => console.log('hello')}
                borderRadius="normal"
                position="relative"
                paddingInline="space.150"
                backgroundColor={app}
              >
                <InteractionSurface>
                  <Text
                    textAlign="center"
                    fontSize="size.100"
                    lineHeight="lineHeight.500"
                    fontWeight="medium"
                  >
                    {app}
                  </Text>
                </InteractionSurface>
              </Box>
            </FocusRing>
          ))}
        </Inline>
        <Heading level="h400">
          Icon Buttons with <Code>InteractionSurface</Code>
        </Heading>
        <Inline space="space.200" testId="icon-buttons">
          <FocusRing>
            <Box
              as="button"
              backgroundColor="brand.bold"
              onClick={() => console.log('hello')}
              borderRadius="normal"
              position="relative"
              padding="space.050"
            >
              <InteractionSurface>
                <WarningIcon
                  label="icon button"
                  primaryColor={token('color.icon.inverse')}
                  secondaryColor={token('color.background.brand.bold')}
                />
              </InteractionSurface>
            </Box>
          </FocusRing>
          <FocusRing>
            <Box
              as="button"
              backgroundColor="neutral"
              onClick={() => console.log('hello')}
              borderRadius="normal"
              position="relative"
              padding="space.050"
            >
              <InteractionSurface>
                <WarningIcon label="icon button" />
              </InteractionSurface>
            </Box>
          </FocusRing>
          <FocusRing>
            <Box
              as="button"
              backgroundColor="warning.bold"
              onClick={() => console.log('hello')}
              borderRadius="normal"
              position="relative"
              padding="space.050"
            >
              <InteractionSurface>
                <WarningIcon
                  label="icon button"
                  primaryColor={token('color.icon.warning.inverse')}
                  secondaryColor={token('color.background.warning.bold')}
                />
              </InteractionSurface>
            </Box>
          </FocusRing>
        </Inline>
        <Heading level="h400">
          Progress Indicator with <Code>InteractionSurface</Code>
        </Heading>
        <Inline space="space.200" testId="progress-indicators">
          {(['brand.bold', 'neutral', 'warning.bold'] as const).map((app) => (
            <FocusRing>
              <Box
                key={app}
                as="button"
                backgroundColor={app}
                onClick={() => console.log('hello')}
                borderRadius="rounded"
                position="relative"
                padding="space.050"
              >
                <InteractionSurface>
                  <Fragment />
                </InteractionSurface>
              </Box>
            </FocusRing>
          ))}
        </Inline>
        <Heading level="h400">Textfield / input spikes</Heading>
        <Inline space="space.200">
          <Textfield />
          <Box
            as="fieldset"
            borderRadius="normal"
            borderStyle="solid"
            borderWidth="2px"
            padding="space.100"
            tabIndex={-1}
            borderColor="color.border"
            backgroundColor="input"
            css={fieldsetStyles}
          >
            <input
              id="textfield"
              pattern="\d+"
              style={{
                padding: 0,
                border: 'none',
                fontSize: 14,
                background: 'transparent',
                appearance: 'none',
                outline: 'none',
              }}
            />
          </Box>
        </Inline>
      </Stack>
    </Box>
  );
};
