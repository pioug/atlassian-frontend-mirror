import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import Toggle from '../../toggle';

describe('Toggle component', () => {
	const label = 'Label';

	describe('defaultChecked is absent', () => {
		it('should be stateless when defaultChecked is absent - is not checked', () => {
			const onChange = jest.fn();
			render(<Toggle size="large" isChecked={false} onChange={onChange} label={label} />);

			const labelElement = screen.getByLabelText(label);

			expect(labelElement).toBeInTheDocument();
			expect(labelElement).not.toBeChecked();

			fireEvent.click(labelElement);
			expect(onChange).toHaveBeenCalled();

			const callArgs = onChange.mock.calls[0];

			// Check if the first argument is a React.ChangeEvent<HTMLInputElement>
			expect(callArgs[0]).toHaveProperty('target');

			// Check if the second argument is a UIAnalyticsEvent
			expect(callArgs[1]).toHaveProperty('context');

			expect(labelElement).not.toBeChecked();
		});

		it('should be stateless when defaultChecked is absent - is checked', () => {
			const onChange = jest.fn();
			render(<Toggle size="large" isChecked onChange={onChange} label={label} />);

			const labelElement = screen.getByLabelText(label);

			expect(labelElement).toBeInTheDocument();
			expect(labelElement).toBeChecked();

			fireEvent.click(labelElement);
			expect(onChange).toHaveBeenCalled();

			expect(labelElement).toBeChecked();
		});
	});

	describe('defaultChecked is present', () => {
		it('should be stateless when isChecked absent - toggle off', () => {
			const onChange = jest.fn();
			render(<Toggle size="large" defaultChecked={false} onChange={onChange} label={label} />);

			const labelElement = screen.getByLabelText(label);

			expect(labelElement).toBeInTheDocument();
			expect(labelElement).not.toBeChecked();

			fireEvent.click(labelElement);
			expect(onChange).toHaveBeenCalled();

			expect(labelElement).toBeChecked();
		});

		it('should be stateless when isChecked absent - toggle on', () => {
			const onChange = jest.fn();
			render(<Toggle size="large" label={label} defaultChecked onChange={onChange} />);

			const labelElement = screen.getByLabelText(label);

			expect(labelElement).toBeInTheDocument();

			expect(labelElement).toBeChecked();

			fireEvent.click(labelElement);
			expect(onChange).toHaveBeenCalled();

			expect(labelElement).not.toBeChecked();
		});
	});

	describe('using isChecked and defaultChecked together', () => {
		it('should be use isChecked', () => {
			const onChange = jest.fn();
			render(
				<Toggle size="large" defaultChecked isChecked={false} onChange={onChange} label={label} />,
			);

			const labelElement = screen.getByLabelText(label);

			expect(labelElement).toBeInTheDocument();
			expect(labelElement).not.toBeChecked();

			fireEvent.click(labelElement);
			expect(onChange).toHaveBeenCalled();

			expect(labelElement).not.toBeChecked();
		});
	});
});
