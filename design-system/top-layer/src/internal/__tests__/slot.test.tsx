import React, { createRef } from 'react';

import { render, screen, userEvent } from '@atlassian/testing-library';

import { Slot } from '../slot';

describe('Slot', () => {
	it('should be accessible', async () => {
		function Harness() {
			return (
				<Slot>
					<button type="button">Open</button>
				</Slot>
			);
		}

		const { container } = render(<Harness />);

		await expect(container).toBeAccessible();
	});

	it('should render null children as nothing', () => {
		const { container } = render(<Slot>{null}</Slot>);

		expect(container.firstChild).toBeNull();
	});

	it('should render primitive children unchanged', () => {
		const { rerender } = render(<Slot>plain text</Slot>);

		expect(screen.getByText('plain text')).toBeInTheDocument();

		rerender(<Slot>{42}</Slot>);

		expect(screen.getByText('42')).toBeInTheDocument();
	});

	it('should render a non-element child (e.g. array of elements) without merging props onto a wrapper', () => {
		const nodes = [
			<button key="a" type="button">
				a
			</button>,
			<button key="b" type="button">
				b
			</button>,
		];

		render(<Slot data-testid="should-not-appear-on-array">{nodes}</Slot>);

		expect(screen.queryByTestId('should-not-appear-on-array')).not.toBeInTheDocument();
		expect(screen.getByText('a')).toBeInTheDocument();
		expect(screen.getByText('b')).toBeInTheDocument();
	});

	it('should merge extra props onto a single element child', () => {
		function Harness() {
			return (
				<Slot aria-expanded={true} data-testid="slotted">
					<button type="button">Open</button>
				</Slot>
			);
		}

		render(<Harness />);

		const button = screen.getByTestId('slotted');

		expect(button).toHaveAttribute('aria-expanded', 'true');
		expect(button).toHaveTextContent('Open');
	});

	it('should set ref when the child has no ref', () => {
		const slotRef = createRef<HTMLButtonElement>();

		function Harness() {
			return (
				<Slot ref={slotRef} data-testid="slotted">
					<button type="button">Open</button>
				</Slot>
			);
		}

		render(<Harness />);

		const button = screen.getByTestId('slotted');

		expect(slotRef.current).toBe(button);
	});

	it('should merge forwarded ref with an existing object ref on the child', () => {
		const slotRef = createRef<HTMLButtonElement>();
		const childRef = createRef<HTMLButtonElement>();

		function Harness() {
			return (
				<Slot ref={slotRef}>
					<button ref={childRef} type="button" data-testid="slotted">
						Open
					</button>
				</Slot>
			);
		}

		render(<Harness />);

		const button = screen.getByTestId('slotted');

		expect(slotRef.current).toBe(button);
		expect(childRef.current).toBe(button);
	});

	it('should invoke both forwarded ref and child callback refs with the same node', () => {
		const slotCallback = jest.fn();
		const childCallback = jest.fn();

		function Harness() {
			return (
				<Slot ref={slotCallback}>
					<button ref={childCallback} type="button" data-testid="slotted">
						Open
					</button>
				</Slot>
			);
		}

		render(<Harness />);

		const button = screen.getByTestId('slotted');

		expect(slotCallback).toHaveBeenCalledTimes(1);
		expect(slotCallback).toHaveBeenCalledWith(button);
		expect(childCallback).toHaveBeenCalledTimes(1);
		expect(childCallback).toHaveBeenCalledWith(button);
	});

	it('should let caller props override overlapping props on the child', async () => {
		const childClick = jest.fn();
		const parentClick = jest.fn();

		function Harness() {
			return (
				<Slot onClick={parentClick}>
					<button type="button" data-testid="slotted" onClick={childClick}>
						Open
					</button>
				</Slot>
			);
		}

		render(<Harness />);

		const user = userEvent.setup();

		await user.click(screen.getByTestId('slotted'));

		expect(parentClick).toHaveBeenCalledTimes(1);
		expect(childClick).not.toHaveBeenCalled();
	});
});
