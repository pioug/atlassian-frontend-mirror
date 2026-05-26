import React from 'react';
import { render, screen, userEvent } from '@atlassian/testing-library';
import { type FileIdentifier } from '@atlaskit/media-client';
import { Navigation, NavigationBase, prevNavButtonId, nextNavButtonId } from '../../../navigation';
import { KeyboardEventWithKeyCode } from '@atlaskit/media-test-helpers';

/**
 * Skipped two tests in here that are failing due to an issue with synthetic keyboard events
 * TODO: JEST-23 Fix these tests
 */
describe('Navigation', () => {
	const identifier: FileIdentifier = {
		id: 'some-id',
		occurrenceKey: 'some-custom-occurrence-key',
		mediaItemType: 'file',
	};

	const identifier2: FileIdentifier = {
		id: 'some-id-2',
		occurrenceKey: 'some-custom-occurrence-key',
		mediaItemType: 'file',
	};

	const identifier2Duplicated: FileIdentifier = {
		id: 'some-id-2',
		occurrenceKey: 'some-other-occurrence-key',
		mediaItemType: 'file',
	};

	const identifier3: FileIdentifier = {
		id: 'some-id-3',
		occurrenceKey: 'some-custom-occurrence-key',
		mediaItemType: 'file',
	};

	const nonFoundIdentifier: FileIdentifier = {
		id: 'some-other-id',
		occurrenceKey: 'some-custom-occurrence-key',
		mediaItemType: 'file',
	};

	const items = [identifier, identifier2, identifier3, identifier2Duplicated];

	function renderBaseComponent() {
		const createAnalyticsEventSpy = jest.fn();
		createAnalyticsEventSpy.mockReturnValue({ fire: jest.fn() });
		render(
			<NavigationBase
				createAnalyticsEvent={createAnalyticsEventSpy}
				items={[identifier, identifier2, identifier3]}
				selectedItem={identifier2}
				onChange={() => {}}
			/>,
		);
		return { createAnalyticsEventSpy };
	}

	it('should show right arrow if there are items on the right', () => {
		render(<Navigation onChange={() => {}} items={items} selectedItem={identifier} />);
		expect(screen.getByTestId(nextNavButtonId)).toBeInTheDocument();
	});

	it('should show left arrow if there are items on the left', () => {
		render(<Navigation onChange={() => {}} items={items} selectedItem={identifier3} />);
		expect(screen.getByTestId(prevNavButtonId)).toBeInTheDocument();
	});

	it('should not show arrows if there is only one item', () => {
		render(<Navigation onChange={() => {}} items={[identifier]} selectedItem={identifier} />);
		expect(screen.queryByTestId(prevNavButtonId)).not.toBeInTheDocument();
		expect(screen.queryByTestId(nextNavButtonId)).not.toBeInTheDocument();
	});

	it('should handle items with the same id', () => {
		render(<Navigation onChange={() => {}} items={items} selectedItem={identifier2Duplicated} />);
		expect(screen.getByTestId(prevNavButtonId)).toBeInTheDocument();
		expect(screen.getByTestId(nextNavButtonId)).toBeInTheDocument();
	});

	it('should show both arrows if there are items in both sides', async () => {
		render(<Navigation onChange={() => {}} items={items} selectedItem={identifier2} />);
		expect(screen.getByTestId(prevNavButtonId)).toBeInTheDocument();
		expect(screen.getByTestId(nextNavButtonId)).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('should call onChange callback when left arrow is clicked', async () => {
		const onChange = jest.fn();
		render(<Navigation onChange={onChange} items={items} selectedItem={identifier2} />);
		await userEvent.click(screen.getByTestId(prevNavButtonId));
		expect(onChange).toHaveBeenCalledWith(identifier);
	});

	it('should call onChange callback when right arrow is clicked', async () => {
		const onChange = jest.fn();
		render(<Navigation onChange={onChange} items={items} selectedItem={identifier} />);
		await userEvent.click(screen.getByTestId(nextNavButtonId));
		expect(onChange).toHaveBeenCalledWith(identifier2);
	});

	it('should not show any arrows if selectedItem is not found', () => {
		const onChange = jest.fn();
		render(<Navigation onChange={onChange} items={items} selectedItem={nonFoundIdentifier} />);
		expect(screen.queryByTestId(prevNavButtonId)).not.toBeInTheDocument();
		expect(screen.queryByTestId(nextNavButtonId)).not.toBeInTheDocument();
	});

	describe('Shortcuts', () => {
		it.skip('should call onChange callback when left ARROW key is pressed', () => {
			const onChange = jest.fn();
			render(<Navigation onChange={onChange} items={items} selectedItem={identifier2} />);
			const e = new KeyboardEventWithKeyCode('keydown', {
				bubbles: true,
				cancelable: true,
				keyCode: 37,
			});
			document.dispatchEvent(e);
			expect(onChange).toHaveBeenCalledWith(identifier);
		});

		it.skip('should call onChange callback when right ARROW key is pressed', () => {
			const onChange = jest.fn();
			render(<Navigation onChange={onChange} items={items} selectedItem={identifier} />);
			const e = new KeyboardEventWithKeyCode('keydown', {
				bubbles: true,
				cancelable: true,
				keyCode: 39,
			});
			document.dispatchEvent(e);
			expect(onChange).toHaveBeenCalledWith(identifier2);
		});
	});

	describe('Analytics', () => {
		it('should fire analytics on right arrow click', async () => {
			const { createAnalyticsEventSpy } = renderBaseComponent();
			await userEvent.click(screen.getByTestId(nextNavButtonId));
			expect(createAnalyticsEventSpy).toHaveBeenCalled();
		});

		it('should fire analytics on left arrow click', async () => {
			const { createAnalyticsEventSpy } = renderBaseComponent();
			await userEvent.click(screen.getByTestId(prevNavButtonId));
			expect(createAnalyticsEventSpy).toHaveBeenCalled();
		});
	});
});
