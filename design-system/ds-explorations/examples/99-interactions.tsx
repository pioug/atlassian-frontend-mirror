/** @jsx jsx */
import { Fragment } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button';
import { Code } from '@atlaskit/code';
import FocusRing from '@atlaskit/focus-ring';
import Heading from '@atlaskit/heading';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

import {
  UNSAFE_Box as Box,
  UNSAFE_Inline as Inline,
  UNSAFE_InteractionSurface as InteractionSurface,
  UNSAFE_Stack as Stack,
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
    borderColor: token('color.border.focused', 'blue'),
  },
});

export default () => {
  return (
    <Box width="size.500" padding="scale.100" testId="all">
      <Stack gap="scale.200">
        <Heading level="h400">Current ADS Buttons</Heading>
        <Inline gap="scale.200">
          <Button appearance="primary">brand.bold</Button>
          <Button appearance="default">neutral</Button>
          <Button appearance="warning">warning.bold</Button>
        </Inline>
        <Heading level="h400">
          Buttons with <Code>InteractionSurface</Code>
        </Heading>
        <Inline gap="scale.200" testId="buttons">
          {(['brand.bold', 'neutral', 'warning.bold'] as const).map((app) => (
            <FocusRing key={app}>
              <Box
                as="button"
                onClick={() => console.log('hello')}
                borderRadius="normal"
                position="relative"
                paddingInline="scale.150"
                backgroundColor={app}
              >
                <InteractionSurface>
                  <Text
                    textAlign="center"
                    fontSize="14px"
                    lineHeight="32px"
                    fontWeight="500"
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
        <Inline gap="scale.200" testId="icon-buttons">
          <FocusRing>
            <Box
              as="button"
              backgroundColor="brand.bold"
              onClick={() => console.log('hello')}
              borderRadius="normal"
              position="relative"
              padding="scale.050"
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
              padding="scale.050"
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
              padding="scale.050"
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
        <Inline gap="scale.200" testId="progress-indicators">
          {(['brand.bold', 'neutral', 'warning.bold'] as const).map((app) => (
            <FocusRing>
              <Box
                key={app}
                as="button"
                backgroundColor={app}
                onClick={() => console.log('hello')}
                borderRadius="rounded"
                position="relative"
                padding="scale.050"
              >
                <InteractionSurface>
                  <Fragment />
                </InteractionSurface>
              </Box>
            </FocusRing>
          ))}
        </Inline>
        <Heading level="h400">Textfield / input spikes</Heading>
        <Inline gap="scale.200">
          <Textfield />
          <Box
            as="fieldset"
            borderRadius="normal"
            borderStyle="solid"
            borderWidth="2px"
            padding="scale.100"
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
