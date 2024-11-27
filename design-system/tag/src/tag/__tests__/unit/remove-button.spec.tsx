import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import RemoveButton from '../../internal/removable/remove-button';

describe('<RemoveButton />', () => {
	it('should apply the given testId', () => {
		render(<RemoveButton testId="remove-button" />);
		expect(screen.getByTestId('remove-button')).toBeInTheDocument();
	});

	it('should have type="button"', () => {
		render(<RemoveButton testId="remove-button" />);
		const removeButton = screen.getByTestId('remove-button');
		expect(removeButton).toHaveAttribute('type', 'button');
	});

	it('should apply the given aria-label', () => {
		render(<RemoveButton aria-label="remove tag" />);
		expect(screen.getByLabelText('remove tag')).toBeInTheDocument();
	});

	it('should apply the given onClick', () => {
		const onClick = jest.fn();
		render(<RemoveButton onClick={onClick} testId="remove-button" />);

		const removeButton = screen.getByTestId('remove-button');
		fireEvent.click(removeButton);

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('should apply the given onFocus', () => {
		const onFocus = jest.fn();
		render(<RemoveButton onFocus={onFocus} testId="remove-button" />);

		const removeButton = screen.getByTestId('remove-button');
		fireEvent.focus(removeButton);

		expect(onFocus).toHaveBeenCalledTimes(1);
	});

	it('should apply the given onBlur', () => {
		const onBlur = jest.fn();
		render(<RemoveButton onBlur={onBlur} testId="remove-button" />);

		const removeButton = screen.getByTestId('remove-button');
		fireEvent.blur(removeButton);

		expect(onBlur).toHaveBeenCalledTimes(1);
	});

	it('should apply the given onKeyPress', () => {
		const onKeyPress = jest.fn();
		render(<RemoveButton onKeyPress={onKeyPress} testId="remove-button" />);

		const removeButton = screen.getByTestId('remove-button');
		fireEvent.keyPress(removeButton, { key: 'Enter', keyCode: 13 });

		expect(onKeyPress).toHaveBeenCalledTimes(1);
	});

	it('should apply the given onMouseOver', () => {
		const onMouseOver = jest.fn();
		render(<RemoveButton onMouseOver={onMouseOver} testId="remove-button" />);

		const removeButton = screen.getByTestId('remove-button');
		fireEvent.mouseOver(removeButton);

		expect(onMouseOver).toHaveBeenCalledTimes(1);
	});

	it('should apply the given onMouseOut', () => {
		const onMouseOut = jest.fn();
		render(<RemoveButton onMouseOut={onMouseOut} testId="remove-button" />);

		const removeButton = screen.getByTestId('remove-button');
		fireEvent.mouseOut(removeButton);

		expect(onMouseOut).toHaveBeenCalledTimes(1);
	});
});
