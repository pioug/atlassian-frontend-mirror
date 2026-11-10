import React, { type ReactNode } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import __noop from '@atlaskit/ds-lib/noop';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import Select from '../../state-manager';

const options = [
	{ label: 'one', value: '1' },
	{ label: 'two', value: '2' },
];

const TEST_ID = 'react-select';

function renderSelect({ onMenuOpen = __noop }: { onMenuOpen?: () => void } = {}) {
	return render(
		<Select
			testId={TEST_ID}
			options={options}
			onInputChange={__noop}
			onMenuOpen={onMenuOpen}
			onMenuClose={__noop}
			aria-label="choose option"
		/>,
	);
}

function getControl(): HTMLElement {
	return screen.getByTestId(`${TEST_ID}-select--control`);
}

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('mousedown opening (flag ON)', () => {
	beforeEach(() => {
		passGate('platform-dst-top-layer');
	});

	it('opens on mousedown without another callback on mouseup or click', () => {
		const onMenuOpen = jest.fn();
		renderSelect({ onMenuOpen });
		const control = getControl();

		fireEvent.mouseDown(control, { button: 0 });
		expect(onMenuOpen).toHaveBeenCalledTimes(1);

		fireEvent.pointerUp(control, { button: 0 });
		fireEvent.mouseUp(control, { button: 0 });
		expect(onMenuOpen).toHaveBeenCalledTimes(1);

		fireEvent.click(control, { button: 0 });
		expect(onMenuOpen).toHaveBeenCalledTimes(1);
	});

	it('opens only once after multiple mousedown events before click', () => {
		const onMenuOpen = jest.fn();
		renderSelect({ onMenuOpen });
		const control = getControl();

		fireEvent.mouseDown(control, { button: 0 });
		fireEvent.mouseDown(control, { button: 0 });
		fireEvent.click(control, { button: 0 });

		expect(onMenuOpen).toHaveBeenCalledTimes(1);
	});

	it('opens once for a complete user click', async () => {
		const onMenuOpen = jest.fn();
		renderSelect({ onMenuOpen });

		await userEvent.click(getControl());

		expect(onMenuOpen).toHaveBeenCalledTimes(1);
	});

	describe('a controlled menu that is already open', () => {
		const InlineMenuPortal = ({ children }: { children: ReactNode }) => children;

		const OpenSelect = ({ value }: { value?: (typeof options)[number] }) => (
			<Select
				testId={TEST_ID}
				options={options}
				value={value}
				menuIsOpen
				components={{ MenuPortal: InlineMenuPortal }}
				onInputChange={__noop}
				onMenuOpen={__noop}
				onMenuClose={__noop}
				aria-label="choose option"
			/>
		);

		function renderOpenSelect(props: Parameters<typeof OpenSelect>[0] = {}) {
			return render(<OpenSelect {...props} />);
		}

		it('gives the virtual focus to the first option on a pointer open', async () => {
			renderOpenSelect();
			const input = screen.getByRole('combobox');
			expect(input).not.toHaveAttribute('aria-activedescendant');

			await userEvent.click(getControl());

			expect(input).toHaveAttribute(
				'aria-activedescendant',
				screen.getByRole('option', { name: 'one' }).id,
			);
		});

		it('gives the virtual focus to the selected option on a pointer open', async () => {
			const { rerender } = renderOpenSelect();
			// A value set while the menu is open leaves the virtual focus on the first option.
			rerender(<OpenSelect value={options[1]} />);
			expect(screen.getByRole('combobox')).toHaveAttribute(
				'aria-activedescendant',
				screen.getByRole('option', { name: 'one' }).id,
			);

			await userEvent.click(getControl());

			expect(screen.getByRole('combobox')).toHaveAttribute(
				'aria-activedescendant',
				screen.getByRole('option', { name: 'two' }).id,
			);
		});

		it('moves from the focused option on the next ArrowDown', async () => {
			renderOpenSelect();

			await userEvent.click(getControl());
			await userEvent.keyboard('{ArrowDown}');

			expect(screen.getByRole('combobox')).toHaveAttribute(
				'aria-activedescendant',
				screen.getByRole('option', { name: 'two' }).id,
			);
		});
	});

	describe('a controlled menu that the consumer opens on focus', () => {
		// As `@atlaskit/user-picker` does: `onFocus` opens the menu, and `onMenuOpen` loads the
		// options.
		const OpenOnFocusSelect = ({ onMenuOpen }: { onMenuOpen: () => void }) => {
			const [isOpen, setIsOpen] = React.useState(false);
			return (
				<Select
					testId={TEST_ID}
					options={options}
					menuIsOpen={isOpen}
					onFocus={() => setIsOpen(true)}
					onInputChange={__noop}
					onMenuOpen={() => {
						onMenuOpen();
						setIsOpen(true);
					}}
					onMenuClose={() => setIsOpen(false)}
					aria-label="choose option"
				/>
			);
		};

		it('calls onMenuOpen once for the press that opens it', async () => {
			const onMenuOpen = jest.fn();
			render(<OpenOnFocusSelect onMenuOpen={onMenuOpen} />);

			await userEvent.click(getControl());

			expect(screen.getByRole('listbox')).toBeVisible();
			expect(onMenuOpen).toHaveBeenCalledTimes(1);
		});
	});
});
