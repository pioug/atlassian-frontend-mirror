import React, { useState } from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '../src';

export default () => {
	const [label, setLabel] = useState<string>('');

	return (
		// with many items, and a maximum to display set
		<div>
			<label
				htmlFor="label-input"
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					display: 'flex',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					flexDirection: 'column',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					alignItems: 'flex-start',
				}}
			>
				Ellipsis aria label:
				<input id="label-input" value={label} onChange={(e) => setLabel(e.target.value)} />
			</label>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<hr style={{ margin: '15px 0px' }} />
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ maxWidth: '500px' }}>
				<Breadcrumbs maxItems={5} ellipsisLabel={label}>
					<BreadcrumbsItem href="/item" text="Item" />
					<BreadcrumbsItem href="/item" text="Another item" />
					<BreadcrumbsItem href="/item" text="A third item" />
					<BreadcrumbsItem href="/item" text="A fourth item with a very long name" />
					<BreadcrumbsItem href="/item" text="Item 5" />
					<BreadcrumbsItem href="/item" text="Item 6" />
				</Breadcrumbs>
			</div>
		</div>
	);
};
