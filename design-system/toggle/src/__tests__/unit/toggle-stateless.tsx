import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Toggle from '../../toggle';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Toggle component', () => {
	const label = 'Label';

	describe('defaultChecked is absent', () => {
		it('should be stateless when defaultChecked is absent - is not checked', async () => {
			const user = userEvent.setup();
			const onChange = jest.fn();
			render(<Toggle size="large" isChecked={false} onChange={onChange} label={label} />);

			const labelElement = screen.getByLabelText(label);

			expect(labelElement).toBeInTheDocument();
			expect(labelElement).not.toBeChecked();

			await user.click(labelElement);
			expect(onChange).toHaveBeenCalled();

			const callArgs = onChange.mock.calls[0];

			// Check if the first argument is a React.ChangeEvent<HTMLInputElement>
			expect(callArgs[0]).toHaveProperty('target');

			// Check if the second argument is a UIAnalyticsEvent
			expect(callArgs[1]).toHaveProperty('context');

			expect(labelElement).not.toBeChecked();
		});

		it('should be stateless when defaultChecked is absent - is checked', async () => {
			const user = userEvent.setup();
			const onChange = jest.fn();
			render(<Toggle size="large" isChecked onChange={onChange} label={label} />);

			const labelElement = screen.getByLabelText(label);

			expect(labelElement).toBeInTheDocument();
			expect(labelElement).toBeChecked();

			await user.click(labelElement);
			expect(onChange).toHaveBeenCalled();

			expect(labelElement).toBeChecked();
		});
	});

	describe('defaultChecked is present', () => {
		it('should be stateless when isChecked absent - toggle off', async () => {
			const user = userEvent.setup();
			const onChange = jest.fn();
			render(<Toggle size="large" defaultChecked={false} onChange={onChange} label={label} />);

			const labelElement = screen.getByLabelText(label);

			expect(labelElement).toBeInTheDocument();
			expect(labelElement).not.toBeChecked();

			await user.click(labelElement);
			expect(onChange).toHaveBeenCalled();

			expect(labelElement).toBeChecked();
		});

		it('should be stateless when isChecked absent - toggle on', async () => {
			const user = userEvent.setup();
			const onChange = jest.fn();
			render(<Toggle size="large" label={label} defaultChecked onChange={onChange} />);

			const labelElement = screen.getByLabelText(label);

			expect(labelElement).toBeInTheDocument();

			expect(labelElement).toBeChecked();

			await user.click(labelElement);
			expect(onChange).toHaveBeenCalled();

			expect(labelElement).not.toBeChecked();
		});
	});

	describe('using isChecked and defaultChecked together', () => {
		it('should be use isChecked', async () => {
			const user = userEvent.setup();
			const onChange = jest.fn();
			render(
				<Toggle size="large" defaultChecked isChecked={false} onChange={onChange} label={label} />,
			);

			const labelElement = screen.getByLabelText(label);

			expect(labelElement).toBeInTheDocument();
			expect(labelElement).not.toBeChecked();

			await user.click(labelElement);
			expect(onChange).toHaveBeenCalled();

			expect(labelElement).not.toBeChecked();
		});
	});
});
