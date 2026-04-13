import { act, screen, waitForElementToBeRemoved } from '@testing-library/react';
import type userEvent from '@testing-library/user-event';

/**
 * This function checks for an exact string match across all children elements.
 *
 * @example
 * <span data-testid="test-span">
 *  <div>Hello</div>
 *  <span>World</span>
 * </span>
 *
 * expectElementWithText('test-span','hello world') is valid
 * expectElementWithText('test-span','hello wo') is invalid
 *
 */
export const expectElementWithText = async (testId: string, text: string): Promise<void> => {
	expect(await screen.findByTestId(testId)).toHaveTextContent(new RegExp(`^${text}$`));
};

/**
 * Close embed modal
 */
export const closeEmbedModal = async (event: ReturnType<typeof userEvent.setup>) => {
	const closeButton = screen.queryByTestId('smart-embed-preview-modal--close-button');
	if (closeButton) {
		await event.click(closeButton);
		act(() => jest.runAllTimers());

		const modal = screen.queryByTestId('smart-embed-preview-modal');
		if (modal) {
			await waitForElementToBeRemoved(() => screen.queryByTestId('smart-embed-preview-modal'));
			act(() => jest.runAllTimers());
		}
	}
};
