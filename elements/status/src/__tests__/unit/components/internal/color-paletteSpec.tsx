import React from 'react';
import ColorPalette from '../../../../components/internal/color-palette';
import { renderWithIntl } from '../../helpers/_testing-library';
import { fireEvent, screen } from '@testing-library/react';

describe('ColorPalette', () => {
	it('should render 6 colors', () => {
		const onClick = jest.fn();
		const onHover = jest.fn();
		renderWithIntl(<ColorPalette onClick={onClick} onHover={onHover} selectedColor={'red'} />);

		const colorComponents = screen.getAllByRole('button');
		expect(colorComponents.length).toBe(6);
		expect(colorComponents[0]).toHaveAttribute('tabindex', '0');
	});

	it('should have role list', () => {
		const onClick = jest.fn();
		const onHover = jest.fn();
		renderWithIntl(<ColorPalette onClick={onClick} onHover={onHover} selectedColor={'red'} />);

		const colorComponentsList = screen.queryAllByRole('list');
		expect(colorComponentsList.length).toBe(1);
	});

	it('should select selected color', () => {
		renderWithIntl(<ColorPalette onClick={jest.fn()} selectedColor={'red'} />);

		const selectedButton = screen.getByRole('button', { pressed: true });
		expect(selectedButton).toHaveAttribute('aria-pressed', 'true');
		expect(selectedButton).toHaveAttribute('tabindex', '-1');
		expect(selectedButton).toHaveAttribute('title', 'Red');
	});

	it('should not select if no selected color', () => {
		renderWithIntl(<ColorPalette onClick={jest.fn()} />);
		const selectedButton = screen.queryByRole('button', { pressed: true });
		expect(selectedButton).toBe(null);
	});
});

describe('ColorPalette keyboard navigation', () => {
	it('should focus next color on right arrow', async () => {
		renderWithIntl(<ColorPalette onClick={jest.fn()} selectedColor={'neutral'} />);
		// Simulate pressing of right arrow. Colors order defined internally in color-palette.tsx
		const colorButtons = screen.getAllByRole('button');
		fireEvent.keyDown(colorButtons[0], {
			key: 'ArrowRight',
			code: 'ArrowRight',
			keyCode: 39,
		});

		expect(colorButtons[1]).toHaveFocus(); // Purple
	});

	it('should select first color on when reaches the last one', () => {
		renderWithIntl(<ColorPalette onClick={jest.fn()} selectedColor={'green'} />);
		const colorButtons = screen.getAllByRole('button');
		for (let i = 0; i < 6; i++) {
			fireEvent.keyDown(colorButtons[i], {
				key: 'ArrowRight',
				code: 'ArrowRight',
				keyCode: 39,
			});
		}
		expect(colorButtons[0]).toHaveFocus(); // Grey
	});

	it('should select last color on leftArrow press at first color', () => {
		renderWithIntl(<ColorPalette onClick={jest.fn()} selectedColor={'neutral'} />);
		const colorButtons = screen.getAllByRole('button');
		fireEvent.keyDown(colorButtons[0], {
			key: 'ArrowLeft',
			code: 'ArrowLeft',
			keyCode: 37,
		});
		expect(colorButtons[5]).toHaveFocus(); //green
	});

	it('should focus next color on down arrow', () => {
		renderWithIntl(<ColorPalette onClick={jest.fn()} selectedColor={'neutral'} />);
		const colorButtons = screen.getAllByRole('button');
		fireEvent.keyDown(colorButtons[0], {
			key: 'ArrowDown',
			code: 'ArrowDown',
			keyCode: 40,
		});
		expect(colorButtons[1]).toHaveFocus(); // Purple
	});

	it('should select last color on up arrow press at first color', () => {
		renderWithIntl(<ColorPalette onClick={jest.fn()} selectedColor={'neutral'} />);
		const colorButtons = screen.getAllByRole('button');
		fireEvent.keyDown(colorButtons[0], {
			key: 'ArrowUp',
			code: 'ArrowUp',
			keyCode: 38,
		});
		expect(colorButtons[5]).toHaveFocus(); //green
	});
});
