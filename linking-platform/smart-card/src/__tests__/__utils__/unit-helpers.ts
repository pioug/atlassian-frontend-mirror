import { screen } from '@testing-library/react';

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
