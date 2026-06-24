import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { BreadcrumbsCurrentItem } from '@atlaskit/breadcrumbs/breadcrumbs-current-item';
import { AtlassianIcon } from '@atlaskit/logo';

const TestIcon = <AtlassianIcon label="" size="small" />;

export default (): React.JSX.Element => (
	<div>
		<Breadcrumbs testId="BreadcrumbsTestId" maxItems={2}>
			<BreadcrumbsItem href="/item" text="No icon" />
			<BreadcrumbsItem href="/item" elemBefore={TestIcon} text="Before" />
			<BreadcrumbsItem href="/item" iconAfter={TestIcon} text="After" />
			<BreadcrumbsCurrentItem href="/current-page" text="Current page" />
		</Breadcrumbs>
	</div>
);
