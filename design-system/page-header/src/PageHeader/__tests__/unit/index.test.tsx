import React from 'react';

import { render, screen } from '@testing-library/react';

import PageHeader from '../../../index';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('@atlaskit/page-header', () => {
	const text = 'text';

	it('should render component as <h1> level heading', () => {
		render(<PageHeader>Title</PageHeader>);

		expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
	});

	it('should render passed children', () => {
		render(<PageHeader>{text}</PageHeader>);

		expect(screen.getByText(text)).toBeInTheDocument();
	});

	it('should render all passed children components', () => {
		const Bar = () => <div>Bottom bar</div>;
		const Actions = () => <div>Actions</div>;
		const BreadCrumbs = () => <div>Breadcrumb</div>;
		render(
			<PageHeader bottomBar={<Bar />} actions={<Actions />} breadcrumbs={<BreadCrumbs />}>
				Title
			</PageHeader>,
		);

		expect(screen.getByText('Bottom bar')).toBeInTheDocument();
		expect(screen.getByText('Actions')).toBeInTheDocument();
		expect(screen.getByText('Breadcrumb')).toBeInTheDocument();
		expect(screen.getByText('Title')).toBeInTheDocument();
	});

	it('should render custom component without the StyledTitle when disableTitleStyles is true', () => {
		render(
			<PageHeader disableTitleStyles>
				<span>{text}</span>
			</PageHeader>,
		);

		expect(screen.getByText(text)).toBeInTheDocument();
		expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
	});

	it('should truncate with truncateTitle prop', () => {
		render(<PageHeader truncateTitle>{text}</PageHeader>);

		const element = screen.getByText(text);

		expect(element).toHaveCompiledCss('white-space', 'nowrap');
		expect(element).toHaveCompiledCss('text-overflow', 'ellipsis');
		expect(element).toHaveCompiledCss('overflow-x', 'hidden');
	});

	it('should set received id prop as id of inner h1 element', () => {
		render(<PageHeader id="page-heading">{text}</PageHeader>);

		expect(screen.getByText(text)).toHaveAttribute('id', 'page-heading');
	});
});
