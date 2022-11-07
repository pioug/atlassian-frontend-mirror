/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React, { forwardRef } from 'react';

import {
  UNSAFE_Box as Box,
  UNSAFE_Inline as Inline,
  UNSAFE_Stack as Stack,
  UNSAFE_Text as Text,
} from '@atlaskit/ds-explorations';
import Heading from '@atlaskit/heading';

import { getAppearanceIconStyles } from './internal/appearance-icon';
import type { SectionMessageProps } from './types';

/**
 * __Section message__
 *
 * A section message is used to alert users to a particular section of the screen.
 *
 * - [Examples](https://atlassian.design/components/section-message/examples)
 * - [Code](https://atlassian.design/components/section-message/code)
 * - [Usage](https://atlassian.design/components/section-message/usage)
 */
const SectionMessage = forwardRef<HTMLElement, SectionMessageProps>(
  function SectionMessage(
    { children, appearance = 'information', actions, title, icon, testId },
    ref,
  ) {
    const {
      primaryIconColor: primaryColor,
      backgroundColor: secondaryColor,
      Icon,
    } = getAppearanceIconStyles(appearance, icon);

    const actionElements =
      actions && (actions as React.ReactElement).type === React.Fragment
        ? (actions as React.ReactElement).props.children
        : actions;
    const actionsArray = React.Children.toArray(actionElements);

    return (
      <Box
        as="section"
        backgroundColor={appearanceMap[appearance]}
        padding="scale.200"
        borderRadius="normal"
        testId={testId}
        ref={ref}
        UNSAFE_style={{
          wordBreak: 'break-word',
        }}
      >
        <Inline gap="scale.200">
          <Box
            UNSAFE_style={{
              margin: '-2px 0',
            }}
          >
            <Icon
              size="medium"
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            />
          </Box>
          <Stack gap="scale.100" testId={testId && `${testId}--content`}>
            {!!title && (
              <Heading as="h2" level="h500">
                {title}
              </Heading>
            )}
            <Text>{children}</Text>
            {actionsArray.length > 0 && (
              <Inline
                flexWrap="wrap"
                testId={testId && `${testId}--actions`}
                divider={<Text color="subtle">·</Text>}
                gap="scale.075"
              >
                {actionsArray}
              </Inline>
            )}
          </Stack>
        </Inline>
      </Box>
    );
  },
);

const appearanceMap = {
  information: 'information',
  warning: 'warning',
  error: 'danger',
  success: 'success',
  discovery: 'discovery',
} as const;

SectionMessage.displayName = 'SectionMessage';

export default SectionMessage;
