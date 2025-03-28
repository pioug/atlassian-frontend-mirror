/* eslint-disable @atlaskit/design-system/ensure-design-token-usage, @atlaskit/design-system/ensure-design-token-usage/preview */
import { fireEvent, screen } from '@testing-library/react';
import { renderWithIntl } from '../helpers/_testing-library';
import React from 'react';
import { StatusPicker } from '../../..';

describe('StatusPicker', () => {
	it('should render color palette', () => {
		renderWithIntl(
			<StatusPicker
				selectedColor="red"
				text=""
				onColorClick={() => {}}
				onColorHover={() => {}}
				onTextChanged={() => {}}
				onEnter={() => {}}
			/>,
		);
		const buttons = screen.getAllByRole('button');
		expect(buttons.length).toBe(6);
		const checkedButton = screen.getByRole('button', { name: 'Red' });
		expect(checkedButton).toHaveAttribute('aria-pressed', 'true');
	});

	it('should render field text', () => {
		renderWithIntl(
			<StatusPicker
				selectedColor="red"
				text="In progress"
				onColorClick={() => {}}
				onTextChanged={() => {}}
				onEnter={() => {}}
			/>,
		);

		const textField = screen.getByRole('textbox');
		expect(textField).toHaveValue('In progress');
		expect(textField).toHaveAttribute('autoComplete', 'off');
		expect(textField).toHaveAttribute('spellCheck', 'false');
	});

	describe('autofocus', () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		it('should defer autofocus', function () {
			renderWithIntl(
				<StatusPicker
					selectedColor="red"
					text="In progress"
					onColorClick={() => {}}
					onTextChanged={() => {}}
					onEnter={() => {}}
					autoFocus={true}
				/>,
			);

			const input = screen.getByRole('textbox');
			const spyFocus = jest.spyOn(input, 'focus');

			jest.runAllTimers();
			expect(spyFocus).toHaveBeenCalled();
		});
	});

	it('should call onColorClick when clicking on a color', () => {
		const onColorClick = jest.fn();
		renderWithIntl(
			<StatusPicker
				selectedColor="red"
				text=""
				onColorClick={onColorClick}
				onTextChanged={() => {}}
				onEnter={() => {}}
			/>,
		);

		const component = screen.getByRole('button', { name: 'Blue' });
		fireEvent.click(component);
		expect(onColorClick).toHaveBeenCalled();
	});

	it('should call onTextChanged on text field change', () => {
		const onTextChanged = jest.fn();
		renderWithIntl(
			<StatusPicker
				selectedColor="red"
				text=""
				onColorClick={() => {}}
				onTextChanged={onTextChanged}
				onEnter={() => {}}
			/>,
		);

		const textField = screen.getByRole('textbox');
		fireEvent.change(textField, { target: { value: 'Done' } });
		expect(onTextChanged).toHaveBeenCalledWith('Done');
	});

	it('should call onEnter on enter in text field', () => {
		const onEnter = jest.fn();
		renderWithIntl(
			<StatusPicker
				selectedColor="red"
				text="bob"
				onColorClick={() => {}}
				onTextChanged={() => {}}
				onEnter={onEnter}
			/>,
		);

		const textField = screen.getByRole('textbox');
		fireEvent.keyPress(textField, { key: 'Enter', keyCode: 13 });
		expect(onEnter).toHaveBeenCalled();
	});
});
