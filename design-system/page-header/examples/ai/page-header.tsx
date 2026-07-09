import React from 'react';

import Breadcrumbs from '@atlaskit/breadcrumbs/breadcrumbs';
import { BreadcrumbsItem } from '@atlaskit/breadcrumbs/breadcrumbs-item';
import Button from '@atlaskit/button/new';
import PageHeader from '@atlaskit/page-header/page-header';

const Examples = (): React.JSX.Element => (
	<>
		<PageHeader>Page Title</PageHeader>
		<PageHeader
			breadcrumbs={
				<Breadcrumbs>
					<BreadcrumbsItem href="/" text="Home" />
					<BreadcrumbsItem href="/projects" text="Projects" />
					<BreadcrumbsItem text="Current Project" />
				</Breadcrumbs>
			}
			actions={<Button appearance="primary">Create</Button>}
		>
			Project Settings
		</PageHeader>
		<PageHeader
			actions={
				<>
					<Button appearance="subtle">Cancel</Button>
					<Button appearance="primary">Save Changes</Button>
				</>
			}
		>
			Edit Profile
		</PageHeader>
	</>
);
export default Examples;
