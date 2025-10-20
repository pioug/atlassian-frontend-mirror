import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { mockSiteData } from '@atlaskit/link-test-helpers/datasource';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';

import { SiteSelector } from '../../src/ui/common/modal/site-selector';
import { confluenceSearchModalMessages } from '../../src/ui/confluence-search-modal/modal/messages';

const SiteSelectorVRDisabled = (): React.JSX.Element => {
	setBooleanFeatureFlagResolver((flagKey) => {
		if (flagKey === 'add-disablesiteselector') {
			return true;
		}
		return false;
	});

	return (
		<IntlProvider locale="en">
			<SiteSelector
				testId={`confluence-search-datasource-modal--site-selector`}
				label={confluenceSearchModalMessages.insertIssuesTitle}
				availableSites={mockSiteData}
				onSiteSelection={() => {}}
				selectedSite={mockSiteData[0]}
				disableSiteSelector={true}
			/>
		</IntlProvider>
	);
};

export default SiteSelectorVRDisabled;
