import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { AtlassianIcon } from '@atlaskit/logo';
import { token } from '@atlaskit/tokens';

export default () => (
	<div>
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<div style={{ display: 'flex', alignItems: 'center' }}>
			<Breadcrumbs testId="BreadcrumbsTestId">
				<BreadcrumbsItem href="/item" text="item1" />
				<BreadcrumbsItem href="/item" text="item2" />
				<BreadcrumbsItem href="/item" text="item3" />
			</Breadcrumbs>

			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ marginLeft: token('space.050', '4px') }}>
				<AtlassianIcon label="" />
			</div>
		</div>
	</div>
);
