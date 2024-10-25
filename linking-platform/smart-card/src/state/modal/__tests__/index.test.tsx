import React, { lazy, type ReactNode, useState } from 'react';

import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { SmartLinkModalProvider, useSmartLinkModal } from '../index';

const Modal = lazy(() =>
	import('./index.test.modal.mock').then(({ Modal }) => ({
		default: Modal,
	})),
);

const ErrorModal = lazy(() =>
	import('./index.test.modal.mock').then(({ ErrorModal }) => ({
		default: ErrorModal,
	})),
);

// Test case: Happy path
const Action1 = () => {
	const modal = useSmartLinkModal();

	const onClose = () => modal.close();
	const onClick = () => modal.open(<Modal onClose={onClose} />);

	return (
		<button data-testid="action-1" onClick={onClick} type="button">
			Open
		</button>
	);
};

// Test case: Modal throwing error on render
const Action2 = () => {
	const modal = useSmartLinkModal();

	const onClose = () => modal.close();
	const onClick = () => modal.open(<ErrorModal onClose={onClose} />);

	return (
		<button data-testid="action-2" onClick={onClick} type="button">
			Open
		</button>
	);
};

const TestComponent = ({ onClick }: { onClick?: React.MouseEventHandler<HTMLDivElement> }) => {
	const [child, setChild] = useState<ReactNode | null>(
		<div data-testid="child">
			<Action1 />
			<Action2 />
		</div>,
	);

	return (
		<div data-testid="parent" onClick={onClick}>
			<SmartLinkModalProvider>
				<button data-testid="btn-delete" onClick={() => setChild(null)} type="button">
					Delete
				</button>
				{child}
			</SmartLinkModalProvider>
		</div>
	);
};

describe('useSmartLinkModal', () => {
	it('renders element outside of its container', async () => {
		render(<TestComponent />);

		const btnOpen = await screen.findByTestId('action-1');
		fireEvent.click(btnOpen);

		const parent = await screen.findByTestId('parent');
		const child = await screen.findByTestId('child');

		const modalInParent = await within(parent).findByTestId('modal');
		const modalInChild = within(child).queryByTestId('modal');

		expect(modalInParent).not.toBeNull();
		expect(modalInChild).toBeNull();
	});

	it('removes the element', async () => {
		render(<TestComponent />);

		const btnOpen = await screen.findByTestId('action-1');
		fireEvent.click(btnOpen);
		await screen.findByTestId('modal');

		const btnClose = await screen.findByTestId('btn-close');
		fireEvent.click(btnClose);

		const modal = screen.queryByTestId('modal');
		expect(modal).not.toBeInTheDocument();
	});

	it('keeps the element even if its triggered component is removed', async () => {
		render(<TestComponent />);

		const btnOpen = await screen.findByTestId('action-1');
		fireEvent.click(btnOpen);
		await screen.findByTestId('modal');

		const btnDelete = await screen.findByTestId('btn-delete');
		fireEvent.click(btnDelete);
		expect(screen.queryByTestId('consumer')).not.toBeInTheDocument();

		const modal = await screen.findByTestId('modal');
		expect(modal).toBeInTheDocument();
	});

	it('does not throw error on parent component when the modal throwing error on render', async () => {
		render(<TestComponent />);

		const btnOpen = await screen.findByTestId('action-2');

		fireEvent.click(btnOpen);

		const modal = screen.queryByTestId('modal');
		const parent = await screen.findByTestId('parent');

		expect(modal).not.toBeInTheDocument();
		expect(parent).toBeInTheDocument();
	});

	it('can render second element after first rendered element throws error', async () => {
		render(<TestComponent />);

		const btnOpen = await screen.findByTestId('action-1');
		const btnError = await screen.findByTestId('action-2');

		fireEvent.click(btnError);
		fireEvent.click(btnOpen);

		const modal = await screen.findByTestId('modal');
		expect(modal).toBeInTheDocument();
	});

	it('does not throw error when context is not available', () => {
		const { result } = renderHook(() => useSmartLinkModal());

		act(() => {
			result.current.open(<div />);
			result.current.close();
		});

		expect(result.current).toBeDefined();
	});

	it('does not propagate click event to parent component', async () => {
		const onClick = jest.fn();
		render(<TestComponent onClick={onClick} />);

		// First click to open modal
		const btnOpen = await screen.findByTestId('action-1');
		fireEvent.click(btnOpen);

		const parent = await screen.findByTestId('parent');
		await within(parent).findByTestId('modal');

		// Second click inside modal
		const modal = await screen.findByTestId('modal');
		fireEvent.click(modal);

		// Third click inside modal to close modal
		const btnClose = await screen.findByTestId('btn-close');
		fireEvent.click(btnClose);

		expect(onClick).toHaveBeenCalledTimes(1);
	});
});
