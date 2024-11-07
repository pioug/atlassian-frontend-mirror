import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { AtlassianIcon } from '@atlaskit/logo';

const TestIcon = <AtlassianIcon label="Test icon" size="small" />;

const BreadcrumbsItemIconBeforeExample = () => {
	return (
		<Breadcrumbs>
			<BreadcrumbsItem iconBefore={TestIcon} text="Atlassian" />
		</Breadcrumbs>
	);
};

export default BreadcrumbsItemIconBeforeExample;
