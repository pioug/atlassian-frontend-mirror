import React from 'react';

import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';

import type { MultiValueProps } from '@atlaskit/select/types';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { UserPicker } from '../../../components/UserPicker';
import type { OptionData, UserPickerProps } from '../../../types';

const values = [
	{ id: 'first', name: 'First user' },
	{ id: 'second@example.com', name: 'second@example.com', type: 'email' as const },
];

const CustomMultiValue = ({ children }: MultiValueProps<OptionData, boolean>) => (
	<div>{children}</div>
);
const customComponents = { MultiValue: CustomMultiValue };

const RemovableCustomMultiValue = ({
	children,
	removeProps,
}: MultiValueProps<OptionData, boolean>) => (
	<div data-testid="custom-value">
		{children}
		<button
			type="button"
			onClick={() => removeProps.onClick?.({} as React.MouseEvent<HTMLDivElement>)}
		>
			Remove custom value
		</button>
	</div>
);
const removableCustomComponents = { MultiValue: RemovableCustomMultiValue };

const picker = (props: Partial<UserPickerProps> = {}) => (
	<IntlProvider locale="en">
		<UserPicker fieldId="invitees" ariaLabel="Invitees" isMulti options={values} {...props} />
	</IntlProvider>
);

const renderPicker = async (props: Partial<UserPickerProps> = {}) => {
	let view!: ReturnType<typeof render>;
	// Wait for the real picker’s asynchronous message loading before interacting.
	await act(async () => {
		view = render(picker(props));
	});
	return view;
};

describe.each([false, true])('selected value list gate=%s', (listEnabled) => {
	describe.each([false, true])('tag motion=%s', (motionEnabled) => {
		beforeEach(() => {
			jest.useFakeTimers();
			(listEnabled ? passGate : failGate)('platform-user-picker-a11y-30826-value-list');
			(motionEnabled ? passGate : failGate)('platform-dst-motion-uplift-labels');
		});

		afterEach(async () => {
			await act(async () => {
				jest.runOnlyPendingTimers();
			});
			jest.useRealTimers();
		});

		it.each([false, true])(
			'preserves the focused input through selection and reset with tag uplift=%s',
			async (upliftEnabled) => {
				(upliftEnabled ? passGate : failGate)('platform-dst-lozenge-tag-badge-visual-uplifts');
				const { rerender } = await renderPicker({ value: [] });
				const input = screen.getByRole('combobox', { name: 'Invitees' });
				act(() => input.focus());

				for (const selected of [values.slice(0, 1), values, values.slice(1), []]) {
					rerender(picker({ value: selected }));
					expect(screen.getByRole('combobox', { name: 'Invitees' })).toBe(input);
					expect(input).toHaveFocus();
					act(() => jest.advanceTimersByTime(100));
					expect(input).toHaveFocus();
				}

				expect(screen.queryByRole('list')).not.toBeInTheDocument();
			},
		);

		it.each([false, true])(
			'renders valid selected value markup with custom renderer=%s',
			async (custom) => {
				passGate('platform-dst-lozenge-tag-badge-visual-uplifts');
				await renderPicker({
					defaultValue: values,
					...(custom ? { components: customComponents } : {}),
				});
				const input = screen.getByRole('combobox', { name: 'Invitees' });

				if (listEnabled) {
					const list = screen.getByRole('list');
					expect(list.tagName).toBe('UL');
					const items = within(list).getAllByRole('listitem');
					expect(items).toHaveLength(2);
					items.forEach((item, index) => {
						expect(item.tagName).toBe('LI');
						expect(item.parentElement).toBe(list);
						expect(item).toHaveTextContent(values[index].name);
					});
					expect(list).not.toContainElement(input);
					expect(input.closest('[data-user-picker-value-container]')).not.toBeNull();
				} else {
					expect(screen.queryByRole('list')).not.toBeInTheDocument();
					expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
					expect(input.closest('[data-user-picker-value-container]')).toBeNull();
				}
			},
		);

		it('keeps focus while selecting with the pointer and removing with the keyboard', async () => {
			const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
			passGate('platform-dst-lozenge-tag-badge-visual-uplifts');
			await renderPicker();
			const input = screen.getByRole('combobox', { name: 'Invitees' });
			act(() => input.focus());
			await user.keyboard('{ArrowDown}');
			await user.click(screen.getByRole('option', { name: /First user/ }));
			expect(input).toHaveFocus();
			expect(screen.getByRole('button', { name: 'Remove First user' })).toBeInTheDocument();

			await user.keyboard('{Backspace}');
			act(() => jest.advanceTimersByTime(100));
			expect(screen.queryByRole('button', { name: 'Remove First user' })).not.toBeInTheDocument();
			expect(screen.getByRole('combobox', { name: 'Invitees' })).toBe(input);
			expect(input).toHaveFocus();
		});

		it('preserves the custom renderer and its exit animation inside the list item', async () => {
			const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
			await renderPicker({
				defaultValue: values.slice(0, 1),
				components: removableCustomComponents,
			});
			act(() => jest.advanceTimersByTime(150));
			const customValue = screen.getByTestId('custom-value');
			const enteringClassName = customValue.parentElement?.className;
			if (listEnabled) {
				const item = screen.getByRole('listitem');
				expect(item).toContainElement(customValue);
				expect(item.parentElement).toBe(screen.getByRole('list'));
			}

			await user.click(screen.getByRole('button', { name: 'Remove custom value' }));
			if (motionEnabled) {
				expect(customValue).toBeInTheDocument();
				expect(customValue.parentElement?.className).not.toBe(enteringClassName);
				act(() => jest.advanceTimersByTime(100));
			}
			expect(screen.queryByTestId('custom-value')).not.toBeInTheDocument();
			expect(screen.queryByRole('list')).not.toBeInTheDocument();
		});

		it('only exposes current values and removes the list after the final exit', async () => {
			passGate('platform-dst-lozenge-tag-badge-visual-uplifts');
			const { container, rerender } = await renderPicker({ value: values });
			rerender(picker({ value: values.slice(1) }));
			act(() => jest.advanceTimersByTime(100));
			if (listEnabled) {
				const items = within(screen.getByRole('list')).getAllByRole('listitem');
				expect(items).toHaveLength(1);
				expect(items[0]).toHaveTextContent(values[1].name);
			}

			rerender(picker({ value: [] }));
			act(() => jest.advanceTimersByTime(100));
			expect(container.querySelector('ul')).not.toBeInTheDocument();
		});
	});
});

it('exposes disabled selected invitees as an accessible list', async () => {
	passGate('platform-user-picker-a11y-30826-value-list');
	passGate('platform-dst-lozenge-tag-badge-visual-uplifts');
	const { container } = await renderPicker({ defaultValue: values, isDisabled: true });

	expect(within(screen.getByRole('list')).getAllByRole('listitem')).toHaveLength(2);
	expect(screen.getByRole('combobox', { hidden: true })).toBeDisabled();
	await expect(container).toBeAccessible();
});
