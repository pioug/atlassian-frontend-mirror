/** @jsx jsx */
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
    backgroundColor: token('color.background.input'),
    borderColor: token('color.border.focused', 'blue'),
  },
});

export default () => {
  return (
    <Box width="sp-800" padding="sp-100" testId="all">
      <Stack gap="sp-200">
        <Heading level="h400">Current ADS Buttons</Heading>
        <Inline gap="sp-200">
          <Button appearance="primary">brand.bold</Button>
          <Button appearance="default">neutral</Button>
          <Button appearance="warning">warning.bold</Button>
        </Inline>
        <Heading level="h400">
          Buttons with <Code>InteractionSurface</Code>
        </Heading>
        <Inline gap="sp-200" testId="buttons">
          {(['brand.bold', 'neutral', 'warning.bold'] as const).map((app) => (
            <FocusRing key={app}>
              <Box
                as="button"
                onClick={() => console.log('hello')}
                borderRadius="normal"
                position="relative"
                paddingInline="sp-150"
                backgroundColor={[app, '']}
              >
                <InteractionSurface />
                <Text
                  textAlign="center"
                  fontSize="14px"
                  lineHeight="32px"
                  fontWeight="500"
                >
                  {app}
                </Text>
              </Box>
            </FocusRing>
          ))}
        </Inline>
        <Heading level="h400">
          Icon Buttons with <Code>InteractionSurface</Code>
        </Heading>
        <Inline gap="sp-200" testId="icon-buttons">
          <FocusRing>
            <Box
              as="button"
              backgroundColor={['brand.bold', 'pink']}
              onClick={() => console.log('hello')}
              borderRadius="normal"
              position="relative"
              padding="sp-50"
            >
              <InteractionSurface />
              <WarningIcon
                label="icon button"
                primaryColor={token('color.icon.inverse')}
                secondaryColor={token('color.background.brand.bold')}
              />
            </Box>
          </FocusRing>
          <FocusRing>
            <Box
              as="button"
              backgroundColor={['neutral', 'pink']}
              onClick={() => console.log('hello')}
              borderRadius="normal"
              position="relative"
              padding="sp-50"
            >
              <InteractionSurface />

              <WarningIcon label="icon button" />
            </Box>
          </FocusRing>
          <FocusRing>
            <Box
              as="button"
              backgroundColor={['warning.bold', 'pink']}
              onClick={() => console.log('hello')}
              borderRadius="normal"
              position="relative"
              padding="sp-50"
            >
              <InteractionSurface />
              <WarningIcon
                label="icon button"
                primaryColor={token('color.icon.warning.inverse')}
                secondaryColor={token('color.background.warning.bold')}
              />
            </Box>
          </FocusRing>
        </Inline>
        <Heading level="h400">
          Progress Indicator with <Code>InteractionSurface</Code>
        </Heading>
        <Inline gap="sp-200" testId="progress-indicators">
          {(['brand.bold', 'neutral', 'warning.bold'] as const).map((app) => (
            <FocusRing>
              <Box
                key={app}
                as="button"
                backgroundColor={[app, 'pink']}
                onClick={() => console.log('hello')}
                borderRadius="rounded"
                position="relative"
                padding="sp-50"
              >
                <InteractionSurface />
              </Box>
            </FocusRing>
          ))}
        </Inline>
        <Heading level="h400">Textfield / input spikes</Heading>
        <Inline gap="sp-200">
          <Textfield />
          <Box
            as="fieldset"
            borderRadius="normal"
            borderStyle="solid"
            borderWidth="2px"
            padding="sp-100"
            tabIndex={-1}
            borderColor={['color.border', '#ddd']}
            backgroundColor={['input', '#eee']}
            css={fieldsetStyles}
          >
            <input
              id="textfield"
              pattern="[\d+]"
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
