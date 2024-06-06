import React, { createRef, type RefObject } from 'react';

import { fireEvent, render } from '@testing-library/react';

import Rating, { type RatingRender } from '../../../components/rating';

const renderIcon: RatingRender = (props) => {
	return <div data-testid={`icon-${props.isChecked ? 'checked' : 'unchecked'}`} />;
};

const expectIsVisuallyHidden = (element: HTMLElement) => {
	expect(element).toHaveStyleDeclaration('border', '0');
	expect(element).toHaveStyleDeclaration('clip', 'rect(1px, 1px, 1px, 1px)');
	expect(element).toHaveStyleDeclaration('height', '1px');
	expect(element).toHaveStyleDeclaration('overflow', 'hidden');
	expect(element).toHaveStyleDeclaration('padding', '0');
	expect(element).toHaveStyleDeclaration('position', 'absolute');
	expect(element).toHaveStyleDeclaration('width', '1px');
	expect(element).toHaveStyleDeclaration('white-space', 'nowrap');
};

describe('<Rating />', () => {
	it('should render the unchecked icon inside the unchecked container', () => {
		const { getByTestId } = render(
			<Rating render={renderIcon} label="GREAT" testId="item" id="great" value="great" />,
		);

		expect(getByTestId('item--icon-container').children).toMatchInlineSnapshot(`
            HTMLCollection [
              <div
                data-testid="icon-unchecked"
              />,
            ]
        `);
	});

	it('should render the checked icon inside the checked container', () => {
		const { getByTestId } = render(
			<Rating render={renderIcon} label="GREAT" testId="item" id="great" value="great" />,
		);

		expect(getByTestId('item--icon-checked-container').children).toMatchInlineSnapshot(`
      HTMLCollection [
        <div
          data-testid="icon-checked"
        />,
      ]
    `);
	});

	it('should visually hide the text inside the label', () => {
		const { getByText } = render(
			<Rating render={renderIcon} label="GREAT" testId="item" id="great" value="great" />,
		);

		expectIsVisuallyHidden(getByText('GREAT'));
	});

	it('should visually hide the radio button', () => {
		const { getByTestId } = render(
			<Rating render={renderIcon} label="GREAT" testId="item" id="great" value="great" />,
		);

		const inputContainer = getByTestId('item--input').parentElement;
		expectIsVisuallyHidden(inputContainer!);
	});

	it('should callback when the radio button has its value change', () => {
		const callback = jest.fn();
		const { getByTestId } = render(
			<Rating
				render={renderIcon}
				onChange={callback}
				label="GREAT"
				testId="item"
				id="great"
				value="great"
			/>,
		);

		fireEvent.click(getByTestId('item--label'));

		expect(callback).toHaveBeenCalledWith('great');
	});

	it('should keep the same size when unchecked', () => {
		const { getByTestId } = render(
			<Rating render={renderIcon} label="GREAT" testId="item" id="great" value="great" />,
		);

		expect(getByTestId('item--label').style.transition).toEqual(
			'transform 100ms cubic-bezier(0.15,1,0.3,1)',
		);
		expect(getByTestId('item--label').style.transform).toEqual('');
	});

	it('should increase the icons size when checked', () => {
		const { getByTestId } = render(
			<Rating render={renderIcon} label="GREAT" testId="item" id="great" value="great" isChecked />,
		);

		expect(getByTestId('item--label').style.transform).toEqual('scale(1.2)');
	});

	// https://ecosystem.atlassian.net/browse/OWL-1282
	it.skip('should set a tooltip on the label', () => {
		jest.useFakeTimers();
		const { getByTestId } = render(
			<Rating render={renderIcon} label="GREAT" testId="item" id="great" value="great" />,
		);

		fireEvent.mouseOver(getByTestId('item--icon-container'));
		jest.runTimersToTime(11);
		jest.useRealTimers();

		expect(getByTestId('item--tooltip').textContent).toEqual('GREAT');
	});

	it('should forward the ref to the label element', () => {
		const ref: RefObject<any> = createRef();
		render(
			<Rating render={() => null} label="GREAT" testId="item" id="great" value="great" ref={ref} />,
		);

		expect(ref.current.getAttribute('data-testid')).toEqual('item--label');
	});
});
