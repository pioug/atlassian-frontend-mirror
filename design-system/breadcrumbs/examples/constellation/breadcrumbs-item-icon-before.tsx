import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import ImageIcon from '@atlaskit/icon/core/image';

const BreadcrumbsItemIconBeforeExample = (): React.JSX.Element => {
	return (
		<Breadcrumbs>
			<BreadcrumbsItem iconBefore={<ImageIcon label="" />} text="Icon before" />
		</Breadcrumbs>
	);
};

export default BreadcrumbsItemIconBeforeExample;
