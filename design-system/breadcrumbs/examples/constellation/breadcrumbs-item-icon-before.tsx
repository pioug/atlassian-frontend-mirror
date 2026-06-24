import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { BreadcrumbsCurrentItem } from '@atlaskit/breadcrumbs/breadcrumbs-current-item';
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
