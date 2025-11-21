import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import __noop from '@atlaskit/ds-lib/noop';
import PageHeader from '@atlaskit/page-header';
import { Box, Stack } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	container400: {
		width: '400px',
	},
	container300: {
		width: '300px',
	},
	container200: {
		width: '200px',
	},
});

const getBreadcrumbs = (label: string) => (
	<Breadcrumbs onExpand={__noop} label={`Breadcrumbs for ${label} example`}>
		<BreadcrumbsItem text="Design System" key="Design System" />
		<BreadcrumbsItem text="Page Header" key="Page Header" />
		<BreadcrumbsItem text={`Example ${label}`} key={`Example ${label}`} />
	</Breadcrumbs>
);

const actionsContent = (
	<ButtonGroup label="Actions">
		<Button appearance="primary">Edit</Button>
		<Button>Share</Button>
	</ButtonGroup>
);

const PageHeaderWrappingExample = (): React.JSX.Element => {
	return (
		<Stack space="space.025">
			<Box>
				<PageHeader breadcrumbs={getBreadcrumbs('Regular')} actions={actionsContent}>
					This is a regular page header that might wrap on smaller screens
				</PageHeader>
			</Box>

			<Box xcss={styles.container400}>
				<PageHeader breadcrumbs={getBreadcrumbs('400px')} actions={actionsContent}>
					This is a page header inside a fixed-width container to demonstrate word wrapping
				</PageHeader>
			</Box>

			<Box xcss={styles.container300}>
				<PageHeader breadcrumbs={getBreadcrumbs('300px')} actions={actionsContent}>
					LongWordWithoutSpaces demonstrates letter-by-letter wrapping
				</PageHeader>
			</Box>

			<Box xcss={styles.container200}>
				<PageHeader breadcrumbs={getBreadcrumbs('200px')} actions={actionsContent}>
					Very narrow container
				</PageHeader>
			</Box>
		</Stack>
	);
};

export default PageHeaderWrappingExample;
