import { defineMessages } from 'react-intl-next';

export const siteSelectorMessages = defineMessages({
  dropdownChevronLabel: {
    id: 'linkDataSource.jira-issues.configmodal.dropdownChevronLabel',
    description:
      'Label for button that reveals more available site options to choose from',
    defaultMessage: 'Pick jira site',
  },
  selectedJiraSiteLabel: {
    id: 'linkDataSource.jira-issues.configmodal.selectedJiraSiteLabel',
    description: 'Label for a check icon declaring which option is selected',
    defaultMessage: '{siteName} is selected',
  },
});
