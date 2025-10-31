import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import ImageIcon from '@atlaskit/icon/core/image';

const BreadcrumbsItemIconAfterExample = () => {
	return (
		<Breadcrumbs>
			<BreadcrumbsItem iconAfter={<ImageIcon label="" />} text="Icon after" />
		</Breadcrumbs>
	);
};

export default BreadcrumbsItemIconAfterExample;
