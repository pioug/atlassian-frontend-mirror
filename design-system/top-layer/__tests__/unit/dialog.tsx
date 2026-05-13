import React from 'react';

import { fireEvent, render, screen } from '@atlassian/testing-library';

import { Dialog } from '../../src/entry-points/dialog';

describe('Dialog primitive', () => {
	it('opens dialog when isOpen is true', () => {
		render(
			<Dialog onClose={() => {}} isOpen={true} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		const dialogEl = screen.getByRole('dialog', { hidden: true });
		expect(dialogEl).toHaveAttribute('open');
	});

	it('does not open dialog when isOpen is false', () => {
		render(
			<Dialog onClose={() => {}} isOpen={false} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		const dialogEl = screen.getByRole('dialog', { hidden: true });
		expect(dialogEl).not.toHaveAttribute('open');
	});

	it('closes dialog on unmount when dialog is open', () => {
		const { unmount } = render(
			<Dialog onClose={() => {}} isOpen={true} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		const dialogEl = screen.getByRole('dialog', { hidden: true });
		expect(dialogEl).toHaveAttribute('open');

		unmount();

		expect(dialogEl).not.toHaveAttribute('open');
	});

	it('closes dialog when isOpen transitions to false', () => {
		const { rerender } = render(
			<Dialog onClose={() => {}} isOpen={true} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		const dialogEl = screen.getByRole('dialog', { hidden: true });
		expect(dialogEl).toHaveAttribute('open');

		rerender(
			<Dialog onClose={() => {}} isOpen={false} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		expect(dialogEl).not.toHaveAttribute('open');
	});

	it('opens dialog when isOpen transitions from false to true', () => {
		const { rerender } = render(
			<Dialog onClose={() => {}} isOpen={false} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		const dialogEl = screen.getByRole('dialog', { hidden: true });
		expect(dialogEl).not.toHaveAttribute('open');

		rerender(
			<Dialog onClose={() => {}} isOpen={true} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		expect(dialogEl).toHaveAttribute('open');
	});

	it('fires onClose with reason "overlay-click" when dialog element itself is clicked', () => {
		const onClose = jest.fn();

		render(
			<Dialog onClose={onClose} isOpen={true} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		const dialogEl = screen.getByRole('dialog', { hidden: true });
		fireEvent.click(dialogEl);

		expect(onClose).toHaveBeenCalledWith({ reason: 'overlay-click' });
	});

	it('does NOT fire onClose when a child element is clicked', () => {
		const onClose = jest.fn();

		render(
			<Dialog onClose={onClose} isOpen={true} label="Test dialog">
				<p>Click me</p>
			</Dialog>,
		);

		fireEvent.click(screen.getByText('Click me'));
		expect(onClose).not.toHaveBeenCalled();
	});

	it('applies style prop to the dialog element', () => {
		const testStyle = { width: '800px' };
		render(
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- testing style passthrough
			<Dialog onClose={() => {}} isOpen={true} label="Test dialog" style={testStyle}>
				<p>Content</p>
			</Dialog>,
		);

		const dialogEl = screen.getByRole('dialog', { hidden: true });
		expect(dialogEl).toHaveStyle(testStyle);
	});

	it('should be accessible', async () => {
		const { container } = render(
			<Dialog onClose={() => {}} isOpen={true} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		await expect(container).toBeAccessible();
	});
});
