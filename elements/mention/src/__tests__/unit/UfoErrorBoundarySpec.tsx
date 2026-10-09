import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { UfoErrorBoundary } from '../../components/Mention/ufoExperiences';

const mockFailure = jest.fn();

jest.mock('@atlaskit/ufo/concurrent-experience', () => ({
	ConcurrentExperience: jest.fn().mockImplementation(() => ({
		getInstance: () => ({ failure: mockFailure }),
	})),
}));

describe('UfoErrorBoundary recovery', () => {
	beforeEach(() => {
		mockFailure.mockClear();
		jest.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('recovers when the parent supplies corrected child props, preserving siblings', () => {
		const Child = ({ shouldThrow }: { shouldThrow: boolean }) => {
			if (shouldThrow) {
				throw new Error('Render failed');
			}
			return <span>Recovered child</span>;
		};
		const content = (shouldThrow: boolean) => (
			<>
				<span>Unaffected sibling</span>
				<UfoErrorBoundary id="test">
					<Child shouldThrow={shouldThrow} />
				</UfoErrorBoundary>
			</>
		);

		const { rerender } = render(content(true));
		expect(screen.getByText('Unaffected sibling')).toBeInTheDocument();
		expect(screen.queryByText('Recovered child')).not.toBeInTheDocument();
		expect(mockFailure).toHaveBeenCalledTimes(1);

		rerender(content(false));
		expect(screen.getByText('Recovered child')).toBeInTheDocument();
		expect(mockFailure).toHaveBeenCalledTimes(1);
	});

	it('retries on parent updates even with the same child element, without looping', () => {
		const Child = jest.fn(() => <span>Recovered child</span>);
		Child.mockImplementation(() => {
			throw new Error('Render failed');
		});
		const child = <Child />;
		const content = () => <UfoErrorBoundary id="test">{child}</UfoErrorBoundary>;

		const { rerender } = render(content());
		expect(mockFailure).toHaveBeenCalledTimes(1);

		rerender(content());
		expect(mockFailure).toHaveBeenCalledTimes(2);
		expect(screen.queryByText('Recovered child')).not.toBeInTheDocument();

		Child.mockImplementation(() => <span>Recovered child</span>);
		rerender(content());
		expect(screen.getByText('Recovered child')).toBeInTheDocument();
		expect(mockFailure).toHaveBeenCalledTimes(2);
	});

	it('recovers on a parent update after an already mounted child fails', async () => {
		const Child = () => {
			const [shouldThrow, setShouldThrow] = React.useState(false);
			if (shouldThrow) {
				throw new Error('Update failed');
			}
			return <button onClick={() => setShouldThrow(true)}>Trigger failure</button>;
		};
		const content = () => (
			<UfoErrorBoundary id="test">
				<Child />
			</UfoErrorBoundary>
		);

		const { rerender } = render(content());
		await userEvent.click(screen.getByRole('button', { name: 'Trigger failure' }));
		expect(screen.queryByRole('button')).not.toBeInTheDocument();
		expect(mockFailure).toHaveBeenCalledTimes(1);

		rerender(content());
		expect(screen.getByRole('button', { name: 'Trigger failure' })).toBeInTheDocument();
		expect(mockFailure).toHaveBeenCalledTimes(1);
	});

	it('preserves healthy child state across parent updates', async () => {
		const Child = () => {
			const [count, setCount] = React.useState(0);
			return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
		};
		const content = () => (
			<UfoErrorBoundary id="test">
				<Child />
			</UfoErrorBoundary>
		);

		const { container, rerender } = render(content());
		await userEvent.click(screen.getByRole('button', { name: 'Count: 0' }));
		rerender(content());
		expect(screen.getByRole('button', { name: 'Count: 1' })).toBeInTheDocument();
		expect(mockFailure).not.toHaveBeenCalled();
		await expect(container).toBeAccessible();
	});
});
