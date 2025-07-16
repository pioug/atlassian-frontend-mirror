import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import __noop from '@atlaskit/ds-lib/noop';
import PageHeader from '@atlaskit/page-header';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Text } from '@atlaskit/primitives';
import Select from '@atlaskit/select';
import TextField from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

const breadcrumbs = (
	<Breadcrumbs onExpand={__noop}>
		<BreadcrumbsItem text="Teams" key="Teams" />
		<BreadcrumbsItem text="Design System Team" key="Design System Team" />
	</Breadcrumbs>
);
const actionsContent = (
	<ButtonGroup label="Content actions">
		<Button appearance="primary">Edit page</Button>
		<Button>Share</Button>
		<Button aria-label="More actions">...</Button>
	</ButtonGroup>
);
const barContent = (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
	<div style={{ display: 'flex' }}>
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<div style={{ flex: '0 0 200px' }}>
			<TextField isCompact placeholder="Filter" aria-label="Filter" />
		</div>
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<div style={{ flex: '0 0 200px', marginLeft: token('space.100', '8px') }}>
			<Select spacing="compact" placeholder="Choose an option" label="Choose an option" />
		</div>
	</div>
);

const PageHeaderComplexExample = () => {
	return (
		<React.Fragment>
			<Text as="p">
				Controls on this page do not have any interactions and are for example only.
			</Text>
			<PageHeader breadcrumbs={breadcrumbs} actions={actionsContent} bottomBar={barContent}>
				Introducing the Design System Team
			</PageHeader>
		</React.Fragment>
	);
};

export default PageHeaderComplexExample;
