import React, { createRef } from 'react';

import { fireEvent, render, screen, within } from '@testing-library/react';

import __noop from '@atlaskit/ds-lib/noop';

import Breadcrumbs, { BreadcrumbsItem } from '../../../index';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Breadcrumbs container', () => {
	it('should be able to render a single child', () => {
		render(
			<Breadcrumbs onExpand={__noop} testId="bcs">
				<BreadcrumbsItem text="item" />
			</Breadcrumbs>,
		);
		const links = screen.queryAllByRole('link');
		expect(links.length).toEqual(1);
	});

	it('should render a navigation role', () => {
		render(
			<Breadcrumbs>
				<BreadcrumbsItem text="item" />
			</Breadcrumbs>,
		);

		expect(screen.queryAllByRole('navigation')).toHaveLength(1);
	});

	it('should render multiple children', () => {
		render(
			<Breadcrumbs testId="breadcrumbs-container">
				<BreadcrumbsItem href="/item" text="Item" />
				<BreadcrumbsItem href="/item" text="Another item" />
				<BreadcrumbsItem href="/item" text="A third item" />
			</Breadcrumbs>,
		);

		const container = screen.getByTestId('breadcrumbs-container');
		['Item', 'Another item', 'A third item'].forEach((linkText) => {
			const link = within(container).queryByRole('link', { name: linkText });
			expect(link).toBeInTheDocument();
		});
	});

	it('should not count empty children', () => {
		render(
			<Breadcrumbs onExpand={__noop} maxItems={3}>
				{null}
				<BreadcrumbsItem text="item" />
				<BreadcrumbsItem text="item" />
				<BreadcrumbsItem text="item" />
				{undefined}
				{false}
			</Breadcrumbs>,
		);

		const links = screen.queryAllByRole('link');
		expect(links.length).toEqual(3);
	});

	it('renders ellipsis for statefull breadcrumbs when there are too many items', () => {
		render(
			<Breadcrumbs testId="breadcrumbs-container" maxItems={2}>
				<BreadcrumbsItem href="/item" text="Item" />
				<BreadcrumbsItem href="/item" text="Another item" />
				<BreadcrumbsItem href="/item" text="A third item" />
			</Breadcrumbs>,
		);

		const container = screen.getByTestId('breadcrumbs-container');
		const links = within(container).queryAllByRole('link');

		expect(links.length).toEqual(2);

		const ellipsis = screen.getByTestId('breadcrumbs-container--breadcrumb-ellipsis');
		expect(ellipsis).toBeInTheDocument();
	});

	it('should set the reference on the breadcrumbs', () => {
		const ref = createRef();
		render(
			<Breadcrumbs testId="breadcrumbs-container" maxItems={2} ref={ref}>
				<BreadcrumbsItem href="/item" text="Item" />
				<BreadcrumbsItem href="/item" text="Another item" />
				<BreadcrumbsItem href="/item" text="A third item" />
			</Breadcrumbs>,
		);

		const nav = screen.getByLabelText('Breadcrumbs');
		expect(nav).toBe(ref.current);
	});

	it('should accept a function as a reference', () => {
		let ourNode: HTMLElement | undefined;
		render(
			<Breadcrumbs
				testId="breadcrumbs-container"
				maxItems={2}
				ref={(node: HTMLElement) => {
					ourNode = node;
				}}
			>
				<BreadcrumbsItem href="/item" text="Item" />
				<BreadcrumbsItem href="/item" text="Another item" />
				<BreadcrumbsItem href="/item" text="A third item" />
			</Breadcrumbs>,
		);

		const nav = screen.getByLabelText('Breadcrumbs');
		expect(nav).toBe(ourNode);
	});
});

