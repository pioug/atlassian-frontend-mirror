import React, { type MouseEventHandler } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import noop from '@atlaskit/ds-lib/noop';

import { useModal } from '../../hooks';
import ModalDialog from '../../modal-dialog';
import ModalFooter from '../../modal-footer';

jest.mock('raf-schd', () => (fn: Function) => fn);
jest.mock('@atlaskit/ds-lib/warn-once');

describe('<ModalFooter />', () => {
	it('should render default footer', () => {
		render(
			<ModalDialog onClose={noop} testId="modal">
				<ModalFooter>My footer</ModalFooter>
			</ModalDialog>,
		);

		expect(screen.getByTestId('modal--footer')).toBeInTheDocument();
	});

	it('should be accessible using a user-defined test id', () => {
		render(
			<ModalDialog onClose={noop} testId="modal">
				<ModalFooter testId="my-footer">My footer</ModalFooter>
			</ModalDialog>,
		);

		expect(screen.queryByTestId('modal--footer')).not.toBeInTheDocument();
		expect(screen.getByTestId('my-footer')).toBeInTheDocument();
	});

	it('should render custom footer', () => {
		render(
			<ModalDialog onClose={noop}>
				<span data-testid="custom-footer">My footer</span>
			</ModalDialog>,
		);

		expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
	});

	it('should invoke onClose callback on custom footer', () => {
		const callback = jest.fn();
		const CustomFooter = () => {
			const { onClose } = useModal();
			return (
				<ModalFooter>
					<button
						data-testid="custom-close"
						onClick={onClose as MouseEventHandler<HTMLButtonElement>}
						type="button"
					>
						Custom close
					</button>
				</ModalFooter>
			);
		};

		render(
			<ModalDialog onClose={callback}>
				<CustomFooter />
			</ModalDialog>,
		);

		fireEvent.click(screen.getByTestId('custom-close'));
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('should throw an error if modal context not available', () => {
		const err = console.error;
		console.error = jest.fn();

		try {
			render(<ModalFooter>Lone footer</ModalFooter>);
		} catch (e) {
			expect((e as Error).message).toBe(
				'@atlaskit/modal-dialog: Modal context unavailable – this component needs to be a child of ModalDialog.',
			);
		}

		// Restore writing to stderr.
		console.error = err;
	});
});
