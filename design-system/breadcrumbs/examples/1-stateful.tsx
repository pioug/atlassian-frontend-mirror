import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { AtlassianIcon } from '@atlaskit/logo';

const TestIcon = <AtlassianIcon label="" size="small" />;

export default () => (
	<div>
		<Breadcrumbs testId="BreadcrumbsTestId" maxItems={2}>
			<BreadcrumbsItem href="/item" text="No icon" />
			<BreadcrumbsItem href="/item" iconBefore={TestIcon} text="Before" />
			<BreadcrumbsItem href="/item" iconAfter={TestIcon} text="After" />
		</Breadcrumbs>
	</div>
);
