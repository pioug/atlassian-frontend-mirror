import React from 'react';

import { defineMessages, FormattedMessage } from 'react-intl-next';

import { Box, xcss } from '@atlaskit/primitives';
import SectionMessage from '@atlaskit/section-message';

import { useAutomationMenu } from '../../menu-context';

const i18n = defineMessages({
  ruleExecutionSuccessMessage: {
    id: 'automation-menu.success-state.message',
    defaultMessage: 'Your automation is in progress',
    description:
    'Message that is displayed when a users automation rule has been successfully queued.',
  },
  ruleExecutionErrorMessage: {
    id: 'automation-menu.modal.error.description',
    defaultMessage: 'Oops we ran into a problem',
    description:
    "Description for the error section shown when rules can't be executed",
  },
});

const messageStyling = xcss({
  marginInline: 'space.300',
  marginTop: 'space.100',
  // The ModalFooter comes with a lot of built in margin, want to nudge the error message in to the footer a bit
  marginBottom: 'space.negative.100',
})

export const AutomationModalExecutionState = () => {
  const { ruleExecutionState } = useAutomationMenu();

  if (ruleExecutionState === 'FAILURE') {
    return (
      <Box xcss={messageStyling} >
        <SectionMessage appearance='error'>
          <FormattedMessage {...i18n.ruleExecutionErrorMessage} />
        </SectionMessage>
      </Box>
    )
  } else {
    return null;
  }
}
