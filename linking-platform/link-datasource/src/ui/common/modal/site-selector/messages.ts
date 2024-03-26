import { defineMessages } from 'react-intl-next';

export const siteSelectorMessages = defineMessages({
  chooseSiteDuplicate: {
    id: 'linkDataSource.site-selector.configmodal.chooseSite',
    description: 'Label for input letting user know they have to choose a site',
    defaultMessage: 'Choose site',
  },
  // delete this and remove duplicate from above once EDM-9407 is merged
  chooseSite: {
    id: 'linkDataSource.jira-issues.configmodal.chooseSite',
    description: 'Label for input letting user know they have to choose a site',
    defaultMessage: 'Choose site',
  },
});
