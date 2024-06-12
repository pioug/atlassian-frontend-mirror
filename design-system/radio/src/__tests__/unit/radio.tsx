import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import Radio from '../../radio';

describe('Radio', () => {
	it('should render an input and the content', () => {
		const content = 'content';
		render(<Radio name="name" value="value" label={content} />);
		expect(screen.getByDisplayValue('value')).toBeInTheDocument();
		expect(screen.getByLabelText(content)).toBeInTheDocument();
	});

	describe('props', () => {
		const label = 'Default radio button';

		it('should set disabled to be true if isDisabled is true', () => {
			render(<Radio value="test" isDisabled={true} label={label} />);
			const radio = screen.getByDisplayValue('test') as HTMLInputElement;
			expect(radio).toBeDisabled();
		});

		it('should set disabled to be false if isDisabled is false', () => {
			render(<Radio value="test" isDisabled={false} label={label} />);
			const radio = screen.getByDisplayValue('test') as HTMLInputElement;
			expect(radio).toBeEnabled();
		});

		it('should set required to be true if isRequired is true', () => {
			render(<Radio value="test" isRequired={true} label={label} />);
			const radio = screen.getByDisplayValue('test') as HTMLInputElement;
			expect(radio).toBeRequired();
		});

		it('should set required to be false if isRequired is false', () => {
			render(<Radio value="test" isRequired={false} label={label} />);
			const radio = screen.getByDisplayValue('test') as HTMLInputElement;
			expect(radio).not.toBeRequired();
		});

		it('should set checked to be true if isChecked is true', () => {
			render(<Radio value="test" isChecked={true} label={label} />);
			const radio = screen.getByDisplayValue('test') as HTMLInputElement;
			expect(radio).toBeChecked();
		});

		it('should set checked to be false if isChecked is false', () => {
			render(<Radio value="test" isChecked={false} label={label} />);
			const radio = screen.getByDisplayValue('test') as HTMLInputElement;
			expect(radio).not.toBeChecked();
		});

		it('should set name if name prop is set', () => {
			render(<Radio value="test" name="name-val" label={label} />);
			const radio = screen.getByDisplayValue('test') as HTMLInputElement;
			expect(radio.name).toBe('name-val');
		});

		it('should set value if value prop is set', () => {
			render(<Radio value="value-val" label="test" />);
			const radio = screen.getByLabelText('test') as HTMLInputElement;
			expect(radio.value).toBe('value-val');
		});

		it('should add extra props onto the input', () => {
			render(<Radio label="test" {...{ ['data-foo']: 'radio-bar' }} />);
			const radio = screen.getByLabelText('test') as HTMLInputElement;
			expect(radio).toHaveAttribute('data-foo', 'radio-bar');
		});

		it('should accept input props', () => {
			const spy = jest.fn();
			render(<Radio label="test" onMouseDown={spy} />);
			const radio = screen.getByLabelText('test') as HTMLInputElement;
			fireEvent.mouseDown(radio);

			expect(spy).toHaveBeenCalledTimes(1);
		});

		it('should use the ref prop', () => {
			const ref = React.createRef<HTMLInputElement>();
			render(<Radio label="test" ref={ref} />);

			const input = screen.getByLabelText('test');
			expect(input).toBe(ref.current);
		});
	});

	describe('onChange prop', () => {
		it('should be called once on change', () => {
			const spy = jest.fn();
			render(<Radio label="test" value="kachow" onChange={spy} />);
			const radio = screen.getByLabelText('test') as HTMLInputElement;
			fireEvent.click(radio);
			expect(spy).toHaveBeenCalledTimes(1);
		});

		it('should be reflected to the input', () => {
			let value = '';
			render(
				<Radio
					label="test"
					value="kachow"
					onChange={(e) => {
						value = e.currentTarget.value;
					}}
				/>,
			);
			const radio = screen.getByLabelText('test') as HTMLInputElement;
			fireEvent.click(radio);
			expect(value).toBe('kachow');
		});
	});
});
