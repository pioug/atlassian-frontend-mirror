import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { AtlassianIcon } from '@atlaskit/logo';

const TestIcon = <AtlassianIcon label="Test icon" size="small" />;

const BreadcrumbsItemIconAfterExample = () => {
	return (
		<Breadcrumbs>
			<BreadcrumbsItem iconAfter={TestIcon} text="Atlassian" />
		</Breadcrumbs>
	);
};

export default BreadcrumbsItemIconAfterExample;
