// oxlint-disable-next-line @typescript-eslint/consistent-type-imports -- userEvent only used in typeof userEvent.setup for param typing
import { act, screen, userEvent, waitForElementToBeRemoved } from '@atlassian/testing-library';

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
export const closeEmbedModal = async (
	event: Awaited<ReturnType<typeof userEvent.setup>>,
): Promise<void> => {
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
