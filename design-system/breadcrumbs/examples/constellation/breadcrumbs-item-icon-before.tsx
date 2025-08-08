import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import ImageIcon from '@atlaskit/icon/core/migration/image';

const BreadcrumbsItemIconBeforeExample = () => {
	return (
		<Breadcrumbs>
			<BreadcrumbsItem iconBefore={<ImageIcon label="" />} text="Icon before" />
		</Breadcrumbs>
	);
};

export default BreadcrumbsItemIconBeforeExample;