describe('Controlled breadcrumbs', () => {
	it('render ellipsis', () => {
		const onExpand = jest.fn();
		render(
			<Breadcrumbs onExpand={onExpand} maxItems={2} testId="bcs">
				<BreadcrumbsItem text="item 1" />
				<BreadcrumbsItem text="item 2" />
				<BreadcrumbsItem text="item 3" />
			</Breadcrumbs>,
		);

		const links = screen.queryAllByRole('link');
		expect(links.length).toEqual(2);
		['item 1', 'item 3'].forEach((linkText) => {
			const link = screen.queryByRole('link', { name: linkText });
			expect(link).toBeInTheDocument();
		});
		const link = screen.queryByRole('link', { name: 'item 2' });
		expect(link).not.toBeInTheDocument();

		const ellipsis = screen.getByRole('button');
		fireEvent.click(ellipsis);
		expect(onExpand).toHaveBeenCalled();
	});

	it('render ellipsis - before and after', () => {
		const onExpand = jest.fn();
		render(
			<Breadcrumbs
				onExpand={onExpand}
				maxItems={4}
				itemsBeforeCollapse={2}
				itemsAfterCollapse={2}
				testId="bcs"
			>
				<BreadcrumbsItem text="item 1" />
				<BreadcrumbsItem text="item 2" />
				<BreadcrumbsItem text="item 3" />
				<BreadcrumbsItem text="item 4" />
				<BreadcrumbsItem text="item 5" />
				<BreadcrumbsItem text="item 6" />
				<BreadcrumbsItem text="item 7" />
			</Breadcrumbs>,
		);

		const links = screen.queryAllByRole('link');
		expect(links.length).toEqual(4);

		['item 1', 'item 2', 'item 6', 'item 7'].forEach((linkText) => {
			const link = screen.queryByRole('link', { name: linkText });
			expect(link).toBeInTheDocument();
		});
	});

	it('should be wrapped into nav tag', () => {
		render(
			<Breadcrumbs testId="breadcrumbs-container">
				<BreadcrumbsItem href="/item" text="Item" />
			</Breadcrumbs>,
		);

		const nav = screen.getByRole('navigation');
		expect(nav).toBeInTheDocument();
	});

	it('nav wrapper should have a default aria-label when no label passed through props', () => {
		render(
			<Breadcrumbs testId="breadcrumbs-container">
				<BreadcrumbsItem href="/item" text="Item" />
			</Breadcrumbs>,
		);

		const nav = screen.getByRole('navigation', { name: 'Breadcrumbs' });
		expect(nav).toBeInTheDocument();
	});

	it('received label props should be set as aria-label of nav wrapper', () => {
		render(
			<Breadcrumbs testId="breadcrumbs-container" label="Blog Breadcrumbs">
				<BreadcrumbsItem href="/item" text="Item" />
			</Breadcrumbs>,
		);

		const nav = screen.getByRole('navigation', { name: 'Blog Breadcrumbs' });
		expect(nav).toBeInTheDocument();
	});

	it('render ellipsis - default aria-label', () => {
		render(
			<Breadcrumbs testId="breadcrumbs-container" maxItems={2}>
				<BreadcrumbsItem href="/item" text="Item" />
				<BreadcrumbsItem href="/item" text="Another item" />
				<BreadcrumbsItem href="/item" text="A third item" />
			</Breadcrumbs>,
		);

		const ellipsis = screen.getByTestId('breadcrumbs-container--breadcrumb-ellipsis');
		expect(ellipsis).toBeInTheDocument();

		const ariaLabel = ellipsis.getAttribute('aria-label');
		expect(ariaLabel).toBe('Show more breadcrumbs');
	});

	it('render ellipsis - received aria-label', () => {
		render(
			<Breadcrumbs testId="breadcrumbs-container" maxItems={2} ellipsisLabel="Test label">
				<BreadcrumbsItem href="/item" text="Item" />
				<BreadcrumbsItem href="/item" text="Another item" />
				<BreadcrumbsItem href="/item" text="A third item" />
			</Breadcrumbs>,
		);

		const ellipsis = screen.getByTestId('breadcrumbs-container--breadcrumb-ellipsis');
		expect(ellipsis).toBeInTheDocument();

		const ariaLabel = ellipsis.getAttribute('aria-label');
		expect(ariaLabel).toBe('Test label');
	});
});

