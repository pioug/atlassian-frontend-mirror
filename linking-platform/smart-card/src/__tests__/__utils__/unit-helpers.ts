import { screen } from '@atlassian/testing-library/screen';
import {
	act,
	waitFor,
	waitForElementToBeRemoved,
} from '@atlassian/testing-library/testing-library/react';
// oxlint-disable-next-line @typescript-eslint/consistent-type-imports -- userEvent only used in typeof userEvent.setup for param typing
import { userEvent } from '@atlassian/testing-library/user-event';

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
 * Test teardown: closes an embed modal that a test left open.
 *
 * `openEmbedModal` renders into its own React root, so `cleanup` does not unmount it. A modal left
 * open blocks the next test: with the top layer, a modal dialog makes the rest of the page inert.
 * Clicks the close button with `click()`, which works whatever the state of the page, then waits
 * for the exit to finish, as the modal unmounts its root only then.
 */
export const closeOpenEmbedModal = async (): Promise<void> => {
	const closeButton = screen.queryByTestId('smart-embed-preview-modal--close-button');
	if (!closeButton) {
		return;
	}
	act(() => closeButton.click());
	await waitFor(() =>
		expect(screen.queryByTestId('smart-embed-preview-modal')).not.toBeInTheDocument(),
	);
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
