import React from 'react';

import { render, screen } from '@testing-library/react';

import noop from '@atlaskit/ds-lib/noop';

import { useModal } from '../../hooks';
import ModalDialog from '../../modal-dialog';
import ModalHeader from '../../modal-header';
import ModalTitle from '../../modal-title';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('<ModalTitle />', () => {
	it('modal dialog should use aria-labelledby to reference the title text', () => {
		const title = 'Title - This is a dialog';

		render(
			<ModalDialog testId="test" onClose={noop}>
				<ModalHeader>
					<ModalTitle>{title}</ModalTitle>
				</ModalHeader>
			</ModalDialog>,
		);

		const content = screen.getByTestId('test--title-text');
		expect(content).toHaveAttribute('id');
		const titleId = content.getAttribute('id') as string;

		const element = screen.getByTestId('test');
		expect(element).toHaveAttribute('aria-labelledby', titleId);
	});

	it('modal dialog should use aria-labelledby to reference the text in a custom header component', () => {
		const title = 'Title - This is a dialog';
		let titleId;

		const CustomHeader = () => {
			const { titleId: id } = useModal();
			titleId = id;

			return (
				<div>
					<h4 id={id}>{title}</h4>
					<button onClick={noop} type="button">
						Close
					</button>
				</div>
			);
		};

		render(
			<ModalDialog testId="test">
				<CustomHeader />
			</ModalDialog>,
		);

		const element = screen.getByTestId('test');
		expect(element).toHaveAttribute('aria-labelledby', titleId);
		const text = screen.getByRole('heading', { level: 4 });
		expect(text).toBeInTheDocument();
		expect(text.innerHTML).toBe(title);
	});

	it('modal dialog title should be an h1 element', () => {
		const title = 'Modal title';

		render(
			<ModalDialog testId="test" onClose={noop}>
				<ModalHeader>
					<ModalTitle>{title}</ModalTitle>
				</ModalHeader>
			</ModalDialog>,
		);

		const element = screen.getByTestId('test--title');
		expect(element.tagName).toBe('H1');
	});

	it('should add an icon if the appearance prop is provided', () => {
		render(
			<ModalDialog testId="test" onClose={noop}>
				<ModalHeader>
					<ModalTitle appearance="danger">Title</ModalTitle>
				</ModalHeader>
			</ModalDialog>,
		);

		const icon = screen.getByRole('img');
		expect(icon).toHaveAccessibleName('danger');
	});

	it('icon should be part of the modal title if the appearance prop is provided', () => {
		/**
		 * The icon provides visual context to the type of modal that is being presented. If it is removed from the title
		 * `<h1>` then the context will not be provided to assistive technology users.
		 *
		 * Example with icon in title: "danger You're about to delete this page"
		 * Example without icon in title "You're about to delete this page"
		 *
		 * Not including the icon would fail WCAG 1.3.1
		 *
		 * DO NOT REMOVE THE ICON FROM THE TITLE
		 */

		render(
			<ModalDialog testId="test" onClose={noop}>
				<ModalHeader>
					<ModalTitle appearance="danger">Title</ModalTitle>
				</ModalHeader>
			</ModalDialog>,
		);

		const title = screen.getByRole('heading');
		const icon = screen.getByRole('img', { name: 'danger' });
		expect(title).toContainElement(icon);
	});

	it('should throw an error if modal context not available', () => {
		const err = console.error;
		console.error = jest.fn();

		try {
			render(<ModalTitle>Lone title</ModalTitle>);
		} catch (e) {
			expect((e as Error).message).toBe(
				'@atlaskit/modal-dialog: Modal context unavailable – this component needs to be a child of ModalDialog.',
			);
		}

		// Restore writing to stderr.
		console.error = err;
	});
});
