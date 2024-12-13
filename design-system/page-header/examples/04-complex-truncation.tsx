import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import __noop from '@atlaskit/ds-lib/noop';
import PageHeader from '@atlaskit/page-header';
import { Text } from '@atlaskit/primitives';
import Select from '@atlaskit/select';
import TextField from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

const breadcrumbs = (
	<Breadcrumbs onExpand={__noop}>
		<BreadcrumbsItem text="Projects" key="Projects" />
		<BreadcrumbsItem text="Accessibility" key="Accessibility" />
	</Breadcrumbs>
);
const actionsContent = (
	<ButtonGroup label="Content actions">
		<Button appearance="primary">Primary Action</Button>
		<Button>Default</Button>
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

const PageHeaderComplexTruncationExample = () => {
	return (
		<React.Fragment>
			<Text as="p">
				Controls on this page do not have any interactions and are for example only.
			</Text>
			<PageHeader
				breadcrumbs={breadcrumbs}
				actions={actionsContent}
				bottomBar={barContent}
				truncateTitle
			>
				Don't truncate your page titles as it's not accessible, people won't be able to read your
				really long title describing what content to expect on the page, especially on smaller
				screen sizes.
			</PageHeader>
		</React.Fragment>
	);
};

export default PageHeaderComplexTruncationExample;
