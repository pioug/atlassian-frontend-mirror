import React from 'react';
import { render, screen } from '@testing-library/react';
import OrderedList from '../../../../react/nodes/orderedList';

describe('Renderer - React/Nodes/OrderedList', () => {
	const content = <li>This is a ordered list</li>;

	it('should wrap content with <ol>-tag with no start prop', () => {
		render(<OrderedList>{content}</OrderedList>);

		const orderedList = screen.getByRole('list');

		expect(orderedList.tagName).toBe('OL');
		expect(orderedList).not.toHaveAttribute('start');
	});

	it('should wrap content with <ol>-tag with start prop', () => {
		render(<OrderedList start={3}>{content}</OrderedList>);

		const orderedList = screen.getByRole('list');

		expect(orderedList.tagName).toBe('OL');
		expect(orderedList).toHaveAttribute('start', '3');
	});

	describe('custom start numbers', () => {
		it('should wrap content with <ol>-tag with no start prop', () => {
			render(<OrderedList>{content}</OrderedList>);

			expect(screen.getByRole('list')).not.toHaveAttribute('start');
		});

		it('should wrap content with <ol>-tag with start prop', () => {
			render(<OrderedList order={3}>{content}</OrderedList>);

			expect(screen.getByRole('list')).toHaveAttribute('start', '3');
		});

		it('should wrap content with <ol>-tag with start prop rounded down', () => {
			render(<OrderedList order={3.5}>{content}</OrderedList>);

			expect(screen.getByRole('list')).toHaveAttribute('start', '3');
		});
	});

	describe('item counter padding', () => {
		const items = [{ type: 'listItem' }, { type: 'listItem' }];
		const paddingOf = (list: HTMLElement) =>
			list.style.getPropertyValue('--ed--list--item-counter--padding');

		// 99 + (2 - 1) = 100, so the gutter has to fit three digits. Dropping the item count
		// silently sizes it for 98 instead, which only a VR snapshot would catch.
		it('sizes the gutter from getContent()', () => {
			render(
				<OrderedList order={99} getContent={() => items}>
					{content}
				</OrderedList>,
			);

			expect(paddingOf(screen.getByRole('list'))).toBe('calc(4ch - 2px)');
		});

		it('sizes the gutter from the order alone for an empty list', () => {
			render(
				<OrderedList order={99} getContent={() => null}>
					{content}
				</OrderedList>,
			);

			expect(paddingOf(screen.getByRole('list'))).toBe('calc(3ch - 2px)');
		});
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(<OrderedList order={3}>{content}</OrderedList>);

		await expect(container).toBeAccessible();
	});
});