describe('Focus managment', () => {
	const breadcrumbsFixture = (props: any = {}) => {
		return (
			<Breadcrumbs testId="bcs" maxItems={2} {...props}>
				<BreadcrumbsItem href="/item" text="Item" />
				<BreadcrumbsItem href="/item" text="Another item" />
				<BreadcrumbsItem href="/item" text="A third item" />
			</Breadcrumbs>
		);
	};

	it('should focus first revealed item, if ellipsis was focused', () => {
		render(breadcrumbsFixture());

		const ellipsis = screen.getByTestId('bcs--breadcrumb-ellipsis');
		ellipsis.focus();

		fireEvent.click(ellipsis);
		const revealedItem = screen.getByRole('link', { name: 'Another item' });

		expect(revealedItem).toHaveFocus();
	});

	it('should not focus first revealed item, if ellipsis was not focused', () => {
		render(breadcrumbsFixture());

		const ellipsis = screen.getByTestId('bcs--breadcrumb-ellipsis');

		fireEvent.click(ellipsis);
		const revealedItem = screen.getByRole('link', { name: 'Another item' });

		expect(revealedItem).not.toHaveFocus();
	});

	describe('should not focus when there is no one of controlling prop', () => {
		it('without onExpand', () => {
			const { rerender } = render(breadcrumbsFixture({ isExpanded: false }));

			const ellipsis = screen.getByTestId('bcs--breadcrumb-ellipsis');
			ellipsis.focus();
			fireEvent.click(ellipsis);

			rerender(breadcrumbsFixture({ isExpanded: true }));
			const revealedItem = screen.getByRole('link', { name: 'Another item' });
			expect(revealedItem).not.toHaveFocus();
		});
	});

	it('should focus first revealed item, when have both isExpanded and onExpand props', () => {
		const mockOnExpand = jest.fn();

		const { rerender } = render(breadcrumbsFixture({ isExpanded: false, onExpand: mockOnExpand }));

		const ellipsis = screen.getByTestId('bcs--breadcrumb-ellipsis');
		ellipsis.focus();
		fireEvent.click(ellipsis);

		rerender(breadcrumbsFixture({ isExpanded: true, onExpand: mockOnExpand }));

		const revealedItem = screen.getByRole('link', { name: 'Another item' });
		expect(revealedItem).toHaveFocus();
	});

	it('should focus the wrapper when there are no intractive elements', () => {
		const NonInteractiveComponent = ({ children }: any) => <div>{children}</div>;

		render(
			<Breadcrumbs testId="bcs" maxItems={2}>
				<BreadcrumbsItem href="/item" text="Item" component={NonInteractiveComponent} />
				<BreadcrumbsItem href="/item" text="Another item" component={NonInteractiveComponent} />
				<BreadcrumbsItem href="/item" text="A third item" component={NonInteractiveComponent} />
			</Breadcrumbs>,
		);

		const wrapper = screen.getByLabelText('Breadcrumbs');
		const ellipsis = screen.getByTestId('bcs--breadcrumb-ellipsis');
		ellipsis.focus();
		fireEvent.click(ellipsis);

		expect(wrapper).toHaveFocus();
	});

	it('should focus the first breadcrumb item when there are no intractive elements appeared', () => {
		const NonInteractiveComponent = ({ children }: any) => <div>{children}</div>;

		render(
			<Breadcrumbs testId="bcs" maxItems={2}>
				<BreadcrumbsItem href="/item" text="Item" />
				<BreadcrumbsItem href="/item" text="Another item" component={NonInteractiveComponent} />
				<BreadcrumbsItem href="/item" text="A third item" />
			</Breadcrumbs>,
		);

		const firstBreadcrumbItem = screen.getByRole('link', { name: 'Item' });
		const ellipsis = screen.getByTestId('bcs--breadcrumb-ellipsis');
		ellipsis.focus();
		fireEvent.click(ellipsis);

		expect(firstBreadcrumbItem).toHaveFocus();
	});
});
