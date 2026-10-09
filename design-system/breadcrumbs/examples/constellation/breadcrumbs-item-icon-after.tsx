import React from 'react';

import Breadcrumbs from '@atlaskit/breadcrumbs/breadcrumbs';
import { BreadcrumbsCurrentItem } from '@atlaskit/breadcrumbs/breadcrumbs-current-item';
import { BreadcrumbsItem } from '@atlaskit/breadcrumbs/breadcrumbs-item';
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
