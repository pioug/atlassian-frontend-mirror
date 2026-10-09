import React from 'react';

import Breadcrumbs from '@atlaskit/breadcrumbs/breadcrumbs';
import { BreadcrumbsCurrentItem } from '@atlaskit/breadcrumbs/breadcrumbs-current-item';
import { BreadcrumbsItem } from '@atlaskit/breadcrumbs/breadcrumbs-item';
import ImageIcon from '@atlaskit/icon/core/image';

const BreadcrumbsItemIconBeforeExample = (): React.JSX.Element => {
	return (
		<Breadcrumbs>
			<BreadcrumbsItem elemBefore={<ImageIcon label="" />} text="Icon before" />
			<BreadcrumbsCurrentItem href="/current-page" text="Current page" />
		</Breadcrumbs>
	);
};

export default BreadcrumbsItemIconBeforeExample;
