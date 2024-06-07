import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { mockSiteData } from '@atlaskit/link-test-helpers/datasource';

import { SiteSelector } from '../../src/ui/common/modal/site-selector';
import { modalMessages } from '../../src/ui/jira-issues-modal/modal/messages';

export default () => {
	return (
		<IntlProvider locale="en">
			<SiteSelector
				testId={`jira-datasource-modal--site-selector`}
				label={modalMessages.insertIssuesTitleManySites}
				availableSites={mockSiteData}
				onSiteSelection={() => {}}
				selectedSite={mockSiteData[0]}
			/>
		</IntlProvider>
	);
};
