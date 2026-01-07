import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Radio from '../../radio';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Radio', () => {
	const user = userEvent.setup();

	it('should render an input and the content', () => {
		const content = 'content';
		render(<Radio name="name" value="value" label={content} />);
		expect(screen.getByDisplayValue('value')).toBeInTheDocument();
		expect(screen.getByDisplayValue('value')).toBeInTheDocument();
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
			const radio = screen.getByDisplayValue('value-val') as HTMLInputElement;
			expect(radio.value).toBe('value-val');
		});

		it('should add extra props onto the input', () => {
			render(<Radio label="test" {...{ ['data-foo']: 'radio-bar' }} />);
			const radio = screen.getByRole('radio') as HTMLInputElement;
			expect(radio).toHaveAttribute('data-foo', 'radio-bar');
		});

		it('should accept input props', async () => {
			const spy = jest.fn();
			render(<Radio label="test" onMouseDown={spy} />);
			const radio = screen.getByRole('radio') as HTMLInputElement;
			await user.click(radio);

			expect(spy).toHaveBeenCalledTimes(1);
		});

		it('should use the ref prop', () => {
			const ref = React.createRef<HTMLInputElement>();
			render(<Radio label="test" ref={ref} />);

			const input = screen.getByRole('radio');
			expect(input).toBe(ref.current);
		});

		it('should pass `aria-label` to radio', () => {
			const label = 'test';
			render(<Radio ariaLabel={label} />);

			const input = screen.getByRole('radio');
			expect(input).toHaveAttribute('aria-label', label);
			expect(input).toHaveAccessibleName(label);
		});

		it('should pass `aria-labelledby` to radio from `labelId', () => {
			const id = 'test';
			const label = 'label';

			render(
				<>
					<p id={id}>{label}</p>
					<Radio labelId={id} />
				</>,
			);

			const input = screen.getByRole('radio');
			expect(input).toHaveAttribute('aria-labelledby', id);
			expect(input).toHaveAccessibleName(label);
		});
	});

	describe('onChange prop', () => {
		it('should be called once on change', async () => {
			const spy = jest.fn();
			render(<Radio label="test" value="kachow" onChange={spy} />);
			const radio = screen.getByDisplayValue('kachow') as HTMLInputElement;
			await user.click(radio);
			expect(spy).toHaveBeenCalledTimes(1);
		});

		it('should be reflected to the input', async () => {
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
			const radio = screen.getByDisplayValue('kachow') as HTMLInputElement;
			await user.click(radio);
			expect(value).toBe('kachow');
		});
	});
});
