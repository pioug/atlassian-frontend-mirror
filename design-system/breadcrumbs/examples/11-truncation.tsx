import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { AtlassianIcon } from '@atlaskit/logo';

const TestIcon = <AtlassianIcon label="" size="small" />;

export default () => (
	// with trunaction and icons
	<div>
		<Breadcrumbs testId="MyBreadcrumbsTestId" defaultExpanded>
			<BreadcrumbsItem
				truncationWidth={200}
				href="/long"
				text="Supercalifragilisticexpialidocious"
			/>
			<BreadcrumbsItem truncationWidth={200} href="/short" text="Item" />
			<BreadcrumbsItem truncationWidth={200} href="/short" text="Another item" />
			<BreadcrumbsItem
				truncationWidth={200}
				href="/long"
				text="Long item name which should be truncated"
			/>
			<BreadcrumbsItem
				truncationWidth={200}
				href="/item"
				iconBefore={TestIcon}
				iconAfter={TestIcon}
				text="Before and after"
			/>
			<BreadcrumbsItem
				truncationWidth={200}
				href="/long"
				text="Another long item name which should be truncated"
			/>
			<BreadcrumbsItem truncationWidth={200} href="/short" text="Short item" />
			<BreadcrumbsItem
				truncationWidth={200}
				href="/item"
				iconBefore={TestIcon}
				iconAfter={TestIcon}
				text="Long content, icons before and after"
			/>
			<BreadcrumbsItem
				truncationWidth={300}
				href="/item"
				iconBefore={TestIcon}
				text="Before with text that could break truncation"
			/>
		</Breadcrumbs>
	</div>
);
