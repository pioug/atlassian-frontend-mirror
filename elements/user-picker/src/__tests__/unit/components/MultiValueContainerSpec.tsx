import React from 'react';

import { act, render, screen } from '@testing-library/react';
import noop from 'lodash/noop';
import { IntlProvider } from 'react-intl';

import { MultiValueContainer } from '../../../components/MultiValueContainer';

describe('MultiValueContainer', () => {
	const defaultSelectProps = {
		value: [1],
		options: [1, 2, 3],
		isDisabled: false,
		isFocused: true,
	};

	const children = [
		<div key="placeholder">Placeholder</div>,
		<input key="input" aria-label="People" type="text" />,
	];

	const selectComponentProps = {
		getStyles: noop,
		cx: noop,
		getClassNames: noop,
		innerProps: {},
		isDisabled: false,
		isFocused: false,
		isMulti: true,
	};

	const renderValueContainer = (
		selectProps: Record<string, unknown> = {},
		getValue: () => unknown[] = () => [],
	) =>
		render(
			<IntlProvider locale="en" messages={{}}>
				<MultiValueContainer
					{...(selectComponentProps as any)}
					children={children}
					hasValue={
						Array.isArray(selectProps.value ?? defaultSelectProps.value) &&
						((selectProps.value ?? defaultSelectProps.value) as unknown[]).length > 0
					}
					getValue={getValue as any}
					selectProps={{ ...defaultSelectProps, ...selectProps } as any}
					options={[] as any}
				/>
			</IntlProvider>,
		);

	const expectPlaceholder = (selectProps: Record<string, unknown>, expected?: string) => {
		renderValueContainer(selectProps);

		const input = screen.getByRole('textbox', { name: 'People' });
		if (expected === undefined) {
			expect(input).not.toHaveAttribute('placeholder');
		} else {
			expect(input).toHaveAttribute('placeholder', expected);
		}
	};

	describe('placeholder', () => {
		it.each<[string | undefined, number[], boolean]>([
			['add more people...', defaultSelectProps.value, false],
			['Enter more...', defaultSelectProps.value, true],
			['add more people...', defaultSelectProps.options, false],
			[undefined, [], false],
		])('sets the placeholder to "%s" for the selected values', (placeholder, value, override) => {
			expectPlaceholder(
				{
					value,
					addMoreMessage: override ? placeholder : undefined,
				},
				placeholder,
			);
		});

		it('does not display the add-more placeholder when disabled', async () => {
			expectPlaceholder({ isDisabled: true }, undefined);
			await expect(document.body).toBeAccessible();
		});
	});

	describe('scrolling after selection changes', () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		const getScrollContainer = (): HTMLElement => {
			const input = screen.getByRole('textbox', { name: 'People' });
			const valueContainer = input.parentElement;
			if (!valueContainer) {
				throw new Error('Could not find the select value container');
			}
			return valueContainer as HTMLElement;
		};

		it('scrolls to the bottom when a new item is added while focused', () => {
			const getValue = jest.fn<unknown[], []>(() => []);
			const { rerender } = renderValueContainer({}, getValue);
			const scrollContainer = getScrollContainer();
			Object.defineProperty(scrollContainer, 'scrollHeight', {
				configurable: true,
				value: 100,
			});

			getValue.mockReturnValue([1]);
			rerender(
				<IntlProvider locale="en" messages={{}}>
					<MultiValueContainer
						{...(selectComponentProps as any)}
						children={children}
						hasValue
						getValue={getValue as any}
						selectProps={defaultSelectProps as any}
						options={[] as any}
					/>
				</IntlProvider>,
			);

			act(() => jest.runAllTimers());

			expect(scrollContainer).toHaveProperty('scrollTop', 100);
		});

		it('does not scroll when the select is not focused', () => {
			const getValue = jest.fn<unknown[], []>(() => []);
			const { rerender } = renderValueContainer({ isFocused: false }, getValue);
			const scrollContainer = getScrollContainer();
			Object.defineProperty(scrollContainer, 'scrollHeight', {
				configurable: true,
				value: 100,
			});

			getValue.mockReturnValue([1]);
			rerender(
				<IntlProvider locale="en" messages={{}}>
					<MultiValueContainer
						{...(selectComponentProps as any)}
						children={children}
						hasValue
						getValue={getValue as any}
						selectProps={{ ...defaultSelectProps, isFocused: false } as any}
						options={[] as any}
					/>
				</IntlProvider>,
			);

			act(() => jest.runAllTimers());

			expect(scrollContainer).toHaveProperty('scrollTop', 0);
		});

		it('does not scroll when an item is removed', () => {
			const getValue = jest.fn<unknown[], []>(() => [1]);
			const { rerender } = renderValueContainer({}, getValue);
			const scrollContainer = getScrollContainer();
			Object.defineProperty(scrollContainer, 'scrollHeight', {
				configurable: true,
				value: 100,
			});

			getValue.mockReturnValue([]);
			rerender(
				<IntlProvider locale="en" messages={{}}>
					<MultiValueContainer
						{...(selectComponentProps as any)}
						children={children}
						hasValue
						getValue={getValue as any}
						selectProps={defaultSelectProps as any}
						options={[] as any}
					/>
				</IntlProvider>,
			);

			act(() => jest.runAllTimers());

			expect(scrollContainer).toHaveProperty('scrollTop', 0);
		});
	});
});
