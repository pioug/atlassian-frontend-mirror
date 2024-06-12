import React from 'react';

import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

import PageHeader from '../../../index';

describe('@atlaskit/page-header', () => {
	it('should render correctly', () => {
		const BreadCrumbs = () => <div>Breadcrumb</div>;
		const Actions = () => <div>Action</div>;
		const Bar = () => <div>Bar</div>;

		const wrapper = (
			<PageHeader breadcrumbs={<BreadCrumbs />} actions={<Actions />} bottomBar={<Bar />}>
				Test
			</PageHeader>
		);
		const Component = renderer.create(wrapper).toJSON();
		expect(Component).toMatchSnapshot();
	});

	it('should render correctly with disableTitleStyles prop', () => {
		const BreadCrumbs = () => <div>Breadcrumb</div>;
		const Actions = () => <div>Action</div>;
		const Bar = () => <div>Bar</div>;

		const wrapper = (
			<PageHeader
				breadcrumbs={<BreadCrumbs />}
				actions={<Actions />}
				bottomBar={<Bar />}
				disableTitleStyles
			>
				Test
			</PageHeader>
		);

		const Component = renderer.create(wrapper).toJSON();
		expect(Component).toMatchSnapshot();
	});

	it('should render component as <h1> level heading', () => {
		const { container } = render(<PageHeader>Title</PageHeader>);

		expect(container.querySelector('h1')).toBeInTheDocument();
	});

	it('should render passed children', () => {
		render(<PageHeader>Title</PageHeader>);

		expect(screen.getByText('Title')).toBeInTheDocument();
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
		const CustomTitle = () => <span>Custom component</span>;
		const { container } = render(
			<PageHeader disableTitleStyles>
				<CustomTitle />
			</PageHeader>,
		);

		expect(screen.getByText('Custom component')).toBeInTheDocument();
		expect(container.querySelector('h1')).not.toBeInTheDocument();
	});

	it('should truncate with truncateTitle prop', () => {
		render(<PageHeader truncateTitle>Long heading text</PageHeader>);

		const element = screen.getByText('Long heading text');

		expect(element).toHaveStyleDeclaration('white-space', 'nowrap');
		expect(element).toHaveStyleDeclaration('text-overflow', 'ellipsis');
		expect(element).toHaveStyleDeclaration('overflow-x', 'hidden');
	});

	it('should set received id prop as id of inner h1 element', () => {
		render(<PageHeader id="page-heading">Title</PageHeader>);

		expect(screen.getByText('Title')).toHaveAttribute('id', 'page-heading');
	});
});
