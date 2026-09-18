import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import Search from '../../Search';

describe('Search', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(<Search onInput={() => {}} onKeyDown={() => {}} />);
		await expect(container).toBeAccessible();
	});

	it('should auto focus on mount', () => {
		const { getByRole } = render(<Search onInput={() => {}} onKeyDown={() => {}} />);
		expect(getByRole('textbox')).toHaveFocus();
	});

	it('should show spinner when loading', () => {
		const { container, rerender } = render(
			<Search onInput={() => {}} onKeyDown={() => {}} isLoading />,
		);
		expect(container.querySelectorAll('svg').length).toBeGreaterThan(0);
		rerender(<Search onInput={() => {}} onKeyDown={() => {}} isLoading={false} />);
		expect(container.querySelectorAll('svg')).toHaveLength(0);
	});

	it('should render input controls if provided', () => {
		const { getByRole } = render(
			<Search inputControls={<button type="button">Test Btn</button>} />,
		);
		expect(getByRole('button', { name: 'Test Btn' })).toBeInTheDocument();
	});

	it('forwards supported keyboard controls to onKeyDown', () => {
		const onKeyDown = jest.fn();
		const { getByRole } = render(<Search onKeyDown={onKeyDown} />);
		fireEvent.keyDown(getByRole('textbox'), { key: 'ArrowDown' });
		fireEvent.keyDown(getByRole('textbox'), { key: 'a' });
		expect(onKeyDown).toHaveBeenCalledTimes(1);
	});
});
