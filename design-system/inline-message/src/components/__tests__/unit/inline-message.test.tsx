import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import InlineMessage from '../../../index';

const testId = 'test';

describe('Inline Message', () => {
	it('basic sanity check', () => {
		render(<InlineMessage testId={testId} />);
		expect(screen.getByTestId(testId)).not.toBe(undefined);
	});

	it('should render secondary text and title if provided', () => {
		render(<InlineMessage testId={testId} secondaryText="Secondary text" title="Title" />);

		expect(screen.getByText('Secondary text')).toBeInTheDocument();
		expect(screen.getByText('Title')).toBeInTheDocument();
	});

	it('should not render secondary text or title if they are not passed via props', () => {
		render(<InlineMessage testId={testId} />);

		expect(screen.queryByTestId(`${testId}--text`)).not.toBeInTheDocument();
		expect(screen.queryByTestId(`${testId}--title`)).not.toBeInTheDocument();
	});

	describe('dialog state', () => {
		const user = userEvent.setup();

		it('should start closed, no content on showing', () => {
			render(
				<InlineMessage>
					<div data-testid={testId} />
				</InlineMessage>,
			);

			expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
		});

		it('should toggle when the button is clicked', async () => {
			render(
				<InlineMessage testId={testId}>
					<div>Hello</div>
				</InlineMessage>,
			);

			const button = screen.getByTestId(`${testId}--button`);
			await user.click(button);
			expect(screen.getByText('Hello')).toBeInTheDocument();
		});

		it('should hide when the button is clicked twice', async () => {
			render(
				<InlineMessage testId={testId}>
					<div>Hello</div>
				</InlineMessage>,
			);

			const button = screen.getByTestId(`${testId}--button`);
			await user.click(button);
			expect(screen.getByText('Hello')).toBeInTheDocument();

			await user.click(button);
			expect(screen.queryByText('Hello')).not.toBeInTheDocument();
		});
	});
});
