import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { BreadcrumbsCurrentItem } from '@atlaskit/breadcrumbs/breadcrumbs-current-item';
import ProjectIcon from '@atlaskit/icon/core/project';

const BreadcrumbsRefreshElemBeforeExample = (): React.JSX.Element => {
	return (
		<Breadcrumbs>
			<BreadcrumbsItem elemBefore={<ProjectIcon label="" />} href="/components" text="Components" />
			<BreadcrumbsItem href="/components/breadcrumbs" text="Breadcrumbs" />
			<BreadcrumbsCurrentItem href="/components/breadcrumbs/examples" text="Examples" />
		</Breadcrumbs>
	);
};

export default BreadcrumbsRefreshElemBeforeExample;
