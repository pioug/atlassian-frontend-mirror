import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '../src';

export default class BreadcrumbsExpand extends React.Component {
	render() {
		return (
			<Breadcrumbs isNavigation={false}>
				<BreadcrumbsItem href="/pages" text="Pages" />
				<BreadcrumbsItem href="/pages/home" text="Home" />
				<BreadcrumbsItem href="/item" text="Test" />
			</Breadcrumbs>
		);
	}
}
