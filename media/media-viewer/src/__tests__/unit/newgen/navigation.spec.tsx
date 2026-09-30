import React from 'react';

import ArrowLeftIcon from '@atlaskit/icon/core/arrow-left';
import ArrowRightIcon from '@atlaskit/icon/core/arrow-right';
import ChevronLeftIcon from '@atlaskit/icon/core/chevron-left';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import { type FileIdentifier } from '@atlaskit/media-client';
import { KeyboardEventWithKeyCode } from '@atlaskit/media-test-helpers';
import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { render, screen, userEvent } from '@atlassian/testing-library';

import { InsetViewerProvider } from '../../../insetViewerContext';
import { Navigation, NavigationBase, prevNavButtonId, nextNavButtonId } from '../../../navigation';

jest.mock('@atlaskit/icon/core/arrow-left', () => {
	const original = jest.requireActual('@atlaskit/icon/core/arrow-left');
	return { __esModule: true, ...original, default: jest.fn(original.default) };
});
jest.mock('@atlaskit/icon/core/arrow-right', () => {
	const original = jest.requireActual('@atlaskit/icon/core/arrow-right');
	return { __esModule: true, ...original, default: jest.fn(original.default) };
});
jest.mock('@atlaskit/icon/core/chevron-left', () => {
	const original = jest.requireActual('@atlaskit/icon/core/chevron-left');
	return { __esModule: true, ...original, default: jest.fn(original.default) };
});
jest.mock('@atlaskit/icon/core/chevron-right', () => {
	const original = jest.requireActual('@atlaskit/icon/core/chevron-right');
	return { __esModule: true, ...original, default: jest.fn(original.default) };
});

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

	describe('Accessible labels (platform_media_a11y_nav_button_labels)', () => {
		it('uses descriptive "Previous attachment" / "Next attachment" labels when the gate is on', () => {
			passGate('platform_media_a11y_nav_button_labels');
			render(<Navigation onChange={() => {}} items={items} selectedItem={identifier2} />);
			expect(screen.getByRole('button', { name: 'Previous attachment' })).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Next attachment' })).toBeInTheDocument();
		});

		it('falls back to "Previous" / "Next" labels when the gate is off', () => {
			failGate('platform_media_a11y_nav_button_labels');
			render(<Navigation onChange={() => {}} items={items} selectedItem={identifier2} />);
			expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
		});
	});

	describe('Inset viewer arrows', () => {
		const renderInset = (selectedItem = identifier2, onChange = jest.fn()) => {
			render(
				<InsetViewerProvider isInsetViewer>
					<Navigation onChange={onChange} items={items} selectedItem={selectedItem} />
				</InsetViewerProvider>,
			);
			return { onChange };
		};

		beforeEach(() => {
			jest.mocked(ArrowLeftIcon).mockClear();
			jest.mocked(ArrowRightIcon).mockClear();
			jest.mocked(ChevronLeftIcon).mockClear();
			jest.mocked(ChevronRightIcon).mockClear();
		});

		it('should render the arrow icons in inset mode', () => {
			renderInset();

			expect(ArrowLeftIcon).toHaveBeenCalled();
			expect(ArrowRightIcon).toHaveBeenCalled();
			expect(ChevronLeftIcon).not.toHaveBeenCalled();
			expect(ChevronRightIcon).not.toHaveBeenCalled();
		});

		it('should render the chevron icons outside inset mode', () => {
			render(<Navigation onChange={jest.fn()} items={items} selectedItem={identifier2} />);

			expect(ChevronLeftIcon).toHaveBeenCalled();
			expect(ChevronRightIcon).toHaveBeenCalled();
			expect(ArrowLeftIcon).not.toHaveBeenCalled();
			expect(ArrowRightIcon).not.toHaveBeenCalled();
		});

		it.each([
			{ direction: 'next', selectedItem: identifier, testId: nextNavButtonId },
			{ direction: 'prev', selectedItem: identifier3, testId: prevNavButtonId },
		])(
			'should drive navigation from a mouse click on $direction',
			async ({ selectedItem, testId }) => {
				const { onChange } = renderInset(selectedItem);
				await userEvent.click(screen.getByTestId(testId));
				expect(onChange).toHaveBeenCalledWith(identifier2);

				await expect(document.body).toBeAccessible();
			},
		);

		it('should use the same accessible labels as the overlay arrows', () => {
			passGate('platform_media_a11y_nav_button_labels');
			renderInset();
			expect(screen.getByRole('button', { name: 'Previous attachment' })).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Next attachment' })).toBeInTheDocument();
		});

		it('should fall back to the short labels when the a11y gate is off', () => {
			failGate('platform_media_a11y_nav_button_labels');
			renderInset();
			expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
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
