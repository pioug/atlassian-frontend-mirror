import { defineMessages } from 'react-intl-next';

export const modeSwitcherMessages = defineMessages({
  basicTextSearchLabel: {
    id: 'linkDataSource.jira-issues.configmodal.basicModeText',
    description: 'Display text for basic text search toggle button',
    defaultMessage: 'Basic',
  },
  basicModeSwitchDisabledTooltipText: {
    id: 'linkDataSource.jira-issues.configmodal.basicModeSwitchDisabledTooltipText',
    description: 'Display tooltip text when basic mode switch is disabled',
    defaultMessage: "You can't switch to basic for this query.",
  },
});
