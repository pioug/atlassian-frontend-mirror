import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { token } from '@atlaskit/tokens';

export default (): React.JSX.Element => (
	// with many items, and a maximum to display set
	<div>
		<p>Should automatically collapse if there are more than 5 items</p>
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<div style={{ maxWidth: '500px', border: `${token('border.width')} solid black` }}>
			<p>Exactly 5 items</p>
			<Breadcrumbs maxItems={5} label="Breadcrumbs with five items">
				<BreadcrumbsItem href="/item" text="Item" />
				<BreadcrumbsItem href="/item" text="Another item" />
				<BreadcrumbsItem href="/item" text="A third item" />
				<BreadcrumbsItem href="/item" text="A fourth item with a very long name" />
				<BreadcrumbsItem href="/item" text="Item 5" />
			</Breadcrumbs>
		</div>
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<div style={{ maxWidth: '500px', border: `${token('border.width')} solid black` }}>
			<p>6 items</p>
			<Breadcrumbs maxItems={5} label="Breadcrumbs with six items">
				<BreadcrumbsItem href="/item" text="Item" />
				<BreadcrumbsItem href="/item" text="Another item" />
				<BreadcrumbsItem href="/item" text="A third item" />
				<BreadcrumbsItem href="/item" text="A fourth item with a very long name" />
				<BreadcrumbsItem href="/item" text="Item 5" />
				<BreadcrumbsItem href="/item" text="A sixth item" />
			</Breadcrumbs>
		</div>
	</div>
);
