import React from 'react';

import { fireEvent, render, screen } from '@atlassian/testing-library';

import { Dialog } from '../../src/entry-points/dialog';

// JSDOM does not implement HTMLDialogElement methods. Mock them.
// eslint-disable-next-line compat/compat -- JSDOM test mocks; not shipping to browsers
const showModalMock = jest.fn(function (this: HTMLDialogElement) {
	Object.defineProperty(this, 'open', { value: true, configurable: true, writable: true });
});
// eslint-disable-next-line compat/compat -- JSDOM test mocks; not shipping to browsers
const closeMock = jest.fn(function (this: HTMLDialogElement) {
	Object.defineProperty(this, 'open', { value: false, configurable: true, writable: true });
});

beforeAll(() => {
	// eslint-disable-next-line compat/compat -- JSDOM test mocks; not shipping to browsers
	HTMLDialogElement.prototype.showModal = showModalMock;
	// eslint-disable-next-line compat/compat -- JSDOM test mocks; not shipping to browsers
	HTMLDialogElement.prototype.close = closeMock;
});

afterAll(() => {
	// @ts-expect-error -- cleanup mock
	// eslint-disable-next-line compat/compat -- JSDOM test mocks; not shipping to browsers
	delete HTMLDialogElement.prototype.showModal;
	// @ts-expect-error -- cleanup mock
	// eslint-disable-next-line compat/compat -- JSDOM test mocks; not shipping to browsers
	delete HTMLDialogElement.prototype.close;
});

afterEach(() => {
	jest.clearAllMocks();
});

describe('Dialog primitive', () => {
	it('calls showModal() when isOpen is true', () => {
		render(
			<Dialog onClose={() => {}} isOpen={true} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		expect(showModalMock).toHaveBeenCalledTimes(1);
	});

	it('does not call showModal() when isOpen is false', () => {
		render(
			<Dialog onClose={() => {}} isOpen={false} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		expect(showModalMock).not.toHaveBeenCalled();
	});

	it('calls close() on unmount when dialog is open', () => {
		const { unmount } = render(
			<Dialog onClose={() => {}} isOpen={true} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		closeMock.mockClear();
		unmount();

		expect(closeMock).toHaveBeenCalledTimes(1);
	});

	it('calls close() when isOpen transitions to false', () => {
		const { rerender } = render(
			<Dialog onClose={() => {}} isOpen={true} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		closeMock.mockClear();

		rerender(
			<Dialog onClose={() => {}} isOpen={false} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		expect(closeMock).toHaveBeenCalled();
	});

	it('calls showModal() when isOpen transitions from false to true', () => {
		const { rerender } = render(
			<Dialog onClose={() => {}} isOpen={false} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		showModalMock.mockClear();

		rerender(
			<Dialog onClose={() => {}} isOpen={true} label="Test dialog">
				<p>Content</p>
			</Dialog>,
		);

		expect(showModalMock).toHaveBeenCalled();
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
