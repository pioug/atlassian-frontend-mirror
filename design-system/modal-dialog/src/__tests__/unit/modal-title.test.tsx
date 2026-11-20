import React from 'react';

import { IntlProvider } from 'react-intl';

import noop from '@atlaskit/ds-lib/noop';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import { useModal } from '../../hooks';
import ModalDialog from '../../modal-dialog';
import ModalHeader from '../../modal-header';
import ModalTitle from '../../modal-title';

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

	describe('localized title icons', () => {
		it.each([
			['warning', 'avertissement'],
			['danger', 'danger traduit'],
		] as const)('uses the intl catalog for the %s icon', (appearance, translation) => {
			passGate('platform_modal_title_icon_label');

			render(
				<IntlProvider
					locale="fr"
					messages={{
						[`modal-dialog.title.${appearance}-icon-label`]: translation,
					}}
				>
					<ModalDialog>
						<ModalHeader>
							<ModalTitle appearance={appearance}>Title</ModalTitle>
						</ModalHeader>
					</ModalDialog>
				</IntlProvider>,
			);

			const icon = screen.getByRole('img', { name: translation });
			expect(screen.getByRole('heading')).toContainElement(icon);
			expect(screen.getByRole('dialog')).toHaveAccessibleName('Title');
		});

		it.each(['warning', 'danger'] as const)(
			'keeps the English %s label without an IntlProvider',
			(appearance) => {
				passGate('platform_modal_title_icon_label');

				render(
					<ModalDialog>
						<ModalHeader>
							<ModalTitle appearance={appearance}>Title</ModalTitle>
						</ModalHeader>
					</ModalDialog>,
				);

				expect(screen.getByRole('img')).toHaveAccessibleName(appearance);
			},
		);

		it('preserves the label for an unsupported runtime appearance', () => {
			passGate('platform_modal_title_icon_label');

			render(
				<IntlProvider locale="en">
					<ModalDialog>
						<ModalHeader>
							{/* @ts-expect-error - Existing consumers can pass unsupported appearances at runtime. */}
							<ModalTitle appearance="primary">Title</ModalTitle>
						</ModalHeader>
					</ModalDialog>
				</IntlProvider>,
			);

			expect(screen.getByRole('img')).toHaveAccessibleName('primary');
		});

		it('falls back to English when a translation is missing', () => {
			passGate('platform_modal_title_icon_label');
			const onError = jest.fn();

			render(
				<IntlProvider locale="fr" messages={{}} onError={onError}>
					<ModalDialog>
						<ModalHeader>
							<ModalTitle appearance="warning">Title</ModalTitle>
						</ModalHeader>
					</ModalDialog>
				</IntlProvider>,
			);

			expect(screen.getByRole('img')).toHaveAccessibleName('warning');
			expect(onError).toHaveBeenCalled();
		});

		it('updates the label when the application locale changes', () => {
			passGate('platform_modal_title_icon_label');
			const modal = (
				<ModalDialog>
					<ModalHeader>
						<ModalTitle appearance="warning">Title</ModalTitle>
					</ModalHeader>
				</ModalDialog>
			);
			const { rerender } = render(
				<IntlProvider
					locale="fr"
					messages={{ 'modal-dialog.title.warning-icon-label': 'avertissement' }}
				>
					{modal}
				</IntlProvider>,
			);

			expect(screen.getByRole('img')).toHaveAccessibleName('avertissement');

			rerender(
				<IntlProvider locale="de" messages={{ 'modal-dialog.title.warning-icon-label': 'Warnung' }}>
					{modal}
				</IntlProvider>,
			);

			expect(screen.getByRole('img')).toHaveAccessibleName('Warnung');
		});

		it('preserves the existing label when the gate is disabled', () => {
			failGate('platform_modal_title_icon_label');

			render(
				<IntlProvider
					locale="fr"
					messages={{ 'modal-dialog.title.warning-icon-label': 'avertissement' }}
				>
					<ModalDialog>
						<ModalHeader>
							<ModalTitle appearance="warning">Title</ModalTitle>
						</ModalHeader>
					</ModalDialog>
				</IntlProvider>,
			);

			expect(screen.getByRole('img')).toHaveAccessibleName('warning');
		});

		it('does not add an icon without an appearance', () => {
			render(
				<ModalDialog>
					<ModalHeader>
						<ModalTitle>Title</ModalTitle>
					</ModalHeader>
				</ModalDialog>,
			);

			expect(screen.queryByRole('img')).not.toBeInTheDocument();
		});
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
