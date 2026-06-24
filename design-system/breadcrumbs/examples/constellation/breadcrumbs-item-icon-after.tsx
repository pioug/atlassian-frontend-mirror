import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { BreadcrumbsCurrentItem } from '@atlaskit/breadcrumbs/breadcrumbs-current-item';
import ImageIcon from '@atlaskit/icon/core/image';

const BreadcrumbsItemIconAfterExample = (): React.JSX.Element => {
	return (
		<Breadcrumbs>
			<BreadcrumbsItem iconAfter={<ImageIcon label="" />} text="Icon after" />
			<BreadcrumbsCurrentItem href="/current-page" text="Current page" />
		</Breadcrumbs>
	);
};

export default BreadcrumbsItemIconAfterExample;
